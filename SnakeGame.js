let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let scoreElement = document.getElementById("score");
let bestScoreElement = document.getElementById("best-score");

let startBtn = document.getElementById("start-btn");
let pauseBtn = document.getElementById("pause-btn");
let restartBtn = document.getElementById("restart-btn");
let modeBtn = document.getElementById("mode-btn");
let difficultyOptions = document.getElementById("difficulty-options");
let difficultyBtns = document.querySelectorAll(".difficulty-btn");

let cell = 20;
let score = 10;
let bestScore = 0;
let gameOver = false;
let direction = "right";
let scell = [[0, 0]];
let foodCell = randomCell();
let gameInterval;
let snakeSpeed = 200; // Default snake speed (Medium)
let isGameRunning = false; // Game starts as paused

// Load the snake food image
let snakeFoodImg = new Image();
snakeFoodImg.src = "apple.png";

// Start Button Event Listener
startBtn.addEventListener("click", function () {
  if (!isGameRunning) {
    isGameRunning = true;
    startGame();
    startBtn.disabled = true; // Disable Start button when game is running
    pauseBtn.disabled = false; // Enable Pause button
    restartBtn.disabled = false; // Enable Restart button
  }
});

// Pause Button Event Listener with toggle effect
pauseBtn.addEventListener("click", function () {
  if (isGameRunning) {
    clearInterval(gameInterval);
    isGameRunning = false;
    pauseBtn.innerText = "Resume";
    pauseBtn.classList.remove("resumed");
    pauseBtn.classList.add("paused");
  } else {
    startGame();
    isGameRunning = true;
    pauseBtn.innerText = "Pause";
    pauseBtn.classList.remove("paused");
    pauseBtn.classList.add("resumed");
  }
});

// Restart Button Event Listener
restartBtn.addEventListener("click", function () {
  resetGame();
  pauseBtn.innerText = "Pause";
  pauseBtn.disabled = false;
  isGameRunning = true;
});

// Mode Button Event Listener
modeBtn.addEventListener("click", function () {
  difficultyOptions.classList.toggle("active");
});

difficultyBtns.forEach((btn) => {
  if (btn.id === "defaultMode") {
    btn.classList.add("active");
  }
});

// Difficulty Buttons Event Listeners
difficultyBtns.forEach((button) => {
  button.addEventListener("click", function () {
    // Set the snake speed based on the clicked button
    snakeSpeed = parseInt(button.getAttribute("data-speed"));

    // Remove "active" class from all buttons
    difficultyBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add "active" class to the clicked button
    button.classList.add("active");

    difficultyOptions.classList.toggle("active");
  });
});

// Game loop starts when "Start" is clicked
function startGame() {
  gameInterval = setInterval(() => {
    update();
    draw();
  }, snakeSpeed); // Adjust speed dynamically
}

function resetGame() {
  clearInterval(gameInterval);
  gameOver = false;
  score = 10;
  if (score > bestScore) {
    bestScore = score;
  }
  direction = "right";
  scell = [[0, 0]];
  foodCell = randomCell();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startGame();
}

// Handle key press to control snake movement
document.addEventListener("keydown", function (e) {
  e.preventDefault();
  let key = e.key;
  if (key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
});

function draw() {
  if (gameOver) {
    clearInterval(gameInterval);
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    pauseBtn.disabled = true; // Disable Pause button
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake body
for (let i = 0; i < scell.length - 1; i++) {
  ctx.fillStyle = "lightblue";
  
  // Draw the filled rectangle
  ctx.fillRect(scell[i][0], scell[i][1], cell, cell);

  // Now create the path for the border
  ctx.beginPath();
  ctx.rect(scell[i][0], scell[i][1], cell, cell); // Define rectangle as a path

  // Set border (stroke) properties
  ctx.lineWidth = 1; // Border width
  ctx.strokeStyle = "#000000"; // Border color (black)

  // Draw the border
  ctx.stroke();
}


  // Draw snake head
  let head = scell[scell.length - 1];
  ctx.fillStyle = "green";
  ctx.fillRect(head[0], head[1], cell, cell);

  // Increase the size of the apple image
  let appleSize = cell * 1.5; 
  let offset = (appleSize - cell) / 2; 

  // Draw the apple image at the adjusted position
  ctx.drawImage(
    snakeFoodImg, // The image object
    foodCell[0] - offset, // X position adjusted by offset
    foodCell[1] - offset, // Y position adjusted by offset
    appleSize, // Width of the image
    appleSize // Height of the image
  );

  // Update the score display
  scoreElement.innerText = `Score: ${score}`;
  bestScoreElement.innerText = `Best Score: ${bestScore}`;
}

function update() {
  let headX = scell[scell.length - 1][0];
  let headY = scell[scell.length - 1][1];

  let newX = headX;
  let newY = headY;

  if (direction === "right") {
    newX += cell;
  } else if (direction === "down") {
    newY += cell;
  } else if (direction === "left") {
    newX -= cell;
  } else if (direction === "up") {
    newY -= cell;
  }

  if (
    newX >= canvas.width ||
    newX < 0 ||
    newY >= canvas.height ||
    newY < 0 ||
    scell.some((cell) => cell[0] === newX && cell[1] === newY)
  ) {
    if (score > bestScore) {
      bestScore = score;
    }
    pauseBtn.disabled = true; 
    gameOver = true;
  }

  scell.push([newX, newY]);

  if (newX === foodCell[0] && newY === foodCell[1]) {
    score += 10;
    foodCell = randomCell();
  } else {
    scell.shift();
  }
}

function randomCell() {
  let x = Math.floor((Math.random() * canvas.width) / cell) * cell;
  let y = Math.floor((Math.random() * canvas.height) / cell) * cell;
  return [x, y];
}

