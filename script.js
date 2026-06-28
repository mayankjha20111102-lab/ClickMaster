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

    // Draw Cute Cartoon Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    
    // Bird ki rotation (velocity ke hisab se upar/niche mude)
    let rotation = Math.min(Math.PI / 6, Math.max(-Math.PI / 12, bird.velocity * 0.05));
    ctx.rotate(rotation);

    // 1. Main Body (Pink Neon Circle)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff007f";
    ctx.fillStyle = "#ff007f";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Shadow reset

    // 2. Bird's Eye (Aankh)
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(4, -4, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000"; // Pupil
    ctx.beginPath();
    ctx.arc(5, -4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Bird's Beak (Chounch - Orange triangle)
    ctx.fillStyle = "#ffaa00";
    ctx.beginPath();
    ctx.moveTo(bird.radius - 2, -2);
    ctx.lineTo(bird.radius + 6, 1);
    ctx.lineTo(bird.radius - 2, 4);
    ctx.closePath();
    ctx.fill();

    // 4. Bird's Wing (Pankh - Chhota circle jo flap karega)
    ctx.fillStyle = "#ff55aa";
    ctx.beginPath();
    let wingWave = bird.velocity < 0 ? -3 : 2; 
    ctx.arc(-5, wingWave, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

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
        ctx.shadow
        
      
