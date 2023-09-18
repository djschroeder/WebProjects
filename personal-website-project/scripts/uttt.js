const canvas = document.getElementById("utttCanvas");
const ctx = canvas.getContext("2d");

function drawBoard() {
    ctx.beginPath();
    ctx.moveTo(canvas.width/3,0);
    ctx.lineTo(canvas.width/3,canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(canvas.width*2/3,0);
    ctx.lineTo(canvas.width*2/3,canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0,canvas.height/3);
    ctx.lineTo(canvas.width,canvas.height/3);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0,canvas.height*2/3);
    ctx.lineTo(canvas.width,canvas.height*2/3);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawBoard();
}

window.addEventListener("resize", resizeCanvas);

function init() {
    //initialize all game prereqs here
    gameLoop();
}

function gameLoop() {
    // Update game logic
    // ...
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Render game elements
    // ...
    drawBoard();
    // Request the next frame
    requestAnimationFrame(gameLoop);
}
resizeCanvas();
init();