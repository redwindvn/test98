const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    size: 20
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let score = 0;

function createPipe() {
    const gapPosition = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        gapY: gapPosition,
        passed: false
    });
}

function handleClick() {
    bird.velocity = bird.jump;
}

function gameLoop() {
    // Update bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Create pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        // Score counting
        if (!pipes[i].passed && pipes[i].x < bird.x) {
            score++;
            pipes[i].passed = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }

        // Collision detection
        if (bird.x + bird.size > pipes[i].x && 
            bird.x < pipes[i].x + pipeWidth && 
            (bird.y < pipes[i].gapY || 
             bird.y + bird.size > pipes[i].gapY + pipeGap)) {
            resetGame();
        }
    }

    // Floor/ceiling collision
    if (bird.y + bird.size > canvas.height || bird.y < 0) {
        resetGame();
    }

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
        ctx.fillRect(pipe.x, pipe.gapY + pipeGap, pipeWidth, canvas.height);
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
}

// Event listeners
canvas.addEventListener('click', handleClick);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleClick();
});

// Start the game
gameLoop(); 