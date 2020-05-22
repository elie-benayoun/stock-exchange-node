(async function(){
    const urlParams = new URLSearchParams(window.location.search);
    let symbols =urlParams.get('symbol');
    symbols=symbols.split(",");
    for(let symbol of symbols){
    const compinfo= new CompanyInfo(document.getElementById(`main-container`));
    await compinfo.load(symbol);
    await compinfo.addChart(symbol);
    }
})();
