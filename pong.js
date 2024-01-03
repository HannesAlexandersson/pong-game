var totalWidth = 800;
var totalHeight = 600;
var player1 = { x: 10, y: 200 };
var player2 = { x: totalWidth - 20, y: 200 };

var ball = { 
x: totalWidth / 2 - 5, 
y: totalHeight / 2 - 5, 
xSpeed: 3, 
ySpeed: 3 
};
var maxBallSpeed = 8;

var pointsPlayer1 = 0;
var pointsPlayer2 = 0;

var paddleHitSound = document.getElementById("paddleHitSound");
var scoreSound = document.getElementById("scoreSound");


// Handle keyboard input using keydown and keyup events
var keys = {};
window.addEventListener('keydown', function (e) {
  keys[e.key] = true;
});

window.addEventListener('keyup', function (e) {
  keys[e.key] = false;
});

function handleInput() {
  // Adjust paddle speed 
  var paddleSpeed = 5;

  if (keys['w'] && player1.y - paddleSpeed >= 0) player1.y -= paddleSpeed;
  if (keys['s'] && player1.y + paddleSpeed <= totalHeight - 80) player1.y += paddleSpeed;
  if (keys['ArrowUp'] && player2.y - paddleSpeed >= 0) player2.y -= paddleSpeed;
  if (keys['ArrowDown'] && player2.y + paddleSpeed <= totalHeight - 80) player2.y += paddleSpeed;

  // Adjust ball position if it gets stuck 
  if (
    ball.x < 20 &&
    ball.y > player1.y - 10 &&
    ball.y < player1.y + 80
  ) {
    ball.x = 20;
  }

  if (
    ball.x > totalWidth - 30 &&
    ball.y > player2.y - 10 &&
    ball.y < player2.y + 80
  ) {
    ball.x = totalWidth - 30;
  }
}

function update() {
  // create the gameboard
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  
  handleInput();

  // Replace Fill with fillRect
  function fillRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  // Create paddles and ball
  fillRect(player1.x, player1.y, 10, 80, "white");
  fillRect(player2.x, player2.y, 10, 80, "white");
  fillRect(ball.x, ball.y, 10, 10, "white");

  // Update ball position
  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;

  // Handle ball collisions with walls
  if (ball.y < 0 || ball.y > totalHeight - 10) {
    ball.ySpeed = -ball.ySpeed;
  }

  // Handle ball collisions with paddles
  if (
    ball.x < 20 &&
    ball.y > player1.y - 10 &&
    ball.y < player1.y + 80
  ) {
    ball.xSpeed = -ball.xSpeed * 1.1;
    ball.xSpeed = Math.abs(ball.xSpeed);// Make sure the ball moves to the right, so it is not always starts from the same direction
    paddleHitSound.play(); // Play the paddle hit sound
    // Limit the ball speed
    ball.xSpeed = Math.min(ball.xSpeed, maxBallSpeed);
  } else if (ball.x < 0) {
    // Player 2 scores a point only if the ball goes out without hitting the paddle
    if (ball.y < player2.y || ball.y > player2.y + 80) {
      pointsPlayer2++;
      updateScore();
      scoreSound.play(); // Play the score sound
    }
    // Reset ball position if it goes out of bounds    
    resetBall();
  }

  if (
    ball.x > totalWidth - 30 &&
    ball.y > player2.y - 10 &&
    ball.y < player2.y + 80
  ) {
    ball.xSpeed = -ball.xSpeed * 1.1;
    ball.xSpeed = -Math.abs(ball.xSpeed); // Make sure the ball moves to the left, so it is not always starts from the same direction
    paddleHitSound.play(); // Play the paddle hit sound
    // Limit the ball speed
    ball.xSpeed = Math.min(ball.xSpeed, maxBallSpeed);
  } else if (ball.x > totalWidth) {
    // Player 1 scores a point only if the ball goes out without hitting the paddle
    if (ball.y < player1.y || ball.y > player1.y + 80) {
      pointsPlayer1++;
      updateScore();
      scoreSound.play(); // Play the score sound
    }
    // Reset ball position if it goes out of bounds    
    resetBall();
  }

  // Call the update function repeatedly
  requestAnimationFrame(update);
}
function resetBall() {
  ball.x = totalWidth / 2 - 5;
  ball.y = totalHeight / 2 - 5;
  /* ball.xSpeed = 3; */
  ball.xSpeed = Math.random() > 0.5 ? 3 : -3; // Randomly choose initial direction, so its not always the same player who starts
  ball.ySpeed = 3;
}
function updateScore() {
  // Update the HTML elements displaying the scores
  document.getElementById('scorePlayer1').textContent = pointsPlayer1;
  document.getElementById('scorePlayer2').textContent = pointsPlayer2;
}

function resetMatch() {
  // Reset the scores and update the display
  pointsPlayer1 = 0;
  pointsPlayer2 = 0;
  updateScore();

  // Reset the ball
  resetBall();
}
// Get the canvas context
var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");

// Call the update function to start the game loop
update();