/** ///////////////////////////////////////// */
document.querySelector('input[type="date"]').addEventListener("change", (e)=> {        
    const date= document.querySelector(e.target.getAttribute('data-date'));
    document.querySelector(e.target.getAttribute('data-currency')).disabled= true;
    clearElementsBySection(e.target.form, date, e.target.closest('section'));
    if(e.target.value) timeDate(e.target.closest('FORM'), e.target);    
});



/** ///////////////////////////////////////////// */
function selectRevenuesExpenses(targetForm, target){
    target.id=== 'selectRevenues'?  
    target.nextElementSibling.value="" : target.previousElementSibling.value="";
    addSectionRestrictions(targetForm, target);
    
    const inputDate= targetForm.children[1].children[1].children[1];
    datePeriodValidation(inputDate, range= 30 * 24 * 60 * 60 * 1000); 
   
    const optGroup= target[target.selectedIndex].getAttribute('data-account');
    selectOptgroupAccount(targetForm, target, targetForm.querySelector(optGroup));

    document.querySelector(optGroup).lastElementChild.style.display=
    target[target.selectedIndex].getAttribute('data-display');
    
    targetForm.querySelector(target.getAttribute('data-description'))
    .setAttribute('placeholder', `${target.value}: `);

    targetForm.querySelector(target.getAttribute('data-currency'))
    .disabled= 'disabled';

    targetForm.querySelector(target.getAttribute('data-currency'))
    .setAttribute('data-flow', target.getAttribute('data-flow'));

    clearElementsBySection(targetForm, inputDate, inputDate.closest('SECTION'));
};
/** */
function onSelectAccount(targetForm, target){
    onChangeSelect(targetForm, target, target.closest('SECTION'));
    targetForm.querySelector(target.getAttribute('data-description')).value=
    targetForm.querySelector(target.getAttribute('data-description')).placeholder;
    const table= document.querySelector(target.getAttribute('data-table'));
    const column= target.getAttribute('data-column');
    const textContent= target[target.selectedIndex].textContent;
    removeTheadAttribute(table.children[0]);
    removeFilterTable(table.children[1]);    
    siderFilterTable(table.children[1], column, textContent); 
    const tfootCells= getTfootCellsByClassName(table.lastElementChild);
    const filterValues= getValuesFromFilterTable(table.children[1], tfootCells);    
    tfootTotalization(filterValues, table.lastElementChild);
}
/** */     
function onDescriptionInput(targetForm, target){
    target.value.length == 1?
    target.value= target.placeholder + alphanumericValidation(targetForm, target):
    target.value= target.placeholder + alphanumericValidation(targetForm, target)
    .substring(target.placeholder.length); 

    targetForm.querySelector(target.getAttribute('data-currency'))
    .disabled= !target.checkValidity();
};
/** */
function onCurrencyInput(targetForm, target){
    const value= target.value.replace(/[^0-9]+/g, ''); 
    target.value= currencyFormat(value);    
    const dataFlow= target.getAttribute('data-flow').split('/'); 
    target.parentNode.children[1].value= currencyFormat(value * dataFlow[0]);
    target.parentNode.children[2].value= currencyFormat(value * dataFlow[1]);  
    targetForm.querySelector(target.getAttribute('data-buton'))
    .disabled= !parseInt(value) > 99;
};
const financialInputs= new Object();
financialInputs['selectRevenues']= selectRevenuesExpenses;
financialInputs['selectExpenses']= selectRevenuesExpenses;
financialInputs['selectAccount']= onSelectAccount;
financialInputs['inputDescription']= onDescriptionInput;
financialInputs['inputCurrency']= onCurrencyInput;
financialInputs['newAccount']= (targetForm, target)=>
                               onNewOptionTextInput(targetForm, target);
/** */
document.querySelectorAll('FORM SELECT').forEach((event) =>{
    event.addEventListener("change", (e)=> {
        financialInputs[e.target.id](e.target.closest('FORM'), e.target); 
    });
});
/** */
document.querySelectorAll('input[type="text"]').forEach((event) =>{
    event.addEventListener("input", (e)=> {
        financialInputs[e.target.id](e.target.closest('FORM'), e.target); 
        onTypeTextInput(e.target.closest('FORM'), e.target)
    });
});



/** ///////////////////////////////////////// */
function cancelFormButtom(targetForm, target){ 
    cancelFormBySection(targetForm, target);
    targetForm.querySelector('input[id="inputCurrency"]').value= "";
    targetForm.querySelector('input[id="inputCurrency"]').disabled= 'disabled';
};
/** */
function saveFormButton(targetForm, target, inputFormArray= new Array()){ 
    const table= document.querySelector('table[id="financialTable"]');
    const date= targetForm.querySelector(target.getAttribute('data-date'));
    inputFormArray.push(getFormData(targetForm));
    insertTbodyTableRow(inputFormArray, table, row=0);

    target.disabled=true; 
    const financialStorage= getDataObjectFromTable(table)
    localStorage.setItem('financialStorage', JSON.stringify(financialStorage)); 
    document.querySelector(target.getAttribute('data-currency')).disabled= true;
    clearElementsBySection(targetForm, date, targetForm.children[1])    
}
/** */
function printForm(targetForm, target){  
    document.querySelectorAll('.nonPrintable')
    .forEach(element=> element.style.display='none');
    window.print();
    document.querySelectorAll('.nonPrintable')
    .forEach(element=> element.style.display=""); 
    const thead= document.querySelector(target.getAttribute('data-table'));
    thead.children[1].textContent= thead.children[1].textContent.match('Relatório');
    document.querySelector('select[id="selectReport"]').selectedIndex = 0;   
};
/** */
const clickButton= new Object();
clickButton['cancelNewOption']= (targetForm, target)=> 
                                closeNewOptionElements(targetForm, target);
clickButton['saveNewOption']= (targetForm, target)=> 
                                addNewOptionSelect(targetForm, target);
clickButton['cancel']= cancelFormButtom;
clickButton['save']= saveFormButton;
clickButton['print']= printForm;
/** */
document.querySelectorAll('input[type="button"]').forEach((input) =>{
    input.addEventListener("click", (e)=> {
        clickButton[e.target.className](e.target.closest('FORM') , e.target); 
    });
});



/** /////////////////////////////////////////////////////////////////// */
function onClickSelectReport(thead, target){
    removeTheadAttribute(thead);
    mainFilterTable(thead.nextElementSibling, 0, target.value);
    thead.querySelector('.readonly').textContent=
    `Registros a partir de ${new Date(Number(target.value)).toLocaleDateString()}.`;
    thead.lastElementChild.children[1].setAttribute('class', 'filter');

    const tfootCells= getTfootCellsByClassName(thead.parentNode.lastElementChild);
    const filterValues= getValuesFromFilterTable(thead.nextElementSibling, tfootCells);    
    tfootTotalization(filterValues, thead.parentNode.lastElementChild);
}
/** */
document.querySelector('table[id="financialTable"] thead select[id="selectReport"]')
    .addEventListener("change", (e)=> {onClickSelectReport(e.target.closest('thead'), e.target)
});
/** */
document.querySelector('table[id="financialTable"] thead tr:nth-child(2)')
    .addEventListener("click", (e)=> { 
        clearFirstTrThead(e.target.parentNode.previousElementSibling)
        removeTheadAttribute(e.currentTarget.parentNode);   
        removeFilterTable(e.currentTarget.parentNode.nextElementSibling);
});
/** */
function onClickTbodyTable(tbody, target){
    clearFirstTrThead(tbody.previousElementSibling);
    removeTheadAttribute(tbody.previousElementSibling);
    setTheadAttribute(tbody.previousElementSibling, target.cellIndex, target);
    siderFilterTable(tbody, target.cellIndex, target.textContent);

    const tfootCells= getTfootCellsByClassName(tbody.nextElementSibling);
    const filterValues= getValuesFromFilterTable(tbody, tfootCells);    
    tfootTotalization(filterValues, tbody.nextElementSibling);
}
/** */
document.querySelector('table[id="financialTable"] tbody')
    .addEventListener("click", (e)=> {
        if(e.target.cellIndex > 4) return;
        onClickTbodyTable(e.currentTarget, e.target)
});



/** //////////////////////////////////////////// */
function loadDataFromLocalStorage(localItem){
    const table= document.querySelector('table[id="financialTable"]');
    const localData= getDataLocalSotrage(localItem); 
    insertTbodyTableRow(localData, table, row=0);   
    const selectAccount= document.querySelector('select[id="selectAccount"]');
    const newSet= getUniqueOfLocalData(localData, 'origem');
    const accountObject= createObjectOfOptions(localData, newSet);  
    addNewOptionsFromLocalStorage(accountObject, selectAccount);
}
/** */
window.addEventListener("load", (event)=>{
    if(!localStorage.getItem('financialStorage')) return;
    loadDataFromLocalStorage('financialStorage');
    loadValueSelectReport(document.querySelector('select[id="selectReport"]'))
})

const t = document.querySelector('table[id="financialTable"] tbody');
console.log(t, t, t.querySelectorAll('tr'))
