const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let surfer = {
  x: 50,
  y: 230,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 1.2,
  jumpPower: -15,
  ducking: false
};

let obstacles = [];
let score = 0;
let gameSpeed = 6;
let isGameOver = false;

function createObstacle() {
  const isLow = Math.random() < 0.5;
  obstacles.push({
    x: canvas.width,
    width: 30,
    height: isLow ? 30 : 80,
    low: isLow
  });
}

function drawSurfer() {
  ctx.fillStyle = surfer.ducking ? '#ffcc00' : '#fff';
  const h = surfer.ducking ? 20 : surfer.height;
  ctx.fillRect(surfer.x, surfer.y + (surfer.height - h), surfer.width, h);
}

function drawObstacles() {
  ctx.fillStyle = '#00ffff';
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    const y = o.low ? 230 : 150;
    ctx.fillRect(o.x, y, o.width, o.height);
    o.x -= gameSpeed;
  }
}

function checkCollision() {
  for (const o of obstacles) {
    const y = o.low ? 230 : 150;
    const h = o.height;
    if (
      surfer.x < o.x + o.width &&
      surfer.x + surfer.width > o.x &&
      surfer.y < y + h &&
      surfer.y + surfer.height > y
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
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
  if (isGameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '32px monospace';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
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

document.addEventListener("keydown", e => {
  if (e.code === "Space" && surfer.y >= 230) {
    surfer.vy = surfer.jumpPower;
  } else if (e.code === "ArrowDown") {
    surfer.ducking = true;
  }
});

document.addEventListener("keyup", e => {
  if (e.code === "ArrowDown") {
    surfer.ducking = false;
  }
});

gameLoop();