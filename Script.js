let score = 0;
let cps = 0;
let power = 1;

let autoCost = 50;
let powerCost = 200;

// click
function clickMe() {
  score += power;
  update();
}

// auto income
setInterval(() => {
  score += cps;
  update();
}, 1000);

// buy auto click
function buyAuto() {
  if (score >= autoCost) {
    score -= autoCost;
    cps += 1;
    autoCost += 50;
    update();
  }
}

// buy power
function buyPower() {
  if (score >= powerCost) {
    score -= powerCost;
    power *= 2;
    powerCost *= 2;
    update();
  }
}

// update UI
function update() {
  document.getElementById("score").innerText = score;
  document.getElementById("cps").innerText = cps;
}
