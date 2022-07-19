const flag = document.getElementById('flag');

const colors = {
    1: 'blue',
    2: 'green',
    3: '#ff0000',
    4: '#00117d',
    5: '#82001e',
    6: '#00a19b',
    7: '#ba04a8',
    8: 'black'
};

const canvas = document.getElementById('field');
const fieldCanvas = canvas.getContext('2d');
const settings = document.getElementById('settings');
const plusBtn = document.getElementById('plus');
const minusBtn = document.getElementById('minus');

let field = new Array;
let canvasSize = canvas.width;
let width = Number(document.getElementById('width').value) + 2;
let height = Number(document.getElementById('height').value) + 2;
let resolution = canvasSize / ((width > height ? width : height) - 2);
let mines = Number(document.getElementById('mines').value);

if (mines > (width - 2) * (height - 2) - 1){
     mines = (width - 2) * (height - 2) - 1;
}

let revealedCells = 0;
let gameIsOver;

function createField(field){
    let fieldMines = 0;
    for (let y = 0; y < height; y++) {
        field[y] = new Array;
        for (let x = 0; x < width; x++) {
            field[y][x] = {
                value: 0,
                revealed: false,
                flag: false
            };
        } 
    }
    for (let i = 0; i < mines; i++) {
        let y;
        let x;
        do{
            y = Math.floor(Math.random() * (height-2)) + 1;
            x = Math.floor(Math.random() * (width-2)) + 1;
        } while (field[y][x].value == 'm');

        field[y][x].value = 'm';
    }
}

function changeCell(x, y, number){
    field[y][x].value = number;
    renderField(field);
}

function countMines(field){
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if(field[y][x].value == 'm'){
                continue;
            }
            let surrMines = 0;

            for (let nY = y - 1; nY <= y + 1; nY++) {
                for (let nX = x - 1; nX <= x + 1; nX++) {
                    if(field[nY][nX].value == 'm') {surrMines += 1};
                }
            }

            field[y][x].value = surrMines;  
        }
    }
}

function renderField(field){

    for (let y = 1; y < height-1; y++) {
        for (let x = 1; x < width-1; x++) {
            fieldCanvas.fillStyle = '#ededed';
            fieldCanvas.strokeStyle = '#2b2b2b';
            
            fieldCanvas.fillRect((x - 1)*resolution, (y - 1)*resolution, resolution, resolution);
            fieldCanvas.strokeRect((x - 1)*resolution, (y - 1)*resolution, resolution, resolution);
            if(field[y][x].revealed){
                openCell(x, y, field, true);
            }
            if(field[y][x].flag){
                field[y][x].flag = false;
                drawFlag(x, y);
            }
        }
    }
}

function showField(field){
    for (let y = 1; y < height-1; y++) {
        for (let x = 1; x < width-1; x++) {
            openCell(x, y, field, true);
        }
    }
}

function floodFill(x, y, field){

    for (let nY = y - 1; nY <= y + 1; nY++) {
        for (let nX = x - 1; nX <= x + 1; nX++) {
            if(nY == 0 || nX == 0 || nY == height-1 || nX == width-1) continue;
            if(field[nY][nX].value != 'm' && !field[nY][nX].revealed) {openCell(nX, nY, field)};
        }
    }
}

function openCell(x, y, field, show = false){
    canvasX = x - 1;
    canvasY = y - 1;
    field[y][x].revealed = true;
    if(field[y][x].value == 0){
        fieldCanvas.fillStyle = '#cccaca';
        fieldCanvas.fillRect(canvasX*resolution, canvasY*resolution, resolution, resolution);
        fieldCanvas.strokeRect(canvasX*resolution, canvasY*resolution, resolution, resolution);
        
        if(show == false){
            floodFill(x, y, field);
        }
    }
    else if(field[y][x].value == 'm'){
        fieldCanvas.fillStyle = '#666666';
        fieldCanvas.fillRect(canvasX*resolution, canvasY*resolution, resolution, resolution);
        fieldCanvas.font = `${resolution*0.7}px "Press Start 2P"`;
        fieldCanvas.fillStyle = 'black';
        fieldCanvas.textAlign = "center";
        fieldCanvas.fillText('o', canvasX*resolution+(resolution*0.51), canvasY*resolution+(resolution*0.9));
        fieldCanvas.strokeRect(canvasX*resolution, canvasY*resolution, resolution, resolution);
    }

    else{
        fieldCanvas.fillStyle = '#cccaca';
        fieldCanvas.fillRect(canvasX*resolution, canvasY*resolution, resolution, resolution);
        fieldCanvas.font = `${resolution*0.7}px "Press Start 2P"`;
        fieldCanvas.fillStyle = colors[field[y][x].value];
        fieldCanvas.textAlign = "center";
        fieldCanvas.fillText(field[y][x].value, canvasX*resolution+(resolution*0.51), canvasY*resolution+(resolution*0.9));
        fieldCanvas.strokeRect(canvasX*resolution, canvasY*resolution, resolution, resolution);
    }

    if(show == false){
        revealedCells += 1;
    }
    if((width - 2)*(height - 2) - mines == revealedCells && !gameIsOver){
        win(field);
    }
}

function win(field){
    if(gameIsOver == 'lose') return;
    gameIsOver = 'win';

    showField(field);
    fieldCanvas.fillStyle = 'rgba(255,255,255,0.5)';
    fieldCanvas.fillRect(0, 0, canvasSize, canvasSize);
    fieldCanvas.font = `${canvasSize * 0.1}px "Press Start 2P"`;
    fieldCanvas.fillStyle = 'white';
    fieldCanvas.textAlign = "center";
    fieldCanvas.fillText('YOU WIN', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('YOU WIN', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('YOU WIN', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('YOU WIN', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('YOU WIN', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('YOU WIN', (canvasSize * 0.5), (canvasSize * 0.5));
    document.removeEventListener("click", clickOnCell);
}

function gameover(field){
    gameIsOver = 'lose';
    showField(field);
    fieldCanvas.fillStyle = 'rgba(255,255,255,0.5)';
    fieldCanvas.fillRect(0, 0, canvasSize, canvasSize);
    fieldCanvas.font = `${canvasSize * 0.1}px "Press Start 2P"`;
    fieldCanvas.fillStyle = 'white';
    fieldCanvas.textAlign = "center";
    fieldCanvas.fillText('GAME OVER', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('GAME OVER', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('GAME OVER', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('GAME OVER', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('GAME OVER', (canvasSize * 0.5), (canvasSize * 0.5));
    fieldCanvas.strokeText('GAME OVER', (canvasSize * 0.5), (canvasSize * 0.5));
    document.removeEventListener("click", clickOnCell);
}

function clearCanvas(){
    fieldCanvas.fillStyle = '#cccaca';
    fieldCanvas.fillRect(0, 0, 500, 500);
}

function clickOnCell(event){
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var canvasX = Math.round(event.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    var canvasY = Math.round(event.clientY - cRect.top);   // from the X/Y positions to make  
    
    if(!(canvasX > canvasSize - 1 || canvasX < 0 || canvasY > canvasSize - 1 || canvasY < 0)){
        var x = Math.floor(canvasX / resolution);
        var y = Math.floor(canvasY / resolution);

        if(field[y+1][x+1].value == 'm'){
            gameover(field)
            return;
        }
        
        openCell(x + 1, y + 1, field);

    }

}

function drawFlag(x, y){
    var canvasX = (x - 1) * resolution;
    var canvasY = (y - 1) * resolution;

    if(!field[y][x].flag  && !field[y][x].revealed){
        fieldCanvas.drawImage(flag, canvasX, canvasY, resolution, resolution);
        field[y][x].flag = true;
    }
    else if(field[y][x].flag && !field[y][x].revealed){
        fieldCanvas.fillStyle = '#ededed';
        fieldCanvas.strokeStyle = '#2b2b2b';
        fieldCanvas.fillRect(canvasX, canvasY, resolution, resolution);
        fieldCanvas.strokeRect(canvasX, canvasY, resolution, resolution);
        field[y][x].flag = false;
    }
}

function flagCell(event){
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var canvasX = Math.round(event.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    var canvasY = Math.round(event.clientY - cRect.top);
    if(!(canvasX > canvasSize - 1 || canvasX < 0 || canvasY > canvasSize - 1 || canvasY < 0)){
        var x = Math.floor(canvasX / resolution) + 1;
        var y = Math.floor(canvasY / resolution) + 1;
        drawFlag(x, y);


    }
}


function startGame(event){
    event.preventDefault();
    
    field = new Array;
    width = Number(document.getElementById('width').value) + 2;
    height = Number(document.getElementById('height').value) + 2;
    resolution = canvasSize / ((width > height ? width : height) - 2);
    mines = Number(document.getElementById('mines').value);

    if (mines > (width - 2) * (height - 2) - 1){
        mines = (width - 2) * (height - 2) - 1;
    }

    revealedCells = 0;
    gameIsOver = undefined;

    clearCanvas();
    createField(field);
    countMines(field);
    renderField(field);
    document.addEventListener("click", clickOnCell);
}

function reRender(){
    canvasSize = canvas.width;
    resolution = canvasSize / ((width > height ? width : height) - 2);
    renderField(field);
    if(gameIsOver == 'win') win(field);
    else if(gameIsOver == 'lose') gameover(field);
    
}

function plusSize(){
    canvas.width += 10;
    canvas.height += 10;
    reRender();

}

function minusSize(){
    canvas.width -= 10;
    canvas.height -= 10;
    reRender();
}

canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    flagCell(e);
});


settings.addEventListener('submit', startGame);

plusBtn.addEventListener('click', plusSize);
minusBtn.addEventListener('click', minusSize);
