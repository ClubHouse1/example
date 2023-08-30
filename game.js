const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.color = 'red';
    this.bullets = [];
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed;
    }
  }

  moveRight() {
    if (this.x + this.width < canvas.width) {
      this.x += this.speed;
    }
  }

  moveUp() {
    if (this.y > 0) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y + this.height < canvas.height) {
      this.y += this.speed;
    }
  }

  shoot() {
    const bullet = new Bullet(this.x + this.width / 2, this.y);
    this.bullets.push(bullet);
  }

  checkBulletCollision(obstacle) {
    for (const bullet of this.bullets) {
      const dx = bullet.x - obstacle.x;
      const dy = bullet.y - obstacle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bullet.radius + obstacle.radius) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
        return true;
      }
    }
    return false;
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 8;
    this.color = 'blue';
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y -= this.speed;
  }
}

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.color = 'green';
    this.isDestroyed = false;
  }

  draw() {
    if (!this.isDestroyed) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

const player = new Player(canvas.width / 2 - 25, canvas.height - 80);
const obstacles = [];

// Create 10 obstacles
for (let i = 0; i < 10; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.7;
  obstacles.push(new Obstacle(x, y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();

  for (const bullet of player.bullets) {
    bullet.draw();
    bullet.update();
  }

  let destroyedObstacles = 0;
  for (const obstacle of obstacles) {
    if (!obstacle.isDestroyed) {
      obstacle.draw();
      if (player.checkBulletCollision(obstacle)) {
        obstacle.isDestroyed = true;
        destroyedObstacles++;
      }
    } else {
      destroyedObstacles++;
    }
  }

  if (destroyedObstacles === obstacles.length) {
    ctx.font = '80px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Congratulations! ', canvas.width / 9 - 200, canvas.height / 2);
  }

  requestAnimationFrame(draw);
}

function handleKeyDown(event) {
  if (event.key === 'ArrowLeft') {
    player.moveLeft();
  } else if (event.key === 'ArrowRight') {
    player.moveRight();
  } else if (event.key === 'ArrowUp') {
    player.moveUp();
  } else if (event.key === 'ArrowDown') {
    player.moveDown();
  } else if (event.key === ' ') {
    player.shoot();
  }
}

document.addEventListener('keydown', handleKeyDown);

draw();
