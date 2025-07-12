const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Surfer settings
let surfer = {
  x: 50,
  y: 230,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 1.2,
  jumpPower: -15,
  ducking: false,
};

// Obstacles: waves (low) and seagulls (high)
let obstacles = [];
let score = 0;
let gameSpeed = 6;
let isGameOver = false;

function createObstacle() {
  const isLow = Math.random() < 0.5; // 50% chance low/high
  obstacles.push({
    x: canvas.width,
    width: 40,
    height: isLow ? 30 : 80,
    low: isLow,
  });
}

function drawSurfer() {
  ctx.font = surfer.ducking ? "30px monospace" : "40px monospace";
  ctx.textBaseline = "top";
  // Draw emoji surfer; shift down if ducking
  ctx.fillText("🏄‍♂️", surfer.x, surfer.y + (surfer.ducking ? 20 : 0));
}

function drawObstacles() {
  ctx.font = "40px monospace";
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    const y = o.low ? 230 : 150;
    // Draw wave or seagull emoji depending on obstacle type
    ctx.fillText(o.low ? "🌊" : "🐦", o.x, y - (o.low ? 10 : 30));
    o.x -= gameSpeed;
  }
}

function checkCollision() {
  for (const o of obstacles) {
    const y = o.low ? 230 : 150;
    const h = o.height;
    // Calculate surfer rectangle (ducking changes height)
    const surferHeight = surfer.ducking ? 20 : surfer.height;
    if (
      surfer.x < o.x + o.width &&
      surfer.x + surfer.width > o.x &&
      surfer.y + (surfer.ducking ? 20 : 0) < y + h &&
      surfer.y + surferHeight > y
    ) {
      isGameOver = true;
    }
  }
}

function updateSurfer() {
  surfer.vy += surfer.gravity;
  surfer.y += surfer.vy;
  if (surfer.y >= 230) {
    surfer.y = 230;
    surfer.vy = 0;
  }
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "16px monospace";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "32px monospace";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSurfer();
  drawObstacles();
  updateSurfer();
  checkCollision();
  drawScore();

  score++;
  requestAnimationFrame(gameLoop);
}

setInterval(createObstacle, 1500);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp" && surfer.y >= 230) {
    surfer.vy = surfer.jumpPower;
  } else if (e.code === "ArrowDown") {
    surfer.ducking = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") {
    surfer.ducking = false;
  }
});

gameLoop();
