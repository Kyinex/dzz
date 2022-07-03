let item = document.querySelector('.label');
localStorage.setItem('item', item);
let saveItem = localStorage.getItem('item');
console.log(saveItem);

const body = document.querySelector('body');
body.appendChild(saveItem);