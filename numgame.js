const min = 1;
const max = 100;
const maxAttempts = 9;

let answer =
  Math.floor(Math.random() * (max - min + 1)) + min;

let attempts = 0;

let closestLower = null;
let closestHigher = null;

const guessInput =
  document.getElementById("guessInput");

const checkBtn =
  document.getElementById("checkBtn");

const message =
  document.getElementById("message");

const attemptsText =
  document.getElementById("attempts");

const leftText =
  document.getElementById("left");

const lowerGuessText =
  document.getElementById("lowerGuess");

const higherGuessText =
  document.getElementById("higherGuess");

const restartBtn =
  document.getElementById("restartBtn");

checkBtn.addEventListener("click", checkGuess);

guessInput.addEventListener("keydown", function(e){

  if(e.key === "Enter"){
    checkGuess();
  }

});

restartBtn.addEventListener("click", restartGame);

function checkGuess(){

  let guess = Number(guessInput.value);

  if(!guess){

    showMessage("Enter a valid number", "error");

    playSound(200);

    return;
  }

  if(guess < min || guess > max){

    showMessage("Number out of range", "error");

    playSound(250);

    return;
  }

  attempts++;

  let attemptsLeft =
    maxAttempts - attempts;

  attemptsText.innerText = attempts;

  leftText.innerText = attemptsLeft;

  updateWarning(attemptsLeft);

  if(guess < answer){

    if(
      closestLower === null ||
      guess > closestLower
    ){
      closestLower = guess;
    }

    lowerGuessText.innerText =
      closestLower;

    showMessage(
      "Too low",
      "hint"
    );

    playSound(350);

  }
  else if(guess > answer){

    if(
      closestHigher === null ||
      guess < closestHigher
    ){
      closestHigher = guess;
    }

    higherGuessText.innerText =
      closestHigher;

    showMessage(
      "Too high",
      "hint"
    );

    playSound(500);

  }
  else{

    showMessage(
      `Correct! Number was ${answer}`,
      "success"
    );

    playSound(800);

    endGame();

    return;
  }

  if(attempts >= maxAttempts){

    showMessage(
      `Game Over! Number was ${answer}`,
      "error"
    );

    playSound(150);

    endGame();
  }

  guessInput.value = "";
}

function updateWarning(left){

  leftText.classList.remove("warning");

  if(left <= 3){

    leftText.classList.add("warning");
  }
}

function showMessage(text, type){

  message.innerText = text;

  message.className =
    `message ${type}`;
}

function endGame(){

  checkBtn.disabled = true;

  guessInput.disabled = true;

  restartBtn.style.display = "block";
}

function restartGame(){

  answer =
    Math.floor(Math.random() * (max - min + 1)) + min;

  attempts = 0;

  closestLower = null;
  closestHigher = null;

  attemptsText.innerText = 0;

  leftText.innerText = maxAttempts;

  leftText.classList.remove("warning");

  lowerGuessText.innerText = "-";

  higherGuessText.innerText = "-";

  message.innerText = "";

  guessInput.disabled = false;

  checkBtn.disabled = false;

  restartBtn.style.display = "none";

  guessInput.value = "";
}

function playSound(freq){

  const audio =
    new (window.AudioContext ||
    window.webkitAudioContext)();

  const osc = audio.createOscillator();

  const gain = audio.createGain();

  osc.connect(gain);

  gain.connect(audio.destination);

  osc.frequency.value = freq;

  osc.type = "sine";

  osc.start();

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + 0.3
  );

  osc.stop(audio.currentTime + 0.3);
}