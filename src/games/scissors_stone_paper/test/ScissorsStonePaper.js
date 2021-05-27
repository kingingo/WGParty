class Game{
	constructor(game,spectate, callbackStart, callbackEnd){
		this.active=false;
		this.game=game;
		this.spectate=spectate;
		this.callbackEnd = callbackEnd;
		this.callbackStart = callbackStart;
		this.cancelCallbackEnd = false;
	}
	
	cancel(){
		this.cancelCallbackEnd=true;
	}
	
	end(){
		if(!this.cancelCallbackEnd)
			this.callbackEnd();
		this.active=false;
	}
	
	start(containerId){
		this.active=true;
		this.containerId=containerId;
	}
	
	log(msg){
		console.log(this.game+" | "+msg);
	}
}

function getCurrentTime(){
	return new Date().getTime();
}

class ScissorsStonePaper extends Game{

	constructor(spectate, callbackStart, callbackEnd){
		super("ScissorsStonePaper",spectate, callbackStart,callbackEnd);
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 
		 }
	}
	

	end(){
		super.end();
	}
	
	init(){
		this.canvas = document.getElementById("scissors_stone_paper");
		this.canvas.width = 400;
		this.canvas.height = 700;
		this.ctx = this.canvas.getContext("2d");
		
		let paper = document.getElementById("paper");
		let scissors = document.getElementById("scissors");
		let stone = document.getElementById("stone");
		
		let cx = this.canvas.width / 2;
		let cy = this.canvas.height;
		let width = paper.width + scissors.width + stone.width;

		this.countdown_x = this.canvas.width - this.canvas.width * (0.2);
		this.countdown_y  = this.canvas.height - stone.height/2;
		
		this.choose = [
			{
				el: paper,
				x_max: cx - width  + width * (1/3) + paper.width/2,
				x: cx - paper.width/2 - width  + width * (1/3),
				y_max: cy,
				y: cy - paper.height,
			},
			{
				el: scissors,
				x_max: cx + scissors.width/2 - width  + width * (2/3),
				x: cx - scissors.width/2 - width  + width * (2/3),
				y_max: cy,
				y: cy - scissors.height,
			},
			{
				el: stone,
				x_max: cx + stone.width/2,
				x: cx - stone.width/2,
				y_max: cy,
				y: cy - stone.height,
			}
		];
  		
		this.canvas.addEventListener('touchmove', this.touchHandler.bind(null,this));
		this.canvas.addEventListener('click', this.touchHandler.bind(null,this));

		this.e_profile = document.getElementById("p2");
		this.e_index = -1;
		this.e_last = 2;
		this.e_angle = 270;
		this.e_angle_bounce = true;
		this.e_last_switch = getCurrentTime();

		this.profile = document.getElementById("p1");
		this.index = -1;
		this.last = 0;
		this.angle = 360;
		this.angle_bounce = true;
		this.last_switch = getCurrentTime();
		
		this.start = getCurrentTime() + 1000 * 10;
//		this.interval = setInterval(this.loop.bind(null,this), 1000 / 1)
		this.loop(this);
	}

	//get position of the touch
	getTouchPos(ev) {
		  var rect = this.canvas.getBoundingClientRect();
		  var x = (ev.type == "click" ? ev.clientX : ev.targetTouches[0].clientX);
		  var y = (ev.type == "click" ? ev.clientY : ev.targetTouches[0].clientY);
		  
		  return {
		    x: x - rect.left,
		    y: y - rect.top
		  };
	}

	touchHandler(tthis, ev){
		ev.preventDefault();
		//Auswählen bis Zeit um ist.
		if(tthis.start <= getCurrentTime())return;
		
		//Nur einmal auswählen
//		if(tthis.index != -1)return;
		let pos = tthis.getTouchPos(ev);
		let x = pos.x;
		let y = pos.y;
		
		for(var i = 0; i < tthis.choose.length; i++){
			if(tthis.has_clicked(i, x, y)){
				tthis.index = i;
				break;
			}
		}
	}
	
	toAngleTo(x, y, cx, cy){
		return (180 - Math.atan2(cx-x,cy-y) * 180 / Math.PI);
	}
	
	degrees_to_radians(degrees)
	{
	  var pi = Math.PI;
	  return degrees * (pi/180);
	}
	
	update(){
		if(this.index >= 0){
			let w = this.choose[this.index].el.width;
			let h = this.choose[this.index].el.height;
			
			if(!Number.isInteger(this.choose[this.index].x)){
				this.choose[this.index].x = Math.floor(this.choose[this.index].x);
			}
			
			if(!Number.isInteger(this.choose[this.index].y)){
				this.choose[this.index].y = Math.floor(this.choose[this.index].y);
			}
			
			let x = this.choose[this.index].x;
			let y = this.choose[this.index].y;
			
			let cx = Math.floor(this.canvas.width/2 - w/2);
			let cy = Math.floor(this.canvas.height/2 - h/2);
			
			let angle = this.degrees_to_radians(this.toAngleTo(x,y,cx,cy));
			this.choose[this.index].x += 1 * Math.sin(angle);
			this.choose[this.index].y -= 1 * Math.cos(angle);
			if(y == cy && cx == x){
				console.log("STOP "+this.index);
				this.index=-2;
			}
		}
	}
	
	has_clicked(i, x, y){
		return this.choose[i].x_max >= x && this.choose[i].x <= x && this.choose[i].y_max >= y && this.choose[i].y <= y;
	}
	
	getRandomInt(max) {
		  return Math.floor(Math.random() * max);
	}
	
	degrees_to_radians(degrees){
	  var pi = Math.PI;
	  return degrees * (pi/180);
	}
	
	loop(tthis){
//		tthis.update();
		
		tthis.drawBackground();
		tthis.drawProfiles();
		tthis.drawChoose();
		tthis.drawCountdown();
		tthis.draw();
		tthis.drawEnemy();
		
		if(tthis.start > getCurrentTime()){
//			clearInterval(tthis.interval);
			requestAnimationFrame(tthis.loop.bind(null,tthis)); 
		}else{
			tthis.wtf = document.getElementById("wtf");
			tthis.bang = document.getElementById("bang");
			tthis.drawImg(tthis.canvas.width/2 - tthis.profile.width/2, tthis.canvas.height/2 + tthis.profile.height/2, wtf);
			tthis.drawImg(tthis.canvas.width/2 - tthis.e_profile.width/2, tthis.e_profile.height/2, bang);
		}
	}
	
	drawProfiles(){
		this.drawImg(this.canvas.width/2 - this.e_profile.width/2, this.e_profile.height/2 ,this.e_profile);
		this.drawImg(this.canvas.width/2 - this.profile.width/2, this.canvas.height/2 + this.profile.height/2,this.profile);
	}
	
	drawEnemy(){
		if(this.e_index != -2){
			let w = this.choose[this.e_last].el.width;
			let h = this.choose[this.e_last].el.height;

			let radians = this.degrees_to_radians(this.e_angle);
			let ax = Math.sin(radians) * 15;
			let ay = Math.cos(radians) * 15;
			
			let cx = Math.floor(this.canvas.width/2 - w/2);
			let cy = Math.floor(this.canvas.height/2 - h/2 - h);
			
			this.drawImg(cx+ax,cy+ay,this.choose[this.e_last].el);
			
			if((getCurrentTime() - this.e_last_switch) > 250){
				this.e_last_switch = getCurrentTime();
				this.e_last=this.getRandomInt(this.choose.length);
			}

			
			this.e_angle = (this.e_angle_bounce ? this.e_angle+5 : this.e_angle-5);
			
			if(this.e_angle_bounce && this.e_angle > 270){
				this.e_angle_bounce=false;
			}
			
			if(!this.e_angle_bounce && this.e_angle < 90){
				this.e_angle_bounce=true;
			}
		}
	}
	
	draw(){
		if(this.index != -2){
			let w = this.choose[this.last].el.width;
			let h = this.choose[this.last].el.height;
			let radians = this.degrees_to_radians(this.angle);
			
			let ax = Math.sin(radians) * 15;
			let ay = Math.cos(radians) * 15;
			
			let cx = Math.floor(this.canvas.width/2 - w/2);
			let cy = Math.floor(this.canvas.height/2 - h/2);
			
			this.drawImg(cx+ax,cy+ay,this.choose[this.last].el);
			
			if((getCurrentTime() - this.last_switch) > 250){
				this.last = this.index >= 0 ? this.index : this.getRandomInt(this.choose.length);
				this.last_switch = getCurrentTime();
			}

			this.angle = (this.angle_bounce ? this.angle+5 : this.angle-5);
			
			if(this.angle_bounce && this.angle > 450){
				this.angle_bounce=false;
			}
			
			if(!this.angle_bounce && this.angle < 270){
				this.angle_bounce=true;
			}
		}
	}
	
	drawCountdown(){
		let x = this.countdown_x;
		let y = this.countdown_y;

		let metrics_width = this.ctx.measureText("Time:").width;
		
		this.ctx.fillStyle = '#521b29';
		this.ctx.font = '35px sans-serif';
		this.ctx.fillText("Time:", x - metrics_width/2, y - this.choose[2].el.height/2);
		this.ctx.fillText(Math.floor((this.start - getCurrentTime())/1000), x, y);
	}
	
	drawBackground(){
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	drawChoose(){
		for(var i = 0; i < this.choose.length; i++)
			this.drawImg(this.choose[i].x,this.choose[i].y,this.choose[i].el);
	}
	
	drawImg(x,y,img){
		this.ctx.drawImage(img, x, y, img.width, img.height);
	}
	
	start(containerId){
		super.start(containerId);
		this.init();
		
		
	}
}

window.game = new ScissorsStonePaper(false,() => console.log("Game Starts"),() => console.log("Game Ends"));
window.game.start("");