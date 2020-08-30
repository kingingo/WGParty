// grab a reference of our "canvas" using its id
const canvas_id = "pingpong_cs";
const canvas = document.getElementById(canvas_id);
/* get a "context". Without "context", we can't draw on canvas */
const ctx = canvas.getContext('2d');

// some sounds
const hitSound = new Audio('sounds/hitSound.wav');
const scoreSound = new Audio('sounds/scoreSound.wav');
const wallHitSound = new Audio('sounds/wallHitSound.wav');

/* some extra variables */
const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

/* some extra variables ends */

/* objects */
// net
const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#fff"
};

// user paddle
const user1 = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0
};

const user2 = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0
};

// ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: '#05EDFF'
};

/* objects declaration ends */

/* drawing functions */
// function to draw net
function drawNet() {
  // set the color of net
  ctx.fillStyle = net.color;

  // syntax --> fillRect(x, y, width, height)
  ctx.fillRect(net.x, net.y, net.width, net.height);
}

//function to draw score
function drawScore() {
  ctx.fillStyle = '#521b29';
  ctx.font = '35px sans-serif';
  let width = ctx.measureText(user1.score+":"+user2.score).width;
  // syntax --> fillText(text, x, y)
  ctx.fillText(user1.score+":"+user2.score, canvas.width/2-width/2, canvas.height/11);
}

// function to draw text
function drawText(x, y, txt) {
  ctx.fillStyle = '#fff';
  ctx.font = '35px sans-serif';

  // syntax --> fillText(text, x, y)
  ctx.fillText(txt, x, y);
}

// function to draw paddle
function drawPaddle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// function to draw ball
function drawBall(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  // syntax --> arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
  ctx.arc(x, y, radius, 0, Math.PI * 2, true); // π * 2 Radians = 360 degrees
  ctx.closePath();
  ctx.fill();
}

/* drawing functions end */

/* moving Paddles */
// add an eventListener 
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);
canvas.addEventListener('touchmove', touchMoveHandler);
canvas.addEventListener('touchend', touchHandler);
canvas.addEventListener('touchstart', touchHandler);

//gets activated when we press down a key
function keyDownHandler(event) {
// get the keyCode
switch (event.keyCode) {
 // "up arrow" key
 case 38:
   // set upArrowPressed = true
   upArrowPressed = true;
   break;
 // "down arrow" key
 case 40:
   downArrowPressed = true;
   break;
}
}

//gets activated when we release the key
function keyUpHandler(event) {
switch (event.keyCode) {
 // "up arraow" key
 case 38:
   upArrowPressed = false;
   break;
 // "down arrow" key
 case 40:
   downArrowPressed = false;
   break;
}
}
function touchHandler(e){
	event.preventDefault();
}

function touchMoveHandler(e){
	event.preventDefault();
	var pos = getTouchPos(e);
	
	if(pos.y >= 0 && (pos.y < canvas.height - user1.height)){
		user1.y = pos.y;
	}
}

function getTouchPos(ev) {
	  var rect = canvas.getBoundingClientRect();
	  
	  return {
	    x: ev.targetTouches[0].clientX - rect.left,
	    y: ev.targetTouches[0].clientY - rect.top
	  };
}

/* moving paddles section end */

// reset the ball
function reset() {
  // reset ball's value to older values
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;

  // changes the direction of ball
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

// collision Detect function
function collisionDetect(player, ball) {
  // returns true or false
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

// update function, to update things position
function update() {
	if (upArrowPressed && user1.y > 0) {
		user1.y -= 8;
	} else if (downArrowPressed && (user1.y < canvas.height - user1.height)) {
		user1.y += 8;
	}
	
  // check if ball hits top or bottom wall
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    // play wallHitSound
//    wallHitSound.play();
    ball.velocityY = -ball.velocityY;
  }

   // if ball hit on right wall
   if (ball.x + ball.radius >= canvas.width) {
    // play scoreSound
//    scoreSound.play();
    // then user scored 1 point
    user1.score += 1;
    reset();
  }

  // if ball hit on left wall
  if (ball.x - ball.radius <= 0) {
    // play scoreSound
//    scoreSound.play();
    // then ai scored 1 point
    user2.score += 1;
    reset();
  }

  // move the ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // ai paddle movement
//  ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;

  // collision detection on paddles
  let player = (ball.x < canvas.width / 2) ? user1 : user2;

  if (collisionDetect(player, ball)) {
    // play hitSound
//    hitSound.play();
    // default angle is 0deg in Radian
    let angle = 0;

    // if ball hit the top of paddle
    if (ball.y < (player.y + player.height / 2)) {
      // then -1 * Math.PI / 4 = -45deg
      angle = -1 * Math.PI / 4;
    } else if (ball.y > (player.y + player.height / 2)) {
      // if it hit the bottom of paddle
      // then angle will be Math.PI / 4 = 45deg
      angle = Math.PI / 4;
    }

    /* change velocity of ball according to on which paddle the ball hitted */
    ball.velocityX = (player === user1 ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);

    // increase ball speed
    ball.speed += 0.2;
  }
}

// render function draws everything on to canvas
function render() {
  // set a style
  ctx.fillStyle = "#000"; /* whatever comes below this acquires black color (#000). */
  // draws the black board
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw net
  drawNet();
  

  // draw user score
  drawText(canvas.width / 6, canvas.height / 11, "User1");
  // draw ai score
  drawText(4 * canvas.width / 6, canvas.height / 11, "User2");
  drawScore();
//  // draw user score
//  drawScore(canvas.width / 4, canvas.height / 6, user1.score);
//  // draw ai score
//  drawScore(3 * canvas.width / 4, canvas.height / 6, user2.score);
  // draw user paddle
  drawPaddle(user1.x, user1.y, user1.width, user1.height, user1.color);
  // draw ai paddle
  drawPaddle(user2.x, user2.y, user2.width, user2.height, user2.color);
  // draw ball
  drawBall(ball.x, ball.y, ball.radius, ball.color);
}

// gameLoop
function gameLoop() {
  // update() function here
  update();
  // render() function here
  render();
}

// calls gameLoop() function 60 times per second
setInterval(gameLoop, 1000 / 60);