let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

let originalBoardWidth;
let originalBoardHeight;

let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -7;
let velocityY = 0;
let gravity = 0.4;

let highScore = localStorage.getItem("hi-score") || 0;
let score = 0;
let gameOver = false;

function resetGame() {
    // Reset game variables and state
    gameOver = false;
    score = 0;
    dino.y = dinoY;
    dinoImg.src = "./img/dino.png";

    // Clear existing cacti
    cactusArray = [];

    // Reset physics variables
    velocityX = -8;
    velocityY = 0;
    gravity = 0.2;

    // Hide the reset button after resetting the game
    document.getElementById("resetButton").style.display = "none";

    // Reload the page
    location.reload();
}

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    // Hide the reset button initially
    document.getElementById("resetButton").style.display = "none";

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    };

    // Store the original board size
    originalBoardWidth = board.width;
    originalBoardHeight = board.height;

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
    window.addEventListener("resize", handleResize); // Added event listener for resize
};

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("hi-score", highScore);
        }

        if (document.getElementById("resetButton").clicked) {
            score = 0;
            gameOver = false;
            document.getElementById("resetButton").clicked = false;
            highScore = 0;
            localStorage.setItem("hi-score", highScore);
                
        }

        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            };
        }

        if (gameOver) {
            context.fillStyle = "red";
            context.font = "30px 'Press Start 2P', cursive";
            let gameOverText = "Game Over";
            let gameOverTextWidth = context.measureText(gameOverText).width;
            context.fillText(gameOverText, boardWidth / 2 - gameOverTextWidth / 2, boardHeight - 50);

            document.getElementById("resetButton").style.display = "block";
        }
    }

    context.fillStyle = "black";
    context.font = "20px 'Press Start 2P', cursive";
    score++;
    context.fillText("Score: " + score, 5, 20);
    context.fillText("Hi-Score: " + highScore, 5, 40);
}

document.getElementById("resetButton").addEventListener("click", function () {
    document.getElementById("resetButton").clicked = true;
});

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -12;
    } else if (e.code == "ArrowDown" && dino.y == dinoY) {
        // Handle ArrowDown if needed
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    };

    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.70) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.50) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.40) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function handleResize() {
    boardWidth = window.innerWidth;
    boardHeight = window.innerHeight;

    board.width = boardWidth;
    board.height = boardHeight;

    originalBoardWidth = board.width;
    originalBoardHeight = board.height;
}