// Initialize canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = document.getElementById("smileyFace");

let startButton = document.getElementById("start-btn");
let pauseButton = document.getElementById("pause-btn");
let restartButton = document.getElementById("restart-btn");
let animationId;
let gameRunning = false;


startButton.addEventListener("click", function() {
  if (!gameRunning) { 
    gameRunning = true; 
    loop();
  }
});

pauseButton.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartButton.addEventListener("click", function() {
  document.location.reload();
});

addEventListener("load", (event) => {
  draw();
});


let ballRadius = 7;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let counter = 1;


let paddleHeight = 70;
let paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let paddleSpeed = 10;


let leftPlayerScore = 0;
let rightPlayerScore = 0;
let maxScore = 20;


document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);


let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;


//#region Functions
function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}


function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}


function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;


  if (upPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (downPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  //AI
  if (ballY > rightPaddleY + paddleHeight / 2) {
    rightPaddleY += paddleSpeed;
  } else if (ballY < rightPaddleY + paddleHeight / 2) {
    rightPaddleY -= paddleSpeed;
  }

  

  // Check if ball collides with top or bottom of canvas
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Check if ball collides with left paddle
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    
    ballSpeedX = -ballSpeedX;
    counter += 1;
    
    if (counter%5 === 0){
      ballSpeedX++;
    }
  }

  // Check if ball collides with right paddle
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    
    ballSpeedX = -ballSpeedX;
    counter += 1;
    
    if (counter%5 === 0){
      ballSpeedX--;
    }
  }

   
  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  
  if (leftPlayerScore === maxScore) {
    playerWin("User");
  } else if (rightPlayerScore === maxScore) {
    playerWin("AI");
  }
}

function playerWin(player) {
  let message = player + " wins!";
  ctx.font="30px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(message,canvas.width / 2,canvas.height / 2); 
  $('#message-modal').modal('show');  
}


function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  counter = 1;
  ballSpeedX = 5;
  reaction = 80;
}


function draw() {
   
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF0000";
  ctx.font = "30px Comic Sans MS";

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF0000";
  ctx.stroke();
  ctx.closePath();


  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  
  ctx.fillText("User: " + leftPlayerScore, 10, 30);
  ctx.fillText("CPU: " + rightPlayerScore, canvas.width - 118, 30);
}

// Game loop
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}
//#endregion


$('#message-modal-close').on('click', function() {
  document.location.reload();
});