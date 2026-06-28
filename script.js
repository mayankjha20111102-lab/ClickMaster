const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startScreen = document.getElementById("start-screen");

// Canvas size responsiveness
canvas.width = 400;
canvas.height = 600;

let bird, pipes, frameCount, score, gameLoopId, isPlaying = false;

// Physics settings
const GRAVITY = 0.25;
const FLAP_STRENGTH = -5.5;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 100;
const PIPE_GAP = 130;

function resetGame() {
    bird = { x: 50, y: 250, radius: 12, velocity: 0 };
    pipes = [];
    frameCount = 0;
    score = 0;
    scoreEl.innerText = score;
}

function startGame() {
    startScreen.style.display = "none";
    resetGame();
    isPlaying = true;
    gameLoop();
}

function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(gameLoopId);
    startScreen.querySelector("h1").innerText = "GAME OVER";
    startScreen.querySelector("p").innerText = `Final Score: ${score}`;
    startScreen.style.display = "flex";
}

// Controls
function jump() {
    if (isPlaying) {
        bird.velocity = FLAP_STRENGTH;
    }
}
window.addEventListener("keydown", (e) => { if (e.code === "Space") jump(); });
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); jump(); });
canvas.addEventListener("mousedown", jump);

function gameLoop() {
    if (!isPlaying) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // --- BIRD LOGIC ---
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Draw Neon Bird
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff007f";
    ctx.fillStyle = "#ff007f";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow

    // Floor and Ceiling collision
    if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        gameOver();
        return;
    }

    // --- PIPE LOGIC ---
    if (frameCount % PIPE_SPAWN_RATE === 0) {
        let minHeight = 50;
        let maxHeight = canvas.height - PIPE_GAP - 50;
        let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        pipes.push({ x: canvas.width, top: topHeight, passed: false });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;

        // Draw Neon Pipes
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffcc";
        ctx.fillStyle = "#00ffcc";
        
        // Top pipe
        ctx.fillRect(pipes[i].x, 0, 50, pipes[i].top);
        // Bottom pipe
        ctx.fillRect(pipes[i].x, pipes[i].top + PIPE_GAP, 50, canvas.height - (pipes[i].top + PIPE_GAP));
        ctx.shadowBlur = 0; // reset

        // Collision detection
        if (
            bird.x + bird.radius > pipes[i].x &&
            bird.x - bird.radius < pipes[i].x + 50 &&
            (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > pipes[i].top + PIPE_GAP)
        ) {
            gameOver();
            return;
        }

        // Score tracker
        if (!pipes[i].passed && pipes[i].x + 50 < bird.x) {
            pipes[i].passed = true;
            score++;
            scoreEl.innerText = score;
        }

        // Remove offscreen pipes
        if (pipes[i].x + 50 < 0) {
            pipes.splice(i, 1);
        }
    }

    gameLoopId = requestAnimationFrame(gameLoop);
      }
      
