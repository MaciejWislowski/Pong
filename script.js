// Global variables
var doc = document.documentElement;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let docWidth = document.body.clientWidth;
let docHigh = document.body.clientHeight;
let arrowU = document.getElementById('arrowUp');
let arrowD = document.getElementById('arrowDown');

if(document.body.clientWidth/document.body.clientHeight > 2.1) {
    canvas.height = docHigh* 0.90;
    canvas.width = canvas.height * 2;
} else if (document.body.clientWidth/document.body.clientHeight > 1.5) {
    canvas.width = docWidth * 0.8;
    canvas.height = canvas.width * 0.5;
}
else {
    canvas.width = docWidth * 0.90;
    canvas.height = canvas.width * 0.5;
}

var pauseBlock = 0;
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

var ballSpeedX = -0.004 * cw;
var ballSpeedY = -0.004 * cw;

let playerScore = 0;
let aiScore = 0;

let playerSet = 0;
let aiSet = 0;

var ballSpeedMax = 0.015 * cw;


topCanvas = canvas.offsetTop;
console.log(topCanvas);

//---------------------------------------------------------------------------------------------//
//---------------------------------    Functions   --------------------------------------------//
//---------------------------------------------------------------------------------------------//

// --------------------------------   Draw on canvas ------------------------------------------//

// Draw AI paddle
function ai() { 
    ctx.fillStyle = "darkgrey";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight); 
}

// Draw the ball
function ball() {
    ctx.fillStyle = "#ffff";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// Draw the player paddle
function player() {
    ctx.fillStyle = "grey";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight); 
}

// Draw the board and the middle line
function table() {
    // Draw the board
    ctx.fillStyle = "darkred";
    ctx.fillRect(0, 0, cw, ch);
    // Draw the middle line
    for (let linePosition = 0.02 * cw; linePosition < ch; linePosition += 0.03 * cw) {
        ctx.fillStyle = "black";
        ctx.fillRect(cw/2 - lineWidth/2, linePosition - lineHeight/2, lineWidth, lineHeight);
    }
}

// In case of the wider screen function is moving the scoreboard from to to the left
function wideScreenSupport() {
    if(document.body.clientWidth/document.body.clientHeight > 2) {
        let mainContainer = document.getElementById('main-container');

        mainContainer.classList.toggle('grid-container');
        mainContainer.classList.toggle('grid-container-alternative');

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
        toggleClass('main-container','blurred');
        let score = document.getElementById('won__score');
        score.innerText = document.getElementById('userName').value + ': '+ playerSet  + '     ' + 'AI: ' + aiSet;
        toggleClass('won__screen','none');
        playerSet = 0;
        aiSet = 0;
        playerScore = 0;
        aiScore = 0;
        
        ballSpeedMax = 0.015 * cw;
        document.getElementById('0003').innerHTML = playerSet;
        document.getElementById('0004').innerHTML = aiSet;
        document.getElementById('0002').innerHTML = aiScore;
        document.getElementById('0001').innerHTML = playerScore;
        clearInterval(gameLoop);
    }
    if (aiSet==3) {
        toggleClass('main-container','blurred');
        let score = document.getElementById('lost__score');
        score.innerText = 'AI: ' + aiSet + '     ' + document.getElementById('userName').value + ': '+ playerSet;
        toggleClass('lost__screen','none');
        playerSet = 0;
        aiSet = 0;
        playerScore = 0;
        aiScore = 0;
        ballSpeedMax = 0.015 * cw;

        document.getElementById('0003').innerHTML = playerSet;
        document.getElementById('0004').innerHTML = aiSet;
        document.getElementById('0002').innerHTML = aiScore;
        document.getElementById('0001').innerHTML = playerScore;
        clearInterval(gameLoop);
    }
}

// Pause the game
function pause(e) {
    if (e.code == "Space") {
        toggleClass('main-container','blurred');
        toggleClass('pause__screen','none');
        clearInterval(gameLoop);
            document.removeEventListener('keypress', pause);
        document.addEventListener('keypress', unpause);
    }
}

function unpause(e) {
    if (e.code == "Space") {
        toggleClass('pause__screen','none');
        toggleClass('main-container','blurred');
        pauseBlock--;
        gameLoop = setInterval(game, 15);
        document.removeEventListener('keypress', unpause);
        document.addEventListener('keypress', pause);
    }
}

//------------------------------------------   Effects   -------------------------------------//

function toggleClass(IDName, className){
    const toggleItem = document.getElementById(IDName)

    toggleItem.classList.toggle(className);
}

//-----------------------------------------   Execution   ------------------------------------//

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

// Function describe what is happening after clicking the start game button
function startGame() {
    const startGameMessage = document.getElementById("start__screen");
    const orientationMessage = document.getElementById('orientation__change');
    var playerName = document.getElementById('userName').value;

    if(playerName.length > 11) {
        alert("Please choose shorter name!")
    }
    else {
        
        document.getElementsByClassName('playerNameSc')[0].innerText=playerName;
        document.getElementsByClassName('playerNameSc')[1].innerText=playerName;

        if (!startGameMessage.classList.contains('none')){
            startGameMessage.classList.toggle('none');
        }
        if (!lost__screen.classList.contains('none')){
            lost__screen.classList.toggle('none');
        }
        if (!won__screen.classList.contains('none')){
            won__screen.classList.toggle('none');
        }


        if(document.body.clientHeight > document.body.clientWidth) {
            orientationMessage.classList.remove('none');
        } 
        else {
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

            toggleClass('main-container','blurred');
            gameLoop = setInterval(game, 15);
            canvas.addEventListener("touchstart", DblClk);
    }
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

//Execution and Event listener

wideScreenSupport();
table();

if((navigator.userAgent.indexOf("Win") != -1 || 
    navigator.userAgent.indexOf("Mac OS X") != -1)) {
    document.addEventListener("mousemove", playerPosition);

}
if((navigator.userAgent.indexOf("Android") != -1 ||
    navigator.userAgent.indexOf("iPhone") != -1 ||
    navigator.userAgent.indexOf("iPad") != -1)) {
    document.addEventListener("touchmove", playerPositionMobile);

}
document.addEventListener('keypress', pause);
returnToMenuButton.addEventListener("click", refresh);
startAgainButton.addEventListener("click", startGame);
returnToMenuButtonW.addEventListener("click", refresh);
startAgainButtonW.addEventListener("click", startGame);
refreshButton.addEventListener("click", refresh);
startButton.addEventListener("click", startGame);








