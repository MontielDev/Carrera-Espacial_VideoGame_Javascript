const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementSize;

function setCanvasSize(){
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize =window.innerHeight *0.8;
    }
    
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementSize = canvasSize / 10;
    
    startGame();
}

function startGame(){
    game.font = `${elementSize}px Verdana`;
    game.textAlign = 'end';

    for (let i = 1; i <= 10; i++){
        game.fillText(emojis['X'], elementSize * i + 15, elementSize);  
    }
}






    // window.innerHeight
    // window.innerWidth
    
    // game.fillRect(0,0,100,100);
    // game.clearRect(0,0,50,50);
    // game.clearRect();
    // game.clearRect(0, 0, 50, 50);

    // game.font = '25px Verdana';
    // game.fillStyle = 'purple';
    // game.textAlign = 'center';
    // game.fillText('platzi', 50, 50);