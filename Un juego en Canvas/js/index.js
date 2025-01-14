const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const TILESIZE = 32;
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const colors = {
    0: 'black',
    1: 'blue',
    2: 'yellow',
    3: 'orange',
}

function drawMap() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            ctx.fillStyle = colors[map[i][j]];
    
            if (map[i][j] === 2) {
                const centerX = j * TILESIZE + TILESIZE / 2;
                const centerY = i * TILESIZE + TILESIZE / 2;
    
                ctx.fillRect(centerX, centerY, TILESIZE / 4, TILESIZE / 4);
            } else {
                ctx.fillRect(j * TILESIZE, i * TILESIZE, TILESIZE, TILESIZE);
            }
        }
    }
}

let pacman = {
    x: 1,
    y: 1,
    size: TILESIZE / 2,
    color: 'yellow',
    direction: 'RIGHT',
}

let ghost = {
    x: 13,
    y: 13,
    size: TILESIZE / 2,
    color: 'orange',
    direction: 'UP',
}

function drawGhosts() {
    const centerX = ghost.x * TILESIZE + TILESIZE / 2;
    const centerY = ghost.y * TILESIZE + TILESIZE / 2;

    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ghost.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

let score = 0;

function drawScore() {
    ctx.fillStyle = 'white'; // Color del texto
    ctx.font = '20px Arial'; // Estilo y tamaño de la fuente
    ctx.fillText(`Score: ${score}`, 10, 20); // Texto y posición (x, y)
}

function drawPacman() {
    const centerX = pacman.x * TILESIZE + TILESIZE / 2;
    const centerY = pacman.y * TILESIZE + TILESIZE / 2;
    let startAngle, endAngle; // Ángulos del arco para la "boca"

    // Determinar los ángulos en función de la dirección
    if (pacman.direction === 'RIGHT') {
        startAngle = 0.2 * Math.PI; // Boca abierta hacia la derecha
        endAngle = 1.8 * Math.PI;
    } else if (pacman.direction === 'LEFT') {
        startAngle = 1.2 * Math.PI; // Boca abierta hacia la izquierda
        endAngle = 0.8 * Math.PI;
    } else if (pacman.direction === 'UP') {
        startAngle = 1.7 * Math.PI; // Boca abierta hacia arriba
        endAngle = 1.3 * Math.PI;
    } else if (pacman.direction === 'DOWN') {
        startAngle = 0.7 * Math.PI; // Boca abierta hacia abajo
        endAngle = 0.3 * Math.PI;
    } else { // Estado IDLE o dirección no definida
        startAngle = 0.2 * Math.PI; // Por defecto hacia la derecha
        endAngle = 1.8 * Math.PI;
    }

    // Dibujar a Pac-Man
    ctx.fillStyle = pacman.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pacman.size, startAngle, endAngle);
    ctx.lineTo(centerX, centerY); // Centro del círculo
    ctx.closePath();
    ctx.fill();
}


let lastMoveTime = 0; // Tiempo del último movimiento
const moveInterval = 250; // Intervalo entre movimientos en milisegundos

function eatPoint() {
    if (map[pacman.y][pacman.x] === 2) {
        score += 10; // Incrementar puntuación
        map[pacman.y][pacman.x] = 0; // Eliminar el punto del mapa
    }
}

function movePacman(timestamp) {
    let newX = pacman.x;
    let newY = pacman.y;

    if (timestamp - lastMoveTime >= moveInterval) {
        if (pacman.direction === 'RIGHT') newX++;
        if (pacman.direction === 'LEFT') newX--;
        if (pacman.direction === 'UP') newY--;
        if (pacman.direction === 'DOWN') newY++;
    
        if (map[newY] && map[newY][newX] !== 1) {
            pacman.x = newX;
            pacman.y = newY;
            eatPoint(); // Verificar si come un punto
        } 

        lastMoveTime = timestamp;
    }

    
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') pacman.direction = 'UP';
    if (e.key === 'ArrowDown') pacman.direction = 'DOWN';
    if (e.key === 'ArrowLeft') pacman.direction = 'LEFT';
    if (e.key === 'ArrowRight') pacman.direction = 'RIGHT';
});

function detectCollision() {
    if (map[pacman.y][pacman.x] === 2) {
        map[pacman.y][pacman.x] = 0;
    }
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    movePacman(timestamp);
    detectCollision();
    drawPacman();
    drawGhosts();
    requestAnimationFrame(gameLoop);
    drawScore();
}


gameLoop();