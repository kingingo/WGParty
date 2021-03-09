loadScript("games/pingpong/packets.js");

// some sounds
const hitSound = new Audio('games/pingpong/sounds/hitSound.wav');
const scoreSound = new Audio('games/pingpong/sounds/scoreSound.wav');
const wallHitSound = new Audio('games/pingpong/sounds/wallHitSound.wav');

/* some extra variables */
const netWidth = 4;

const paddleWidth = 10;
const paddleHeight = 100;
/* some extra variables ends */

const canvas_id = "pingpong_cs";

class PingPong extends Game{
	
	constructor(spectate, callbackStart, callbackEnd){
		super("PingPong",spectate, callbackStart,callbackEnd);
		this.upArrowPressed = false;
		this.downArrowPressed = false;
	}
	
	end(){
		super.end();
		clearInterval(this.interval);
		
		if(!this.spectate){
			this.canvas.removeEventListener('touchmove', this.touchMoveHandler);
			this.canvas.removeEventListener('touchend', this.touchHandler);
			this.canvas.removeEventListener('touchstart', this.touchHandler);
		}
	}
	
	start(containerId){
		super.start(containerId);
		$.get("games/pingpong/index.php", function (tthis, data) {
			$("#"+containerId).append(data);
			// grab a reference of our "canvas" using its id
			tthis.canvas = document.getElementById(canvas_id);
			/* get a "context". Without "context", we can't draw on canvas */
			tthis.ctx = tthis.canvas.getContext('2d');
			// calls gameLoop() function 60 times per second
			tthis.interval = setInterval(tthis.gameLoop.bind(null,tthis), 1000 / 60);
			tthis.lastY = -1;
			tthis.net = {
			  x: tthis.canvas.width / 2 - netWidth / 2,
			  y: 0,
			  width: netWidth,
			  height: tthis.canvas.height,
			  color: "#FFF"
			};

			// user paddle
			tthis.user1 = {
			  x: 10,
			  y: tthis.canvas.height / 2 - paddleHeight / 2,
			  width: paddleWidth,
			  height: paddleHeight,
			  color: '#FFF',
			  uuid: getUUID1(),
			  score: 0
			};
			console.log("UUID1: "+tthis.user1.uuid);

			tthis.user2 = {
			  x: tthis.canvas.width - (paddleWidth + 10),
			  y: tthis.canvas.height / 2 - paddleHeight / 2,
			  width: paddleWidth,
			  height: paddleHeight,
			  color: '#FFF',
			  uuid: getUUID2(),
			  score: 0
			};
			console.log("UUID2: "+tthis.user2.uuid);

			// ball
			tthis.ball = {
			  x: tthis.canvas.width / 2,
			  y: tthis.canvas.height / 2,
			  radius: 7,
			  speed: 7,
			  velocityX: 5,
			  velocityY: 5,
			  color: '#05EDFF'
			};
			
			if(!tthis.spectate){
				tthis.canvas.addEventListener('touchmove', tthis.touchMoveHandler.bind(null,tthis));
				tthis.canvas.addEventListener('touchend', tthis.touchHandler);
				tthis.canvas.addEventListener('touchstart', tthis.touchHandler);
				window.addEventListener('keydown', tthis.keyDownHandler.bind(null,tthis));
				window.addEventListener('keyup', tthis.keyUpHandler.bind(null,tthis));
				
				if(tthis.user1.uuid == getUUID()){
					tthis.user = tthis.user1;
				}else if(tthis.user2.uuid == getUUID()){
					tthis.user = tthis.user2;
				}
				console.log("SET USER : "+tthis.user.uuid);
			}
		}.bind(null,this));
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			  case PINGPONGUSER:
				  var packet = new PingPongUserPacket();
				  packet.parseFromInput(buffer);
				 	  
				  if(this.spectate){
					  if(packet.uuid == this.user2.uuid){
						  this.user2.y = packet.y;
					  }else if(packet.uuid == this.user1.uuid){
						  this.user1.y = packet.y;
					  }else this.log("PingPongUserPacket | uuid: "+packet.uuid+" != "+this.user2.uuid);
				  }else{
					  if(packet.uuid == this.user2.uuid){
						  this.user2.y = packet.y;
					  }else if(packet.uuid == this.user1.uuid){
						  this.user1.y = packet.y;
					  }else this.log("PingPongUserPacket | uuid: "+packet.uuid+" != "+this.user2.uuid);
				  }
				  break;
			  default:
				  this.log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
	
	moveBall(x,y){
		this.ball.x = x;
		this.ball.y = y;
	}
	
	//gets activated when we press down a key
	keyDownHandler(tthis,event) {
	// get the keyCode
	switch (event.keyCode) {
	 // "up arrow" key
	 case 38:
	   // set upArrowPressed = true
		 tthis.upArrowPressed = true;
	   break;
	 // "down arrow" key
	 case 40:
		 tthis.downArrowPressed = true;
	   break;
	}
	}

	//gets activated when we release the key
	keyUpHandler(tthis,event) {
	switch (event.keyCode) {
	 // "up arraow" key
	 case 38:
		 tthis.upArrowPressed = false;
	   break;
	 // "down arrow" key
	 case 40:
		 tthis.downArrowPressed = false;
	   break;
	}
	}
	
	//cancels touch events
	touchHandler(e){
		e.preventDefault();
	}

	//cancels touch events & move user1
	touchMoveHandler(tthis, e){
		event.preventDefault();
		var pos = tthis.getTouchPos(e);
		
		if(pos.y >= 0 && (pos.y < tthis.canvas.height - tthis.user.height)){
			tthis.user.y = pos.y;
		}
	}

	//get position of the touch
	getTouchPos(ev) {
		  var rect = this.canvas.getBoundingClientRect();
		  
		  return {
		    x: ev.targetTouches[0].clientX - rect.left,
		    y: ev.targetTouches[0].clientY - rect.top
		  };
	}

	/* moving paddles section end */

	// reset the ball
	reset() {
	  // reset ball's value to older values
	  this.ball.x = this.canvas.width / 2;
	  this.ball.y = this.canvas.height / 2;
	  this.ball.speed = 7;

	  // changes the direction of this.ball
	  this.ball.velocityX = -this.ball.velocityX;
	  this.ball.velocityY = -this.ball.velocityY;
	}

	// collision Detect function
	collisionDetect(player, ball) {
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
	update() {
	  if(!this.spectate){
		  if (this.upArrowPressed && this.user.y > 0) {
				this.user.y -= 8;
			} else if (this.downArrowPressed && (this.user.y < this.canvas.height - this.user.height)) {
				this.user.y += 8;
			}
	  }
	  // check if ball hits top or bottom wall
	  if (this.ball.y + this.ball.radius >= this.canvas.height || this.ball.y - this.ball.radius <= 0) {
	    // play wallHitSound
//	    wallHitSound.play();
	    this.ball.velocityY = -this.ball.velocityY;
	  }

	   // if this.ball hit on right wall
	   if (this.ball.x + this.ball.radius >= this.canvas.width) {
	    // play scoreSound
//	    scoreSound.play();
	    // then user scored 1 point
		this.user1.score += 1;
		if(!this.spectate){
			write(new PingPongGoalPacket(this.user1.uuid,this.user1.score));
		}
			
		this.reset();
	  }

	  // if this.ball hit on left wall
	  if (this.ball.x - this.ball.radius <= 0) {
	    // play scoreSound
//	    scoreSound.play();
	    // then ai scored 1 point
		this.user2.score += 1;
		if(!this.spectate){
			write(new PingPongGoalPacket(this.user2.uuid,this.user2.score));
		}
			
	    this.reset();
	  }

	  // move the this.ball
	  this.ball.x += this.ball.velocityX;
	  this.ball.y += this.ball.velocityY;

	  // ai paddle movement
	//  ai.y += ((this.ball.y - (ai.y + ai.height / 2))) * 0.09;

	  // collision detection on paddles
	  let player = (this.ball.x < this.canvas.width / 2) ? this.user1 : this.user2;

	  if (this.collisionDetect(player, this.ball)) {
	    // play hitSound
//	    hitSound.play();
	    // default angle is 0deg in Radian
	    let angle = 0;

	    // if this.ball hit the top of paddle
	    if (this.ball.y < (player.y + player.height / 2)) {
	      // then -1 * Math.PI / 4 = -45deg
	      angle = -1 * Math.PI / 4;
	    } else if (this.ball.y > (player.y + player.height / 2)) {
	      // if it hit the bottom of paddle
	      // then angle will be Math.PI / 4 = 45deg
	      angle = Math.PI / 4;
	    }

	    /* change velocity of this.ball according to on which paddle the this.ball hitted */
	    this.ball.velocityX = (player === this.user1 ? 1 : -1) * this.ball.speed * Math.cos(angle);
	    this.ball.velocityY = this.ball.speed * Math.sin(angle);

	    // increase this.ball speed
	    this.ball.speed += 0.2;
	  }
	}

	// render draws everything on to canvas
	render() {
	  // set a style
	  this.ctx.fillStyle = "#000"; /* whatever comes below this acquires black color (#000). */
	  // draws the black board
	  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	  // draw net
	  this.drawNet();
	  // draw scores
	  this.drawScores();
	  // draw user1 name
	  this.drawText(this.canvas.width / 6, this.canvas.height / 11, getName1());
	  // draw user2 name
	  this.drawText(4 * this.canvas.width / 6, this.canvas.height / 11, getName2());
	  // draw user1 paddle
	  this.drawPaddle(this.user1.x, this.user1.y, this.user1.width, this.user1.height, this.user1.color);
	  // draw user2 paddle
	  this.drawPaddle(this.user2.x, this.user2.y, this.user2.width, this.user2.height, this.user2.color);
	  // draw this.ball
	  this.drawBall(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);
	}
	
	drawScores() {
		this.ctx.fillStyle = '#521b29';
		this.ctx.font = '35px sans-serif';
		let width = this.ctx.measureText(this.user1.score+":"+this.user2.score).width;
		// syntax --> fillText(text, x, y)
		this.ctx.fillText(this.user1.score+":"+this.user2.score, (this.canvas.width-width)/2, this.canvas.height/11);
	}

	// gameLoop
	gameLoop(tthis) {
	  // update() here
		tthis.update();
	  
	  //send coordinates
	  if(!tthis.spectate){
		  if(tthis.lastY != tthis.user.y){
			  tthis.lastY = tthis.user.y;
			  write(new PingPongUserPacket(getUUID(),tthis.lastY));
		  }
	  }
	  // render() here
	  tthis.render();
	}
	
	/* drawing functions */
	// to draw net
	drawNet() {
	  // set the color of net
	  this.ctx.fillStyle = this.net.color;

	  // syntax --> fillRect(x, y, width, height)
	  this.ctx.fillRect(this.net.x, this.net.y, this.net.width, this.net.height);
	}
	
	// to draw txt
	drawText(x, y, txt, color = '#fff') {
	  this.ctx.fillStyle = color;
	  this.ctx.font = '35px sans-serif';

	  // syntax --> fillText(text, x, y)
	  this.ctx.fillText(txt, x, y);
	}

	// to draw paddle
	drawPaddle(x, y, width, height, color) {
	  this.ctx.fillStyle = color;
	  this.ctx.fillRect(x, y, width, height);
	}

	// to draw ball
	drawBall(x, y, radius, color) {
	  this.ctx.fillStyle = color;
	  this.ctx.beginPath();
	  // syntax --> arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
	  this.ctx.arc(x, y, radius, 0, Math.PI * 2, true); // π * 2 Radians = 360 degrees
	  this.ctx.closePath();
	  this.ctx.fill();
	}
}