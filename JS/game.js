const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x:undefined,
    y:undefined
};

const giftPosition = {
    x:undefined,
    y:undefined
};

let enemyPositions = [];


function setCanvasSize(){
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }
    
    canvas.setAttribute('width', canvasSize + 5);
    canvas.setAttribute('height', canvasSize + 5);
    
    elementSize = canvasSize / 10;
    
    startGame();
}

function startGame(){
    game.font = `${elementSize - 8}px Verdana`;
    game.textAlign = 'end';
    
    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    //  for (let row = 1; row <= 10; row++){
    //     for (let col = 1; col <= 10; col++){
    //       game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementSize * col + 5, elementSize * row - 10);  
    //     }
    //  }

    showLives();

    enemyPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1) + 10;
            const posY = elementSize * (rowI + 1) - 10;

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                playerPosition.x = posX;
                playerPosition.y = posY;
                console.log({posX, posY})
                }
            } else if
                (col == 'I') {
                    giftPosition.x = posX;
                    giftPosition.y = posY;
            } else if 
                (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
    const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

}

function levelWin() {
    console.log('ganaste');
    level++;
    startGame();
}

function levelFail() {
    console.log ('Chocaste con un enemigo');
    lives--;

    if (lives <= 0){
        level = 0;
        lives = 3;
        clearInterval(timeInterval);
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log ('Terminaste el juego');

    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE EL RECORD';
        } else {
            pResult.innerHTML = 'Lo siento no superaste el record :c';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Es tu primera vez? trata de superar tu record';
    }
    console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART'])
    console.log(heartsArray);

    spanLives.innerHTML = emojis['HEART'].repeat(lives);
}

function formatTime(ms){
    const cs = parseInt(ms/10) % 100
    const seg = parseInt(ms/1000) % 60
    const min = parseInt(ms/60000) % 60
    const csStr = `${cs}`.padStart(2,"0")
    const segStr = `${seg}`.padStart(2,"0")
    const minStr = `${min}`.padStart(2,"0")
    return`${minStr}:${segStr}:${csStr}`
}

function showTime() {
    spanTime.innerHTML = formatTime(Date.now()-timeStart);
}

function showRecord() {
    spanRecord.innerHTML = formatTime(localStorage.getItem('record_time'));
}


window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(e){
    if(e.key == 'ArrowUp') moveUp();
    else if (e.key == 'ArrowLeft') moveLeft();
    else if (e.key == 'ArrowRight') moveRight();
    else if (e.key == 'ArrowDown') moveDown();
}

function moveUp() {
    console.log('arriba');

    if (playerPosition.y < elementSize) {
        console.log('out');
    }
    else { 
        playerPosition.y -= elementSize;
        startGame();
    }
}

function moveLeft() {
    console.log('izquiera');
    if ((playerPosition.x - 1) < elementSize) {
        console.log('out');
    }
    else { 
        playerPosition.x -= elementSize;
        startGame();
    }
}

function moveRight() {
    console.log('derecha');
    if (playerPosition.x >= canvasSize) {
        console.log('out');
    }
    else { 
        playerPosition.x += elementSize;
        startGame();
    }
}

function moveDown() {
    console.log('abajo');
    if ((playerPosition.y + elementSize) > canvasSize) {
        console.log('out');
    }
    else { 
        playerPosition.y += elementSize;
        startGame();
    }
}
