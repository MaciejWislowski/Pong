// Global variables
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

const cw = canvas.width;
const ch = canvas.height;
/*
const ball;
ball.width = 20;
ball.height = 20;
const bw = ball.width;
const bh = ball.height;
*/

// Functions
function table() {
    // board
    ctx.fillStyle;
    ctx.fillRect(0, 0, cw, ch)
    /*middle line
    ctx.fillStyle = 'white';
    ctx.fillRect(cw/2 - bw/2, ch/2-bh/2, bw, bh) */
}

// Call functions
table();