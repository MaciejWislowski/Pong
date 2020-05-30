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

let ballSpeedX = -4;
let ballSpeedY = -4;

topCanvas = canvas.offsetTop;
console.log(topCanvas);

// Functions
function player() {
    ctx.fillStyle = "grey";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight); 
}

function ai() { 
    ctx.fillStyle = "darkgrey";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight); 
}

function ball() {
    ctx.fillStyle = "#ffff";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >=ch-ballSize) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballX <= 0) {
        window.location.reload();
    }
    if (ballX >=cw-ballSize) {
        window.location.reload();
    }

    if ((ballX <= playerX + paddleWidth) && (ballX > playerX + paddleWidth-15)  && (ballY + ballSize> playerY) && (ballY< playerY + paddleHeight)) {
        ballX += 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = ballSpeedY;
        speedUp();
    }
    if (((ballX < playerX + paddleWidth) && (ballX+ballSize > playerX)) && (ballY + ballSize >= playerY) && (ballY + ballSize <= playerY+9) ) {
        ballX += 5;
        ballY -= 5;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
    speedUp();
    }
    if (((ballX < playerX + paddleWidth) && (ballX+ballSize > playerX)) && (ballY <= playerY + paddleHeight) && (ballY > playerY + paddleHeight-9) ) {
        ballX += 5;
        ballY += 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
    speedUp();
    }
    if ((ballX + ballSize >= aiX) && (ballX + ballSize < aiX+10) && (ballY + ballSize >= aiY) && (ballY <= aiY + paddleHeight)) {
        ballX -= 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = ballSpeedY;
        speedUp();
    }
    if ((ballX + ballSize > aiX ) && (ballX + ballSize < aiX + paddleWidth) && (ballY + ballSize >= aiY) && (ballY + ballSize <= aiY+9) ) {
        ballX -= 5;
        ballY -= 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
    speedUp();
    }
    if ((ballX + ballSize > aiX ) && (ballX + ballSize < aiX + paddleWidth)&& (ballY <= aiY + paddleHeight) && (ballY > aiY + paddleHeight-9) ) {
        ballX -= 5;
        ballY += 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
        speedUp();  
    }
}


function table() {
    // board
    ctx.fillStyle = "darkred";
    ctx.fillRect(0, 0, cw, ch);
    // middle line
    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = "black";
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
    var middlePaddle = aiY + paddleHeight/2;
    var middleBall = ballY + ballSize/2;

    if(ballX > cw/2) {
        if (middlePaddle - middleBall > 200) {
            aiY -= 15; 
        }
        else if (middlePaddle - middleBall > 50) {
            aiY -= 5;
        }
        else if (middlePaddle - middleBall < -200) {
            aiY += 15;
        }
        else if (middlePaddle - middleBall < -50) {
            aiY += 5;
        }
    }
    else if (ballX <= cw/2 && ballX > 2*playerX) {
        if (middlePaddle-middleBall > 100) {
            aiY -= 2;
        }
        else if (middlePaddle - middleBall < - 100) {
            aiY += 2;
        }
    }

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
setInterval(game, 15);


