const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const leftBtn = document.querySelector('.left');
const rightBtn = document.querySelector('.right');
const gameOverCon = document.querySelector('.game-over');
const h2 = document.querySelector('.game-over h2');
const restartBtn = document.querySelector('.restart');
const scoreCon = document.querySelectorAll('.score');

const color = "#0095DD";
let gameInterval;
let isGameOver = false;
let isGameStarted = false;
let score = 0;

// ball
let ballX = canvas.width / 2;
let ballY = canvas.height - 25;
let ballDX = 1.5;
let ballDY = -1.5;
const ballRadius = 10;

// bat
const batHeight = 15;
const batWidth = 80;
let batX = (canvas.width - batWidth) / 2;
let batY = canvas.height - batHeight;
const batDX = 40;

// target
const targetHeight = 20;
const targetWidth = 20;
const noOfTargetsPerLine = 10;
const noOfLines = 5;
let targets = [];

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawBat() {
    ctx.beginPath();
    ctx.rect(batX, batY, batWidth, batHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function createTargets() {
    for (let i = 1; i <= noOfLines; i++) {
        for (let j = 1; j <= noOfTargetsPerLine; j++) {
            let x = j * targetWidth * 1.5;
            let y = i * targetWidth * 1.5;

            targets.push({
                x: x, y: y, destroyed: false
            })
        }
    }
}

function drawTarget(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, targetWidth, targetHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawTargets() {
    targets.forEach((t) => {
        if (!t.destroyed) {
            drawTarget(t.x, t.y);
        }
    })
}

function moveBall() {
    if (ballX <= 0 || ballX >= canvas.width) {
        ballDX *= -1;
    }
    ballX += ballDX;

    if (ballY <= 0) {
        ballDY *= -1;
    }
    ballY += ballDY;

    if (ballY >= canvas.height) {
        gameOver();
    }
}

function moveBat(para) {
    if (para == "left" && batX > 0) {
        batX -= batDX;
    } else if (para == "right" && batX < canvas.width - batWidth) {
        batX += batDX;
    }
}

function collisionWithBat() {
    const closestX = Math.max(batX, Math.min(ballX, batX + batWidth));
    const closestY = Math.max(batY, Math.min(ballY, batY + batHeight));

    const dx = ballX - closestX;
    const dy = ballY - closestY;

    if ((dx * dx + dy * dy) < (ballRadius * ballRadius)) {
        ballDY *= -1;
        console.log("colision detected with bat");
    }
}

function collisionWithTargets() {
    targets.forEach((t) => {
        if (!t.destroyed) {
            const closestX = Math.max(t.x, Math.min(ballX, t.x + targetWidth));
            const closestY = Math.max(t.y, Math.min(ballY, t.y + targetHeight));

            const dx = ballX - closestX;
            const dy = ballY - closestY;

            if ((dx * dx + dy * dy) < (ballRadius * ballRadius)) {
                score++;
                scoreCon.forEach((sc) => {
                    sc.textContent = score;
                })
                ballDY *= -1;
                t.destroyed = true;
                console.log("colision detected with target");
            }
        }
    })
}

function gameOver() {
    console.log("game over");
    h2.textContent = 'Game Over';
    gameOverCon.style.display = 'grid';
    isGameOver = true;
    clearInterval(gameInterval);
}

function youWin() {
    console.log("you win");
    h2.textContent = 'You Win';
    gameOverCon.style.display = 'grid';
    isGameOver = true;
    clearInterval(gameInterval);
}

function draw() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBat();
        drawTargets();
        moveBall();
        collisionWithBat();
        collisionWithTargets();
        if (score >= 50) {
            youWin();
        }
    }
}

createTargets();
draw();

function startGame() {
    //createTargets();
    gameInterval = setInterval(draw, 10);
}

function restart() {
    gameOverCon.style.display = 'none';
    score = 0;
    scoreCon.forEach((sc) => {
        sc.textContent = '';
    })
    ballX = canvas.width / 2;
    ballY = canvas.height - 25;
    ballDX = 2;
    batX = (canvas.width - batWidth) / 2;
    batY = canvas.height - batHeight;
    targets = [];
    isGameStarted = false;
    isGameOver = false;
    createTargets();
    draw();
}

// game controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        if (!isGameStarted) {
            startGame();
            isGameStarted = true;
            ballDX = -2;
        } else {
            moveBat("left");
        }
    } else if (e.key === "ArrowRight") {
        if (!isGameStarted) {
            startGame();
            isGameStarted = true;
        } else {
            moveBat("right");
        }
    }

    if (e.key === "a") {
        if (!isGameStarted) {
            startGame();
            isGameStarted = true;
            ballDX = -2;
        } else {
            moveBat("left");
        }
    } else if (e.key === "d") {
        if (!isGameStarted) {
            startGame();
            isGameStarted = true;
        } else {
            moveBat("right");
        }
    }
});

// touch controls
leftBtn.addEventListener('click', () => {
    if (!isGameStarted) {
        startGame();
        isGameStarted = true;
        ballDX = -2
    } else {
        moveBat("left");
    }
})

rightBtn.addEventListener('click', () => {
    if (!isGameStarted) {
        startGame();
        isGameStarted = true;
    } else {
        moveBat("right");
    }
})

restartBtn.addEventListener('click', restart)