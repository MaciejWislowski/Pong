// Global variables
var doc = document.documentElement;


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let docWidth = document.body.clientWidth;
let docHigh = document.body.clientHeight;
let arrowU = document.getElementById('arrowUp');
let arrowD = document.getElementById('arrowDown');

if(document.body.clientWidth/document.body.clientHeight > 2) {
    canvas.height = docHigh* 0.90;
    canvas.width = canvas.height * 2;
} else {
    canvas.width = docWidth * 0.9;
    canvas.height = canvas.width * 0.5;
}

/* ====== V connected with player speed ====== */
var speed = 2;
var velY = 0;
var friction = 1;

const cw = canvas.width;
const ch = canvas.height;

const ballSize = 0.02*cw;

let ballX = cw/2-ballSize/2;
let ballY = ch/2-ballSize/2;

const paddleHeight = 0.1 * cw;
const paddleWidth = 0.02 * cw;

let playerX = 0.07 * cw;
const aiX = 0.91 * cw;

let playerY = 0.2 * cw;
let aiY = 0.2 * cw;

const lineWidth = 0.006 * cw;
const lineHeight = 0.015 * cw;

let ballSpeedX = -0.004 * cw;
let ballSpeedY = -0.004 * cw;

let playerScore = 0;
let aiScore = 0;

let playerSet = 0;
let aiSet = 0;

let ballSpeedMax = 0.015 * cw;


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
    for (let linePosition = 0.02 * cw; linePosition < ch; linePosition += 0.03 * cw) {
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
        if (middlePaddle - middleBall > 0.2 * ch) {
            aiY -= ballSpeedMax+playerScore/11*(playerSet+1); 
        }
        else if (middlePaddle - middleBall > 0.05 * ch) {
            aiY -= ballSpeedMax/3+playerScore/11*(playerSet+1);
        }
        else if (middlePaddle - middleBall < -0.2 * ch) {
            aiY += ballSpeedMax+playerScore/11*(playerSet+1);
        }
        else if (middlePaddle - middleBall < -0.05 * ch) {
            aiY += ballSpeedMax/3+playerScore/11*(playerSet+1);
        }
    }
    // AI movement on players part of board
    else if (ballX <= cw/2 && ballX > 2*playerX) {
        if (middlePaddle-middleBall > 0.1 * ch) {
            aiY -= ballSpeedMax/5;
        }
        else if (middlePaddle - middleBall < - 0.1 * ch) {
            aiY += ballSpeedMax/5;
        }
    }
}

// Collisions set up
function collistions() {

    // Colisions with top and bottom line
    if (ballY <= 0 || ballY >=ch-ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Collisions with left and right line
    if (ballX <= 0) {
        ballX = cw/2-ballSize/2;
        ballY = ch/2-ballSize/2;
        ballSpeedX = 0.004 * cw;
        ballSpeedY = 0.004 * cw;
        aiScore++;
        document.getElementById('0002').innerHTML = aiScore;
    }
    if (ballX >=cw-ballSize) {
        ballX = cw/2-ballSize/2;
        ballY = ch/2-ballSize/2;
        ballSpeedX = -0.004 * cw;
        ballSpeedY = -0.004 * cw;
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

//Players paddle position on Y Axis
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

function playerPositionMobile(e) {
    // console.log("Pozycja myszy to: " (e.clientY- topCanvas));
    playerY = e.touches[0].clientY - topCanvas - paddleHeight/2;
 

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
        ballSpeedX += 0.0005 *cw;
    }
    else if (ballSpeedX < 0 && ballSpeedX > -ballSpeedMax) {
        ballSpeedX -= 0.0005 *cw;
    }
    if (ballSpeedY >0 && ballSpeedY < ballSpeedMax) {
        ballSpeedY += 0.0001 *cw;
    }
    else if (ballSpeedY < 0 && ballSpeedY > -ballSpeedMax) {
        ballSpeedY -= 0.0001 *cw;
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
        playerSet = 0;
        aiSet = 0;
        playerScore = 0;
        aiScore = 0;
        document.getElementById('0003').innerHTML = playerSet;
        document.getElementById('0004').innerHTML = aiSet;
        document.getElementById('0002').innerHTML = aiScore;
        document.getElementById('0001').innerHTML = playerScore;
    }
    if (aiSet==3) {
        alert("You are a looser!!!");
        playerSet = 0;
        aiSet = 0;
        playerScore = 0;
        aiScore = 0;
        document.getElementById('0003').innerHTML = playerSet;
        document.getElementById('0004').innerHTML = aiSet;
        document.getElementById('0002').innerHTML = aiScore;
        document.getElementById('0001').innerHTML = playerScore;
    }
}

// function playerUpdate() {
//     if((navigator.userAgent.indexOf("Android") != -1)) {
//         arrowU.addEventListener("touchstart", () => {
//             friction = 1.1;
//             if(velY > -speed) {
//                 velY-=2;
//             }
//         })
//         arrowU.addEventListener("touchend", () => {
//             friction = 0.85;
//         })
    
//         arrowD.addEventListener("touchstart", () => {
//             friction = 1.1;
//             if(velY < speed) {
//                 velY+=2;
//             }
//         })
//         arrowD.addEventListener("touchend", () => {
//             friction = 0.85;
//         })

//         if(velY > 6) {
//             velY= 6;
//         }else if(velY < -6) {
//             velY = -6;
//         } else {
//             velY *= friction;
//         }

//         playerY +=velY;
    
//         if (playerY >= ch - paddleHeight) {
//             playerY = ch - paddleHeight;
//         }
    
//         if (playerY <= 0) {
//             playerY = 0;
//         }
//     }
    
//     else {
//         document.addEventListener("mousemove", playerPosition);
//     }


// }

function game () {
    // playerUpdate();
    table();
    ball();
    player();
    ai();
    aiPosition();
    collistions();
    set();

}

function startGame() {
    const startGameMessage = document.getElementById("start__screen");
    const orientationMessage = document.getElementById('orientation__change');

    if (!startGameMessage.classList.contains('none')){
        startGameMessage.classList.toggle('none');
    }


    if(window.innerHeight > window.innerWidth) {
        orientationMessage.classList.remove('none');
    } else {
        /* Chrome, MiBrowser, Brave */
        if(doc.requestFullscreen) {
            doc.requestFullscreen();
        }
        /* Safari */
        else if (doc.webkitRequestFullscreen) {
            doc.webkitRequestFullscreen();
        }
        /* IE11 */
        else if (doc.msRequestFullscreen) {
            doc.msRequestFullscreen();
        }
        setInterval(game, 15);
    }

}

function addingControlButtons() {
    let con = document.getElementById('control');

    if((navigator.userAgent.indexOf("Android") != -1)) {
        con.classList.toggle('none');
    }
}

function refresh() {
    if(window.innerHeight > window.innerWidth) {
        alert("First change screen orientation, then refresh!")
    }
    else{
        location.reload();
    }

}

function wideScreenSupport() {

    if(document.body.clientWidth/document.body.clientHeight > 2) {
        let mainContainer = document.getElementById('main-container');

        mainContainer.classList.toggle('grid-container');
        mainContainer.classList.toggle('grid-container-alternative');

    }
}

//Execution and Event listener
screen.orientation.lock("landscape-primary");
wideScreenSupport();
table();

if((navigator.userAgent.indexOf("Win") != -1)) {
    document.addEventListener("mousemove", playerPosition);
}
if((navigator.userAgent.indexOf("Android") != -1)) {
    document.addEventListener("touchmove", playerPositionMobile);
}
if((navigator.userAgent.indexOf("IOS") != -1)) {
    document.addEventListener("touchmove", playerPositionMobile);
}
refreshButton.addEventListener("click", refresh);
startButton.addEventListener("click", startGame);




