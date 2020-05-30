// Global variables
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

const cw = canvas.width;
const ch = canvas.height;

const ballSize = 20;

let ballX = cw/2-ballSize/2;
let ballY = ch/2-ballSize/2;

const paddleHeight = 100;
const paddleWidth = 20;

const playerX = 70;
const aiX = 910;

let playerY = 200;
let aiY = 200;

const lineWidth = 6;
const lineHeight = 16;

let ballSpeedX = -2;
let ballSpeedY = -2;

topCanvas = canvas.offsetTop;
console.log(topCanvas);

// Functions
function player() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight); 
}

function ai() { 
    ctx.fillStyle = "yellow";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight); 
}

function ball() {
    ctx.fillStyle = "#ffff";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >=ch-ballSize) {
        ballSpeedY = -ballSpeedY;
        speedUp();
    }
    if (ballX <= 0 || ballX>= cw-ballSize) {
        ballSpeedX = -ballSpeedX;
        speedUp();
    }
}

function table() {
    // board
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);
    // middle line
    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = "gray";
        ctx.fillRect(cw/2 - lineWidth/2, linePosition - lineHeight/2, lineWidth, lineHeight);
    }
}



function game () {

    table()
    ball()
    player()
    ai()
    aiPosition()
}

function playerPosition(e) {
    // console.log("Pozycja myszy to: " (e.clientY- topCanvas));
    playerY = e.clientY - topCanvas - paddleHeight/2;

    if (playerY >= ch - paddleHeight) {
        playerY = ch - paddleHeight;
    }

    if (playerY <= 0) {
        playerY = 0;
    }
}

function aiPosition () {

}

function speedUp() {
    if (ballSpeedX >0 && ballSpeedX < 15) {
        ballSpeedX += 0.5;
    }
    else if (ballSpeedX < 0 && ballSpeedX > -15) {
        ballSpeedX -= 0.5;
    }
    if (ballSpeedY >0 && ballSpeedY < 15) {
        ballSpeedY += 0.1;
    }
    else if (ballSpeedY < 0 && ballSpeedY > -15) {
        ballSpeedY -= 0.1;
    }
    
}

//Event listener
canvas.addEventListener("mousemove", playerPosition);
setInterval(game, 1000/60);


