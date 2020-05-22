const express = require("express");
require("isomorphic-fetch");
const cors = require("cors");
const app = express();
app.use(cors());
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url =
  "mongodb://localhost:27017/";
let db;
MongoClient.connect(url, function(err, client) {
  db = client.db("newdb");
});

app.get("/search", (req, res) => {
  searchNasdaqWithCompanyProfileOptimized(req.query.query).then(companies => {
    let save = req.query.save;
    if (save === "false") {
      let obj = {
        search: req.query.query,
        result: companies,
        date: new Date()
      };
      db.collection("Search").insertOne(obj);
    }
    res.send(companies);
  });
});

app.get("/search-history", (req, res) => {
  db.collection("Search")
    .find()
    .toArray()
    .then(data => {
      res.send(data);
    });
});

app.delete("/search-history/:id", (req, res) => {
  let myid = req.params.id;
  db.collection("Search")
    .deleteOne({ _id: new mongodb.ObjectID(myid) })
    .then(() => {
      res.send(true);
    });
});

app.delete("/search-history-delete-all", (req, res) => {
  db.collection("Search")
    .drop()
    .then(() => {
      console.log("collection deleted");
      res.send(true);
    });
});

app.use(function(req, res, next) {
  res.status(404).send("Unable to find the requested resource!");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

async function searchNasdaq(query) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ&apikey=9e70ad8f1cbec848c988d1ae31230d7f`
  );
  let data = await response.json();
  return data;
}

async function searchNasdaqWithCompanyProfileOptimized(query) {
  const companies = await searchNasdaq(query);
  const requestsUrls = [];
  let currentRequest = null;
  let currentRequestCompaniesNumber = 0;
  companies.forEach(company => {
    if (!currentRequest) {
      currentRequest = `https://financialmodelingprep.com/api/v3/company/profile/${company.symbol}`;
      currentRequestCompaniesNumber = 1;
    } else {
      currentRequest += `,${company.symbol}`;
      currentRequestCompaniesNumber += 1;
    }
    if (currentRequestCompaniesNumber === 3) {
      requestsUrls.push(currentRequest+"?apikey=9e70ad8f1cbec848c988d1ae31230d7f");
      currentRequest = null;
      currentRequestCompaniesNumber = 0;
    }
  });
  if (currentRequest) {
    requestsUrls.push(currentRequest+"?apikey=9e70ad8f1cbec848c988d1ae31230d7f");
  }
  const requests = requestsUrls.map(async url => {
    const response = await fetch(url);
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [data];
  });
  const responses = await Promise.all(requests);
  return responses.reduce((prev, array) => {
    return [...prev, ...array];
  }, []);
}
