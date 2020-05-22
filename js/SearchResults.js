class SearchResults {

  constructor(container) {

    let loading = document.createElement("DIV");
    loading.classList.add("disapear", "text-primary", "spinner-border");
    loading.setAttribute("role", "status");
    this.loading = loading;
    let textLoading = document.createElement("SPAN");
    textLoading.setAttribute("id",'loading');
    textLoading.textContent = "loading";
    textLoading.classList.add("sr-only");
    loading.append(textLoading);
    this.id = container;

  }

  renderResults(data, callback) {
    document.getElementById("main").insertBefore(this.loading, this.container);
    let search = document.getElementById("searchbar").value;
    var urlParams = new URLSearchParams(window.location.search);
    var url = window.location.href.split("?")[0];
    this.loading.classList.remove("disapear");
    ModifyUrl(urlParams, url, search);
    this.id.innerText = "";

    if (data.length === 0) {
      let list = document.createElement("LI");
      list.textContent = "Sorry there is no results";
      this.id.append(list);
      this.loading.classList.add("disapear");
    } else {


      console.log(data);
         data=this.transformArray(data)
         setTimeout(()=>{data.map(data => {
          let list = document.createElement("LI");
          let link = document.createElement("A");
          let symbolSearch = document.createElement("SPAN");
          symbolSearch.classList.add("symbol-list", "mx-2");
          let compareButton = document.createElement("BUTTON");
          compareButton.classList.add("btn", "btn-primary", "compare-button");
          compareButton.textContent = "Compare";
          highlightSearch(data, search, link, symbolSearch);
          link.href = "./company.html?symbol=" + data.symbol;
          list.append(link, symbolSearch);
          list.className = "list-style";
          let image = document.createElement("IMG");
          let percentage = document.createElement("span");
          if(data.profile.image){
          image.src = `${data.profile.image}`;
          image.classList.add("image-list-size");
          }
          if (data.profile.changesPercentage) {
            percentage.textContent = `${data.profile.changesPercentage}`;
            percentage.classList.add("symbol-list");

            let thenum = data.profile.changesPercentage.split("(");
            thenum = thenum[1].split(")");
            thenum = parseFloat(thenum[0]);
            if (thenum >= 0) {
              percentage.classList.add("positive-percentage");
              percentage.classList.remove("negative-percentage");
            } else {
              percentage.classList.remove("positive-percentage");
              percentage.classList.add("negative-percentage");
            }
          }

          list.prepend(image);
          list.append(percentage);
          list.append(compareButton);
          list.append(compareButton);
          this.id.append(list);
          // detect when we click on compare bouton
          compareButton.addEventListener("click", () => {
            callback(data, compareButton);
            compareButton.classList.add("pressed");
            compareButton.textContent = "Selected";
          });

          
          // make the button blue again if we delte the button from the compare div
          if(document.getElementById(data.symbol)){
            compareButton.classList.add("pressed");
            compareButton.textContent="Selected";
            document.getElementById(data.symbol).addEventListener("click",()=>{
              compareButton.classList.remove("pressed");
              compareButton.textContent="Compare"
            })
          }
        });

        this.loading.classList.add("disapear"); },1000)
          
    }

    function ModifyUrl(urlParams, url, search) {
      //modifying the url to add querry and the search of the user
      if (urlParams.has("querry")) {
        urlParams.set("querry", search);
        window.history.pushState({}, document.title, url + "?" + urlParams);
      } else {
        urlParams.append("querry", search);
        window.history.pushState({}, document.title, url + "?" + urlParams);
      }

    }
    function highlightSearch(data, search, link, symbolSearch) {
      //highlight the text in yellow depending of the user's search
      let highlightText = document.createElement("SPAN");
      highlightText.classList.add("highlights");
      if(data.profile.companyName){
      search=search.toLowerCase();
      let nameToinclude = data.profile.companyName;
      let newSearch = search.replace(/(^.)/, m => m.toUpperCase());
      let nameToincludeTable = nameToinclude.split(search);
      
      for (let k = 0; k < nameToincludeTable.length; k++) {
        let nameToincludeTableUpper = nameToincludeTable[k].split(newSearch);
        for (let m = 0; m < nameToincludeTableUpper.length; m++) {
          let nameToincludeupper=nameToincludeTableUpper[m].split(search.toUpperCase());
          for(let o=0 ;o< nameToincludeupper.length;o++){

            link.append(nameToincludeupper[o])
            highlightText.textContent=search.toUpperCase();
            if (o < nameToincludeupper.length - 1) {
              link.append(highlightText.cloneNode(true));
            }

          }
          highlightText.textContent = newSearch; 
          if (m < nameToincludeTableUpper.length - 1) {
            link.append(highlightText.cloneNode(true));
          }
        }
        highlightText.textContent = search;
        if (k < nameToincludeTable.length - 1) {
          link.append(highlightText.cloneNode(true));
        }

      }
    }

      highlightText.textContent = search.toUpperCase();
      let symbolToInclude = data.symbol;
      symbolToInclude = symbolToInclude.split(search.toUpperCase());

      for (let k = 0; k < symbolToInclude.length; k++) {
        symbolSearch.append(symbolToInclude[k]);

        if (k < symbolToInclude.length - 1) {
          symbolSearch.append(highlightText.cloneNode(true));
        }

      }
    }

  }

  transformArray(data){
    let newdata=[];
         for(let h=0;h<data.length;h++){
          if(data[h].companyProfiles){
            for(let f= 0 ; f<data[h].companyProfiles.length;f++){
              newdata.push(data[h].companyProfiles[f]);
            }
          }
          else{
            newdata.push(data[h]);
          }
         }
      return newdata;
  }
}



