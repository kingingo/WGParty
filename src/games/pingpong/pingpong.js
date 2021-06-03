loadScript("games/pingpong/packets.js");

// some sounds

/* some extra variables */
const netWidth = 4;
const intervall_per_second = 30;
const start_text = "Start in";
const wait_text = "Warte auf alle Spieler";
const winner_text = "%s WON!";
const dawn_text = "UNENTSCHIEDEN";
/* some extra variables ends */

const canvas_id = "pingpong_cs";

class PingPong extends Game{
	
	constructor(spectate, callbackStart, callbackEnd){
		super("PingPong",spectate, callbackStart,callbackEnd);
		this.upArrowPressed = false;
		this.downArrowPressed = false;
		this.settings_received=false;
	}
	
	end(){
		super.end();
		clearInterval(this.interval);
		this.settings_received=false;
		
		this.canvas.removeEventListener('touchmove', this.touchMoveHandler);
		this.canvas.removeEventListener('touchend', this.touchHandler);
		this.canvas.removeEventListener('touchstart', this.touchHandler);
	}
	
	start(containerId){
		super.start(containerId);
		this.settings_received=false;
		
		$.get("games/pingpong/index.php", function (tthis, data) {
			$("#"+containerId).append(data);
			// grab a reference of our "canvas" using its id
			tthis.canvas = document.getElementById(canvas_id);
			/* get a "context". Without "context", we can't draw on canvas */
			tthis.ctx = tthis.canvas.getContext('2d');
			tthis.uuid = getUUID();
			tthis.net = {
			  y: 0,
			  width: netWidth,
			  color: "#FFF"
			};

			tthis.users = [
				{
				  color: '#FFF',
				  uuid: getUUID1(),
				  name: getName1(),
				  score: 0,
				  uid: 1
				},
				{
				  color: '#FFF',
				  uuid: getUUID2(),
				  name: getName2(),
				  score: 0,
				  uid: 2
				}
			];

			// ball
			tthis.ball = {
			  color: '#05EDFF'
			};
			
			if(!tthis.spectate){
				tthis.canvas.addEventListener('touchmove', tthis.touchMoveHandler.bind(null,tthis));
				tthis.canvas.addEventListener('touchend', tthis.touchHandler);
				tthis.canvas.addEventListener('touchstart', tthis.touchHandler);
				window.addEventListener('keydown', tthis.keyDownHandler.bind(null,tthis));
				window.addEventListener('keyup', tthis.keyUpHandler.bind(null,tthis));
				
				if(tthis.users[0].uuid == getUUID()){
					tthis.user = tthis.users[0];
				}else if(tthis.users[1].uuid == getUUID()){
					tthis.user = tthis.users[1];
				}
			}

			tthis.callbackStart();
		}.bind(null,this));
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			 	case PINGPONGBALL:
			 		var packet = new PingPongBallPacket();
					packet.parseFromInput(buffer,true);
					
					this.ball.x = packet.x;
					this.ball.y = packet.y;
				break;
			 	case PINGPONGSTART:
			 		var packet = new PingPongStartPacket();
					packet.parseFromInput(buffer);
					
					this.start = packet.start;
				break;
			 	case PINGPONGPLAYER:
			 		var packet = new PingPongPlayerPacket();
					packet.parseFromInput(buffer,true);
					
					this.users[packet.uid-1].x = packet.x;
					this.users[packet.uid-1].y = packet.y;
					console.log("new "+this.users[packet.uid-1].name+" "+this.users[packet.uid-1].y);
				break;
			 	case PINGPONGGOAL:
			 		var packet = new PingPongGoalPacket();
					packet.parseFromInput(buffer);
					console.log("GOAL!!! for uid="+packet.uid+" score:"+packet.score)
					this.users[packet.uid-1].score = packet.score;
				break;
			 	case PINGPONGSETTINGS:
			 		var packet = new PingPongSettingsPacket();
					packet.parseFromInput(buffer);

					this.users[0].x = packet.player1.x;
					this.users[0].y = packet.player1.y;
					this.users[1].x = packet.player2.x;
					this.users[1].y = packet.player2.y;

					this.ball.x = packet.ball.x;
					this.ball.y = packet.ball.y;
					this.ball.radius = packet.ball.radius;
					
					this.start = packet.start;
					this.canvas.width = packet.canvas_width;
					this.canvas.height = packet.canvas_height;
					
					for(var i = 0; i < this.users.length; i++){
						this.users[i].height = packet.paddle_height;
						this.users[i].width = packet.paddle_width;
					}
				
					this.net.x = this.canvas.width / 2 - netWidth / 2;
					this.net.height= this.canvas.height;
					
					this.settings_received = true;
					this.interval = setInterval(this.gameLoop.bind(null,this), 1000 / intervall_per_second);
				break;
			 	default:
			 		this.log("Packet "+packetId+" not found");
				break;
			 }
		 }
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

	//cancels touch events & move users[0]
	touchMoveHandler(tthis, e){
		e.preventDefault();
		var pos = tthis.getTouchPos(e);
		
		if(pos.y >= 0 && (pos.y < tthis.canvas.height - tthis.user.height)){
			tthis.user.y = Math.floor(pos.y);
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
	
	get_start_in_secs(){
		return (this.start - getCurrentTime()) / 1000;
	}
	
	is_starting(){
		return this.start <= -1 || this.start > getCurrentTime();
	}
	
	getWinner(){
		if(this.users[0].score == this.users[1].score)return null;
		
		var user;
		for(var i = 0; i < this.users.length; i++){
			if(user == undefined || user.score < this.users[i].score)
				user = this.users[i];
		}
		
		return user;
	}
	
	drawStart(){
		this.ctx.fillStyle = '#521b29';
		this.ctx.font = '35px sans-serif';
		
		if(this.start==-1){
			let width = this.ctx.measureText(wait_text).width;
			this.ctx.fillText(wait_text, (this.canvas.width-width)/2, this.canvas.height/5);
		}else if(this.start==-2){
			let winner = this.getWinner();
			let txt = (winner == null ? dawn_text : winner_text.replace("%s",winner.name));
			let width = this.ctx.measureText(txt).width;
			this.ctx.fillText(txt, (this.canvas.width-width)/2, this.canvas.height/5);
		}else{
			let width = this.ctx.measureText(start_text).width;
			this.ctx.fillText(start_text, (this.canvas.width-width)/2, this.canvas.height/5);
			
			let countdown = Math.floor(this.get_start_in_secs()).toString();
			width = this.ctx.measureText(countdown).width;
			this.ctx.fillText(countdown, (this.canvas.width-width)/2, this.canvas.height/3);
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
	  
	  if(this.is_starting()){
		  //draw Start Countdown
		  this.drawStart();
	  }
	  
	  // draw scores
	  this.drawScores();
	  // draw users[0] name
	  this.drawText(this.canvas.width / 6, this.canvas.height / 11, getName1());
	  // draw users[1] name
	  this.drawText(4 * this.canvas.width / 6, this.canvas.height / 11, getName2());
	  // draw users[0] paddle
	  this.drawPaddle(this.users[0].x, this.users[0].y, this.users[0].width, this.users[0].height, this.users[0].color);
	  // draw users[1] paddle
	  this.drawPaddle(this.users[1].x, this.users[1].y, this.users[1].width, this.users[1].height, this.users[1].color);
	  // draw this.ball
	  this.drawBall(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);
	}
	
	drawScores() {
		this.ctx.fillStyle = '#521b29';
		this.ctx.font = '35px sans-serif';
		let width = this.ctx.measureText(this.users[0].score+":"+this.users[1].score).width;
		// syntax --> fillText(text, x, y)
		this.ctx.fillText(this.users[0].score+":"+this.users[1].score, (this.canvas.width-width)/2, this.canvas.height/11);
	}

	// gameLoop
	gameLoop(tthis) {
	  if(!tthis.spectate && !tthis.is_starting()){
		  if(!window.mobile){
			  if((tthis.upArrowPressed != tthis.last_upArrowPressed 
					  || tthis.downArrowPressed != tthis.last_downArrowPressed)){
				  tthis.last_upArrowPressed  = tthis.upArrowPressed;
				  tthis.last_downArrowPressed  = tthis.downArrowPressed;
				  console.log("write PC PingPongPlayerPacket: UP:"+tthis.downArrowPressed+" DOWN:"+tthis.upArrowPressed+" x/y:"+tthis.user.x+"/"+tthis.user.y+" id:"+tthis.user.uid+" uuid:"+tthis.user.uuid)
				  write(new PingPongPlayerPacket(tthis.downArrowPressed, tthis.upArrowPressed, tthis.user.x, tthis.user.y, tthis.user.uid, tthis.user.uuid));
			  }
		  }else{
			  if(tthis.user.y != tthis.lastY){
				  tthis.lastY = tthis.user.y;
				  console.log("write MOB PingPongPlayerPacket: UP:"+tthis.downArrowPressed+" DOWN:"+tthis.upArrowPressed+" x/y:"+tthis.user.x+"/"+tthis.user.y+" id:"+tthis.user.uid+" uuid:"+tthis.user.uuid)
				  write(new PingPongPlayerPacket(tthis.downArrowPressed, tthis.upArrowPressed, tthis.user.x, tthis.user.y, tthis.user.uid, tthis.user.uuid));
			  }
		  }
	  }
		
	  // render() here
	  if(tthis.settings_received)
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