const todoForm = document.getElementById('todo_form');
const todoList = document.getElementById('todo_list');
const todoItems = document.querySelectorAll('todo_item');
const container = document.getElementById('container');
const addInput = document.getElementById('add_input');
const addDate = document.querySelector('.add_date');
let itemId = 1;
let addCheck;

if(localStorage.getItem('count') == null){
    localStorage.setItem('count', '1');
}

function createElement(tag, props, ...children){
    const element = document.createElement(tag);
    Object.keys(props).forEach(key => element[key] = props[key]);

    if (children.length > 0){
        children.forEach(child => {
            if (typeof child === 'string'){
                child = document.createTextNode(child);
            }
            element.appendChild(child);
        });
    }
    return element;
}

function toggleTodoItem(){
    const todoItem = this.parentNode.parentNode;
    todoItem.classList.remove('editing');
    todoItem.classList.toggle('completed');
    saveItems('check', todoItem.id);
}

function changeDate(){
    const date = this.parentNode;
    const editDate = date.querySelector('.edit_date');

    date.innerText = normalDate(editDate.value);
    date.appendChild(editDate);
}

function editTodoItem(){
    const todoItem = this.parentNode;
    const textfield = todoItem.querySelector('.textfield');
    const title = todoItem.querySelector('.title');
    const isEditing = todoItem.classList.contains('editing');
    const date = todoItem.querySelector('.date');
    const editDate = todoItem.querySelector('.edit_date');

    editDate.addEventListener('change', changeDate);
    
    if (isEditing) {
        title.innerText = textfield.value;
        editDate.setAttribute('readonly', '');
        this.innerText = 'Изменить';
    } else{
        textfield.value = title.innerText;
        editDate.removeAttribute('readonly', '');
        this.innerText = 'Сохранить';

    }
    todoItem.classList.toggle('editing');
    date.appendChild(editDate);

    saveItems('edit', Number(todoItem.id));
    sortByDate();
}

function deleteTodoItem() {
    const todoItem = this.parentNode;
    saveItems('delete', Number(todoItem.id));
    todoList.removeChild(todoItem);

    if (todoList.childElementCount == 0){
        const nothingTodo = createElement('div', {id: 'nothing_Todo'}, 'Дел пока нет');
        container.appendChild(nothingTodo);
    }

}

function bindEvents(todoItem){
    const checkbox = todoItem.querySelector('.checkbox');
    const editButton = todoItem.querySelector('button.edit');
    const deleteButton = todoItem.querySelector('button.delete');
    
    checkbox.addEventListener('change', toggleTodoItem);
    editButton.addEventListener('click', editTodoItem);
    deleteButton.addEventListener('click', deleteTodoItem);
}

function normalDate(inputDate){
    let day = inputDate.substring(8, 10);
    let mounth = inputDate.substring(5, 7);
    let year = inputDate.substring(2, 4);
    let date = day + '.' + mounth + '.' + year;

    return date;
}

function createTodoItem(title, date){
    
    const checkbox = createElement('input', {type: 'checkbox', className: 'checkbox'});
    const checkboxDecor = createElement('div', {className: 'checkbox_decor'});
    const checkboxContainer = createElement('label', {className: 'checkbox_container'},
    checkbox, checkboxDecor);
    checkboxContainer.setAttribute('title', 'Сделано');
    const editDate = createElement('input', {type: 'date', className: 'edit_date', value: date});
    editDate.setAttribute('readonly', '');
    const todoDate = createElement('label', {className: 'date'}, editDate, normalDate(date));
    const border = createElement('div', {className: 'border'})
    const label = createElement('label', {className: 'title'}, title);
    const textfield = createElement('input', {className: 'textfield', type: 'text'});
    const editButton = createElement('button', {className: 'edit'}, 'Изменить');
    const deleteButton = createElement('button', {className: 'delete'}, 'Удалить');
    // const todoItem = createElement('li', {className: 'todo_item', id: `todo_item_№${localStorage.getItem('count')}`}, 
    const todoItem = createElement('li', {className: 'todo_item', id: itemId}, 
    checkboxContainer, todoDate, border, label, textfield, editButton, deleteButton);
    
    bindEvents(todoItem);
    
    return todoItem;
}

function noInput(){
    addInput.classList.add('warning');
}

function noDate(){
    addDate.classList.add('warning');
}

function sortByDate(){
    let tmpTodoList = todoList.querySelectorAll('.todo_item');

    for (let i = 0; i < tmpTodoList.length; i++){
        for (let j = 0; j < tmpTodoList.length - 1; j++){
            tmpTodoList = todoList.querySelectorAll('.todo_item');

            let item1 = tmpTodoList[j]; 
            let item2 = tmpTodoList[j+1]; 
            let date1 = item1.querySelector('.edit_date').value; 
            let date2 = item2.querySelector('.edit_date').value; 

            if(date1 > date2){
                todoList.insertBefore(item2, item1);
                
                strorageItem1 = localStorage.getItem(`item${item1.id}`);
                strorageItem2 = localStorage.getItem(`item${item2.id}`);
                localStorage.setItem(`item${item2.id}`, strorageItem1);
                localStorage.setItem(`item${item1.id}`, strorageItem2);
                
                tmpId = item2.id;
                item2.id = item1.id;
                item1.id = tmpId;
            }
        } 
    }
}

function addTodoItem(event){
    if (event != 'load'){
        event.preventDefault();
    }
    if(addInput.value === ''){

        addInput.classList.remove('warning');
        let timeoutID = window.setTimeout(noInput, 2);

        if (addDate.value === ''){

            addDate.classList.remove('warning');
            let timeoutID = window.setTimeout(noDate, 2);

            return;
        }
        return;
    }

    if (addDate.value === ''){

        addDate.classList.remove('warning');
        let timeoutID = window.setTimeout(noDate, 2);

        return;
    }


    const todoItem = createTodoItem(addInput.value, addDate.value);
    todoList.appendChild(todoItem);

    if(addCheck){
        todoItem.classList.add('completed');
        // console.log(todoItem.querySelector('.checkbox').value);
        todoItem.querySelector('.checkbox').checked = true;
    }

    const nothingTodo = document.getElementById('nothing_Todo');

    if(document.getElementById('nothing_Todo')){
        nothingTodo.remove();
    }
    
    if (event != 'load'){
        saveItems('add', todoItem.id);
    }
    sortByDate();

    itemId += 1;
    
    addInput.value = '';
    
}

function saveItems(state, ...id){
    let count = Number(localStorage.getItem('count'));
    if(state == 'add'){

        let item = {
            input: addInput.value,
            date: addDate.value,
            check: isCompleted(id)

        }

        localStorage.setItem(`item${count}`, JSON.stringify(item));
        count = Number(count) + 1;
        localStorage.setItem('count', count);

    }
    else if(state == 'delete'){
        id = id[0];

        
        localStorage.removeItem(`item${id}`);
        for(Number(id); id < count; id++){
            let item = document.getElementById(id);
            item.id = String(Number(item.id) - 1);

            item = item = JSON.parse(localStorage.getItem(`item${id+1}`));
            localStorage.setItem(`item${id}`, JSON.stringify(item));

        }
        localStorage.setItem('count', count - 1);

    }

    else if(state == 'edit'){
        let item = {
            input: document.getElementById(id).querySelector('.title').innerText,
            date: document.getElementById(id).querySelector('.edit_date').value,
            check: isCompleted(id)
        }

        localStorage.setItem(`item${id}`, JSON.stringify(item));
        console.log(localStorage.getItem(`item${id}`));
    }
    else if(state == 'check'){
        let item = {
            input: document.getElementById(id).querySelector('.title').innerText,
            date: document.getElementById(id).querySelector('.edit_date').value,
            check: isCompleted(id)
        }

        localStorage.setItem(`item${id}`, JSON.stringify(item));
        console.log(localStorage.getItem(`item${id}`));
    }
}

function isCompleted(id){
    console.log(id);
    if(document.getElementById(id).classList.contains('completed')){
        return true;
    }
    else{
        return false;
    }
}

function loadItems(){

    for(let i = 1; i < Number(localStorage.getItem('count')); i++){
        let item = JSON.parse(localStorage.getItem(`item${i}`));
        console.log(item);
        addInput.value = item.input; 
        addDate.value = item.date; 
        addCheck = item.check;
        addTodoItem('load');
    }
}

function main(){
    
    if((localStorage.getItem('item') === null)){
        loadItems()
    }

    todoForm.addEventListener('submit', addTodoItem);
    todoItems.forEach(item => bindEvents(item));

}

main();