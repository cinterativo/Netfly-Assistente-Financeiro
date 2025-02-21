/**///////////////////////////////////////////////////////// */
const date=  new Date(new Date(new Date().setHours(0,0,0,0))); 
const optionValueReport= new Object();
optionValueReport["day"]= date.setDate(date.getDate()),
optionValueReport["week"]= date.setDate(date.getDate()- (date.getDay() - 1)),
optionValueReport["lastWeek"]= date.setDate(date.getDate()- ((date.getDay() - 1) + 7)),
optionValueReport["month"]= date.setMonth(date.getMonth(), 1),
optionValueReport["lastMonth"]= date.setMonth((date.getMonth()- 1), 1),
optionValueReport["fullYear"]= date.setFullYear(date.getUTCFullYear(), 0, 1),
optionValueReport["lastYear"]=date.setFullYear(date.getUTCFullYear()-1, 0, 1);
/** */
function loadValueSelectReport(selectReport){     
    Object.keys(optionValueReport).forEach(key=>{
        selectReport.querySelector(`.${key}`).value= optionValueReport[key];
    });
}



/** ///////////////////////////////////////////////////////// */
function timeDate(targetForm, target){   
    const hours= new Date().getHours().toString().padStart(2,0);   
    const minutes= new Date().getMinutes().toString().padStart(2,0);
    const seconds= new Date().getSeconds().toString().padStart(2,0);
    const timezoneOffset= new Date(target.value).getTimezoneOffset();
    const dayZeroHours= new Date(target.value).setMinutes(timezoneOffset);    
    const time= new Date(dayZeroHours).setHours(hours, minutes, seconds);  
    targetForm.querySelector(target.getAttribute('data-date')).value=
    target.value.toLocaleString('pt-br').split('-').reverse().join('/');
    targetForm.querySelector(target.getAttribute('data-date')).
    previousElementSibling.value= time;
}



/** ////////////////////////////////////////////// */
function addSectionRestrictions(targetForm, target){
    targetForm.lastElementChild.children[0]
    .setAttribute("data-restricted", target.getAttribute('data-restricted'));
    targetForm.lastElementChild.children[1]
    .setAttribute("data-restricted", `form[id=${targetForm.id}] `);
}
/** */
function datePeriodValidation(inputDate, range, dateRange= new Object()){
    const newDate= new Date().setMinutes(new Date().getTimezoneOffset());
    dateRange['currentDate']= new Date(newDate).toLocaleDateString();
    dateRange['deadLine']=  new Date(newDate- range).toLocaleDateString();
    inputDate.setAttribute('max', dateRange.currentDate.split('/').reverse().join('-'))
    inputDate.setAttribute('min', dateRange.deadLine.split('/').reverse().join('-'));
    inputDate.value= "";
    inputDate.disabled= false;
}
/** */
function currencyFormat(value, options) {
    options = {minimumFractionDigits: 2, maximumFractionDigits: 2};
    return new Intl.NumberFormat("pt-BR", options).format(value/100);
}
/** */
function alphanumericValidation(targetForm, target, str="", newStr= []){                                                           
    target.value= target.value.replace(/[^\w\d\wÀ-ú\s(\-\:)]/gi,""); 
    str = target.value.replace('  ',' ').replace('--','-').replace('::',':').split(" ");     
    str.forEach((word)=> {
        newStr.push(word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase())
    })
    return newStr.join(" ")
}
/** */
function selectOptgroupAccount(targetForm, target, optGroup){
    const select= optGroup.parentNode.querySelectorAll('optgroup');
    Array.from(select).forEach(group=> group.style.display= "none");
    optGroup.style.display="";   
}
/** */
function onChangeSelect(targetForm, target, formSection){  
    target.value=== "addNewOption" ?
    target.nextElementSibling.removeAttribute('class') :
    target.nextElementSibling.setAttribute('class', 'hidden');
    clearElementsBySection(targetForm, target, formSection);        
}
/** */
function onTypeTextInput(targetForm, target){
    if (target.className=== 'financialInputs') 
    clearElementsBySection(targetForm, target, target.closest('SECTION'))
}



/** //////////////////////////////////////////////////////////// */
function clearElementsBySection(targetForm, target, formSection){
    const form= targetForm.querySelectorAll(`.${targetForm.className}`);
    const section= formSection.querySelectorAll(`.${targetForm.className}`);
    const index= Math.max(Number(!target), Array.from(section).indexOf(target)) + 1;

    for (i= index; i < section.length; i++){section[i].disabled=true;};  
    Array.from(targetForm.querySelectorAll('input[type="text"]:disabled'))
    .forEach(input=> input.value="");
    Array.from(targetForm.querySelectorAll('SELECT:disabled'))
    .forEach(select=> select.value="");

    const disabled= !section[index -1].checkValidity() 
    || section[index -1].value=== 'addNewOption';
    
    formSection.className === 'mainSection'?
    form[index].disabled= disabled : section[index].disabled= disabled;    
}
/** */
function cancelFormBySection(targetForm, target, element){ 
    const section= targetForm.querySelector(target.getAttribute('data-restricted'));  
    clearElementsBySection(targetForm, element, section);
};



/** ////////////////////////////////////////////// */
function closeNewOptionElements(targetForm, target){ 
    const select= target.parentNode.previousElementSibling
    target.parentNode.children[0].checkValidity()?    
    select.selectedIndex= select.selectedIndex -1 : select.selectedIndex= 0;
    target.parentNode.children[0].value= "";
    target.parentNode.style.display='none';
    clearElementsBySection(targetForm, select, target.closest('SECTION'));
}
/** */   
function addNewOptionSelect(targetForm, target){
    const divNewOptiomElement= target.parentNode
    const value= divNewOptiomElement.children[0].value.trim();
    const select= divNewOptiomElement.previousElementSibling;
    const newOption= new Option(value, value);
    select[select.selectedIndex].before(newOption);
    closeNewOptionElements(targetForm, target);
}
/** */
function onNewOptionTextInput(targetForm, target){
    target.value= alphanumericValidation(targetForm, target);
    target.parentNode.lastElementChild.disabled= !target.checkValidity();
};



/** /////////////////////////////////////////////// */
function insertTbodyTableRow(dataObject, table, row){
    const tbody= table.querySelector('tbody');
    dataObject.forEach(rowObject =>{        
    const newRow= tbody.insertRow(row);
        Object.values(rowObject).forEach(value =>{
            const newCell= newRow.insertCell();
            newCell.innerHTML= value
        }) 
    })
}
/** */
function getDataObjectFromTable(table){
    const theadTable= new Array(), tbodyTable= new Array();

    Array.from(table.firstElementChild.lastElementChild.querySelectorAll('th'))
    .forEach((th)=>{theadTable.push(th.innerHTML.toLowerCase())});
    
    Array.from(table.querySelector('tbody').rows).forEach(tr=> {
        const rowObject= new Object();
        Array.from(tr.querySelectorAll('td')).forEach((td, index)=>{ 
            rowObject[theadTable[index]]= td.innerHTML;
        }) 
        tbodyTable.push(rowObject);  
    })
    return tbodyTable 
}
/** */
function getFormData(targetForm, obj= new Object()){
    Array.from(targetForm.querySelectorAll(`.${targetForm.className}`))
    .forEach(element=> { 
        if(element.getAttribute('data-doublecontent')){                
            obj[element.getAttribute('data-doublecontent')]= 
            element[element.selectedIndex].parentNode.label.slice(0, -1);
            obj[element.id]=  element[element.selectedIndex].textContent.trim();
            return                
        }
        obj[element.id]= element.value.trim();
    }) 
    return obj; 
}


// /** ///////////////////////////////// */
function reduceFilterTable(filterData){
    return filterData.reduce((acc, curr)=> acc + parseInt(curr), 0)
}
/** */
function tfootTotalization(filterValues, tfoot){
    Object.keys(filterValues).forEach((key)=>{
        tfoot.querySelector(`th[class=${key}]`)
        .textContent= currencyFormat((reduceFilterTable(filterValues[key])));
    })
}
/** */
function getValuesFromFilterTable(tbody,  tfootCells, obj= new Object){
    Object.keys(tfootCells).forEach(key=>{
        const arr= new Array();
        Array.from(tbody.querySelectorAll('tr[style="display: table-row;"]')).forEach(tr=> {       
            arr.push(tr.children[tfootCells[key]].textContent.replace(/[^0-9]+/g, ''));           
        });
        obj[key]= arr; 
    })
    return obj;
}
/** */
function getTfootCellsByClassName(tfoot, obj= new Object()){ 
    Array.from(tfoot.querySelectorAll('th')) .forEach((th, index)=> {
        if(th.className) obj[th.className]= index;
    })
    return obj
}
/** */
function clearFirstTrThead(firstTrThead){
    firstTrThead.querySelector('.readonly').textContent="";
    firstTrThead.querySelector('SELECT').selectedIndex= 0;
}
/** */
function removeTheadAttribute(thead){
    Array.from(thead.lastElementChild.children)
    .forEach(th=> th.removeAttribute('class', 'filter'));
}
/** */
function removeFilterTable(tbody){   
    Array.from(tbody.rows).forEach(row=>row.style.display= "table-row"); 
}
/** */
function setTheadAttribute(thead, theadColumn, target, text=""){
    thead.firstElementChild.children[1].innerHTML= 
    `Registros de ${target.textContent} emitido em ${new Date().toLocaleDateString()}:`;
    thead.lastElementChild.children[theadColumn].setAttribute('class', 'filter');
}
/** */
function mainFilterTable(tbody, column, testValue){
    Array.from(tbody.rows).forEach((row)=>{
        row.children[column].textContent >= testValue?
        row.style.display= "table-row" : row.style.display= 'none';
    })   
}
/** */
function siderFilterTable(tbody, column, textContent){
    Array.from(tbody.rows).forEach((row)=>{
        row.children[column].textContent.toUpperCase()=== textContent.toUpperCase()?
        row.style.display= "table-row" : row.style.display= 'none';
    })      
}



/** ////////////////////////////////////////////////////////////// */
function getUniqueOfLocalData(localData, searchKey, list= new Set()){
    Object(localData).forEach(key=> list.add(key[searchKey]));
    return list;
}
/** */
function createObjectOfOptions(localData, newSet, obj= new  Object()){
    newSet.forEach((set)=> {                                       
        const newOption= new Set();                                    
        Object.values(localData).filter(acc=>acc.Origem== set)
        .forEach(ac=> newOption.add(ac.Conta));             
        obj[set]=newOption;    
    });
    return obj;
}
/** */
function addNewOptionsFromLocalStorage(objectOptions, selectID){
    Object.keys(objectOptions).forEach(key =>{        
        const optGroup= selectID.querySelector(`optgroup[label="${key}:"]`);
        Object(objectOptions[key]).forEach(value=>{
            optGroup.lastElementChild.before(new Option(value))})
    })
}
/** */
function getDataLocalSotrage(localItem){      
    return JSON.parse(localStorage.getItem(localItem));     
}

// const date= '31/02/2025'
// const [day, month, year] = date.split('/').map(Number);


//Trabalhando com Git e Github no VsCode em 2022 | Tutorial


