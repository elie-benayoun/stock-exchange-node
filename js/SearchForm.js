

class SearchForm{
    constructor(container){
        let containerUp=document.createElement("DIV");
        containerUp.setAttribute("id","container-up");
        containerUp.classList.add("up-container","mb-3","align-self-center");
        let checkContainer=document.createElement("DIV");
        let myInput=document.createElement("INPUT");
        let mybtn=document.createElement("BUTTON");
        let CompareContainer=document.createElement("DIV");
        let linkCompareContainer=document.createElement("A");
        let checkbox=document.createElement("INPUT");
        checkbox.setAttribute("type","checkbox");
        checkbox.classList.add("form-check-input","mx-1");
        checkbox.setAttribute("id","check");
        this.checkbox=checkbox
        let label=document.createElement("LABEL");
        label.classList.add("form-check-label","mx-4","mb-2");
        label.setAttribute("for","check");
        label.textContent="Don't save result"
        linkCompareContainer.setAttribute("id","compareLink");
        CompareContainer.append(linkCompareContainer);
        let main=document.getElementById("main");
        CompareContainer.setAttribute("id","compareContainer");
        CompareContainer.classList.add("disapear");
        CompareContainer.classList.add("compare-container","py-2");
        myInput.classList.add("form-control");
        mybtn.classList.add("btn","btn-light");
        mybtn.textContent="Refresh";
        this.mybtn=mybtn;
        myInput.setAttribute("id","searchbar");
        myInput.setAttribute("type","text");
        myInput.setAttribute("placeholder","Search");
        myInput.setAttribute("arial-label","search");
        containerUp.append(myInput,mybtn);
        checkContainer.append(checkbox,label)
        container.prepend(containerUp,checkContainer);
        main.prepend(CompareContainer);
        
    }
    onSearch(callback) {
        var urlParams = new URLSearchParams(window.location.search);
        const myInput=document.getElementById("searchbar");
        const checkbox=document.getElementById("check");
          if (urlParams.has("querry")) {
            myInput.value=urlParams.get("querry");
            doFetch();
          }

       
        myInput.addEventListener("keyup", debounce(doFetch, 500));
        this.mybtn.addEventListener("click",()=>{
          window.location.search=window.location.search;
        });
        function debounce(debounceFunction, delay) {
            var timer = null;
            return function() {
              clearTimeout(timer);
              timer = setTimeout(function() {
                debounceFunction();
              }, delay);
            };
          }
          function doFetch(){
            // receive the list of companies from the server
            fetch(`http://localhost:3000/search?query=${myInput.value}&save=${checkbox.checked}`)
            .then(response=>{
              return response.json()
            })
            .then(data=>{
              callback(data)
            })
          }
          
        
    }
}