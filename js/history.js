


class History{
    constructor(parent){
        this.parent=parent;
    }

    load(){
        this.parent.textContent='';
        fetch("http://localhost:3000/search-history")
        .then(res=>{
            return res.json()
        })
        .then(data =>{
            console.log(data);
            data=data.reverse();
            data.map(data=>{
            let rowContainer=document.createElement("DIV");
            rowContainer.classList.add("row","shadow-lg","p-3","mb-5","rounded-lg");
            let spaceBegin=document.createElement("DIV");
            spaceBegin.classList.add("col-md-1");
            let spaceEnd=document.createElement("DIV");
            spaceEnd.classList.add("col-md-1");
            let firstDiv=document.createElement("DIV");
            firstDiv.classList.add("col-md-4","text-center");
            let title=document.createElement("H3");
            if(data.search){
                title.textContent=`Search: ${data.search}`;
            }
            else{
                title.textContent="There was no search"
            }
            firstDiv.append(title);
            let secondDiv=document.createElement("DIV");
            secondDiv.classList.add("col-md-3","text-center");
            secondDiv.textContent=new Date(data.date);
            let thirdDiv = document.createElement("DIV");
            thirdDiv.classList.add("col-md-2","text-center");
             const result = new SearchResults(thirdDiv);
             let newdata =result.transformArray(data.result);
             let link=document.createElement("A");
             link.href="./index.html?querry="+data.search;
             link.classList.add("history-link");
             if(newdata.length>0){
                link.textContent=`${newdata.length} results`
             }
             else{
                link.textContent=`There was no results`
             }
            thirdDiv.append(link);
            let fourthDiv=document.createElement('DIV');
            fourthDiv.classList.add('col-md-1','text-center',"py-2");
            let deleteButton=document.createElement('BUTTON');
            deleteButton.textContent='Delete';
            deleteButton.classList.add("btn","btn-primary","w-100","overflow-auto");
            fourthDiv.append(deleteButton);
            rowContainer.append(spaceBegin,firstDiv,secondDiv,thirdDiv,fourthDiv,spaceEnd)
            this.parent.append(rowContainer);
            deleteButton.addEventListener('click',()=>{
                this.deleteOne(data);
            })
            
        })
    })
}

    
    deleteOne(data){
        fetch(`http://localhost:3000/search-history/${data._id}`,{method:'DELETE',})
        .then(response=>{
            return response.text()
        })
        .then(data =>{
            if(data==="true"){
                this.load();
            }
        })
    }

    deleteall(){
        fetch("http://localhost:3000/search-history-delete-all",{method:'DELETE',})
        .then(res=>{
            return res.text()
        })
        .then(data=>{
            if(data==="true"){
                this.load();
            }
        })
    }

}