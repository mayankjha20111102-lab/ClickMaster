let score = 0;
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    console.log("Game Started! Score: " + score);
});


        
      
