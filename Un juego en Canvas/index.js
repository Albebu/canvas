const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

function generateRandomEnemy(){
    return new Enemy(Math.random() * width, Math.random() * height);
}

function checkOutOfBounds(obj) {
  if (obj.xPos < 0) obj.xPos = 0;
  if (obj.xPos + obj.width > width) obj.xPos = width - obj.width;
  if (obj.yPos < 0) obj.yPos = 0;
  if (obj.yPos + obj.height > height) obj.yPos = height - obj.height;
}

function checkCollision(obj1, obj2) {
  return (
    obj1.xPos < obj2.xPos + obj2.width &&
    obj1.xPos + obj1.width > obj2.xPos &&
    obj1.yPos < obj2.yPos + obj2.height &&
    obj1.yPos + obj1.height > obj2.yPos
  );
}

// Clase Bullet
class Bullet {
  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = 5;
    this.height = 5;
    this.color = "rgb(0, 0, 0)";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }

  move() {
    this.xPos += 5; // Movimiento hacia la derecha
  }

  isOutOfBounds() {
    return this.xPos > width; // Verifica si la bala está fuera de la pantalla
  }
}

// Clase Square (Jugador)
class Square {
  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = 55;
    this.height = 50;
    this.color = "rgb(200, 0, 0)";
    this.coldown = 250; // Tiempo de enfriamiento (ms)
    this.timeWithoutShooting = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }

  shoot(bullets) {
    const now = Date.now();
    if (now - this.timeWithoutShooting > this.coldown) {
      bullets.push(new Bullet(this.xPos + this.width, this.yPos + this.height / 2));
      this.timeWithoutShooting = now;
    }
  }

  move(keys) {
    if (keys["a"] || keys["A"]) this.xPos -= 5;
    if (keys["d"] || keys["D"]) this.xPos += 5;
    if (keys["w"] || keys["W"]) this.yPos -= 5;
    if (keys["s"] || keys["S"]) this.yPos += 5;
    checkOutOfBounds(this);
  }
}

// Clase Enemy (Hitbox)
class Enemy {
  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = 50;
    this.height = 50;
    this.color = "rgb(0, 0, 200)";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }

  checkCollisionWith(obj) {
    this.color = checkCollision(this, obj) ? "rgb(0, 200, 0)" : "rgb(0, 0, 200)";
  }
}

// Configuración del juego
const player = new Square(50, 50);
const enemy = generateRandomEnemy();
const bullets = [];
const keys = {};

// Eventos de teclado
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Bucle principal
function draw() {
  ctx.clearRect(0, 0, width, height);

  // Mover jugador
  player.move(keys);

  // Disparar bala
  if (keys[" "]) {
    player.shoot(bullets);
  }

  // Dibujar y mover balas
  bullets.forEach((bullet, index) => {
    bullet.move();
    bullet.draw();
    if (bullet.isOutOfBounds()) bullets.splice(index, 1);
  });

  // Verificar colisión y dibujar elementos
  enemy.checkCollisionWith(player);
  bullets.forEach((bullet) => {
    enemy.checkCollisionWith(bullet);
  });
  player.draw();
  enemy.draw();
}

// Inicia el juego
setInterval(draw, 20);
