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

let playerScore = 0;
let aiScore = 0;

let playerSet = 0;
let aiSet = 0;

let ballSpeedMax = 15;


topCanvas = canvas.offsetTop;
console.log(topCanvas);

//---------------------------------------------------------------------------------------------//
//---------------------------------    Functions   --------------------------------------------//
//---------------------------------------------------------------------------------------------//

// --------------------------------   Draw on canvas ------------------------------------------//
function ai() { 
    ctx.fillStyle = "darkgrey";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight); 
}

function ball() {
    ctx.fillStyle = "#ffff";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function player() {
    ctx.fillStyle = "grey";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight); 
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


//-----------------------------------------   Mechanics   ------------------------------------//

// AI paddle position on Y Axis
function aiPosition () {
    var middlePaddle = aiY + paddleHeight/2;
    var middleBall = ballY + ballSize/2;

   // Ai paddle movement on ai part of board
    if(ballX > cw/2) {
        if (middlePaddle - middleBall > 200) {
            aiY -= ballSpeedMax+playerScore/11*(playerSet+1)-aiScore/11; 
        }
        else if (middlePaddle - middleBall > 50) {
            aiY -= ballSpeedMax/3+playerScore/11*(playerSet+1)-aiScore/11;
        }
        else if (middlePaddle - middleBall < -200) {
            aiY += ballSpeedMax+playerScore/11*(playerSet+1)-aiScore/11;
        }
        else if (middlePaddle - middleBall < -50) {
            aiY += ballSpeedMax/3+playerScore/11*(playerSet+1)-aiScore/11;
        }
    }

    // AI movement on players part of board
    else if (ballX <= cw/2 && ballX > 2*playerX) {
        if (middlePaddle-middleBall > 100) {
            aiY -= ballSpeedMax/5;
        }
        else if (middlePaddle - middleBall < - 100) {
            aiY += ballSpeedMax/5;
        }
    }
}

// All collisions set up
function collistions() {

    // Colisions with top and bottom line
    if (ballY <= 0 || ballY >=ch-ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Collisions with left and right line
    if (ballX <= 0) {
        ballX = cw/2-ballSize/2;
        ballY = ch/2-ballSize/2;
        ballSpeedX = 4;
        ballSpeedY = 4;
        aiScore++;
        document.getElementById('0002').innerHTML = aiScore;
    }
    if (ballX >=cw-ballSize) {
        ballX = cw/2-ballSize/2;
        ballY = ch/2-ballSize/2;
        ballSpeedX = -4;
        ballSpeedY = -4;
        playerScore++;
        document.getElementById('0001').innerHTML = playerScore;
    }

    // Collisions with Players paddle
    if ((ballX <= playerX + paddleWidth) && (ballX > playerX + paddleWidth-ballSpeedMax)  && (ballY + ballSize> playerY) && (ballY< playerY + paddleHeight)) {
        ballX += 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = ballSpeedY;
        speedUp();
    }
    if (((ballX < playerX + paddleWidth) && (ballX+ballSize > playerX)) && (ballY + ballSize >= playerY) && (ballY + ballSize <= playerY+9) ) {
        ballX += 10;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
    speedUp();
    }
    if (((ballX < playerX + paddleWidth) && (ballX+ballSize > playerX)) && (ballY <= playerY + paddleHeight) && (ballY > playerY + paddleHeight-9) ) {
        ballX += 10;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
    speedUp();
    }

    // Colisions with Ai paddle
    if ((ballX + ballSize >= aiX) && (ballX + ballSize < aiX+ballSpeedMax) && (ballY + ballSize >= aiY) && (ballY <= aiY + paddleHeight)) {
        ballX -= 5;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = ballSpeedY;
        speedUp();
    }
    if ((ballX + ballSize > aiX ) && (ballX + ballSize < aiX + paddleWidth) && (ballY + ballSize >= aiY) && (ballY + ballSize <= aiY+9) ) {
        ballX -= 10;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
    speedUp();
    }
    if ((ballX + ballSize > aiX ) && (ballX + ballSize < aiX + paddleWidth)&& (ballY <= aiY + paddleHeight) && (ballY > aiY + paddleHeight-9) ) {
        ballX -= 10;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
        speedUp();  
    }
}

function overpower1() {
    if (playerScore>=9) {
        overpower++;
    }
}

// Players paddle position on Y Axis
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

// Ball speed change
function speedUp() {
    if (ballSpeedX >0 && ballSpeedX < ballSpeedMax) {
        ballSpeedX += 0.5;
    }
    else if (ballSpeedX < 0 && ballSpeedX > -ballSpeedMax) {
        ballSpeedX -= 0.5;
    }
    if (ballSpeedY >0 && ballSpeedY < ballSpeedMax) {
        ballSpeedY += 0.1;
    }
    else if (ballSpeedY < 0 && ballSpeedY > -ballSpeedMax) {
        ballSpeedY -= 0.1;
    }  
}

// Set and victory conditions
function set() {
    if(playerScore >= 11 && playerScore - aiScore >= 2) {
        playerSet++;
        playerScore = 0;
        aiScore = 0;
        document.getElementById('0003').innerHTML = playerSet;
        document.getElementById('0002').innerHTML = aiScore;
        document.getElementById('0001').innerHTML = playerScore;
        ballSpeedMax++
    }
    if(aiScore >= 11 && aiScore - playerScore >= 2 ) {
        aiSet++;
        playerScore -= playerScore;
        aiScore -= aiScore;
        ballSpeedMax++
        document.getElementById('0004').innerHTML = aiSet;
        document.getElementById('0002').innerHTML = aiScore;
        document.getElementById('0001').innerHTML = playerScore;
    }
    if (playerSet==3) {
        alert("Congratulations!!! You win!!!");
    }
    if (aiSet==3) {
        alert("You are a looser!!!");
    }
}

function game () {
    table();
    ball();
    player();
    ai();
    aiPosition();
    collistions();
    set();
}

//Event listener
canvas.addEventListener("mousemove", playerPosition);
setInterval(game, 15);


