"use strict";
function insert(num){
    let exp = document.form.textview.value;
    let lastSymbol = exp.substring(exp.length-1,);
    // if (!((lastSymbol == '-' || lastSymbol == '+' ||
    // lastSymbol == '*' || lastSymbol == '/' || lastSymbol == '.') &&
    // num == lastSymbol)){
    //     document.form.textview.value =
    //     document.form.textview.value + num;
    // }
    if ((lastSymbol == '-' || lastSymbol == '+' ||
    lastSymbol == '*' || lastSymbol == '/' || lastSymbol == '.') 
    && (num == '-' || num == '+' ||
    num == '*' || num == '/' || num == '.'))
    {
        document.form.textview.value =
        exp.substring(0,exp.length-1) + num;
    }
    else{
        document.form.textview.value =
        document.form.textview.value + num;
    }
}

function clean(){
    document.form.textview.value = '';
}

function back(){
    let exp = document.form.textview.value;
    document.form.textview.value = exp.substring(0,
    exp.length-1);
    
}

function equal(){
    let exp = document.form.textview.value;
    if(exp) {
        document.form.textview.value = eval(exp);
    }
}