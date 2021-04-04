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

const red_canvas_id = "red_ladder";
const blue_canvas_id = "blue_ladder";
const color_blue = "b";
const color_red = "r";

class Ladder extends Game{
	constructor(spectate, callbackStart, callbackEnd){
		super("Ladder",spectate, callbackStart,callbackEnd);
		
		var blue_canvas = document.getElementById(blue_canvas_id);
		var ctx_blue = blue_canvas.getContext("2d");
		ctx_blue.font = "40pt Calibri";
		this.blue = {
				start : 1,
				pos : 1,
				range : 1,
				up: true,
				tries : 5,
				
				can : blue_canvas, 
				ctx: ctx_blue, 
				c: color_blue,

				bx: 0,
				by: 0,
				bwidth: 0,
				bheight: 0,
				bpressed: false
			};
		
		var red_canvas = document.getElementById(red_canvas_id);
		var ctx_red = red_canvas.getContext("2d");
		ctx_red.font = "40pt Calibri";
		this.red = {
				start : 1,
				pos : 1,
				range : 1,
				up: true,
				tries : 5,
				
				can : red_canvas, 
				ctx: ctx_red, 
				c: color_red,
				
				bx: 0,
				by: 0,
				bwidth: 0,
				bheight: 0,
				bpressed: false
		};
	}
	
	start(containerId){
		super.start(containerId);
		document.getElementById(containerId).innerHTML = "";
		this.init();
	}
	
	init(){
	  this.drawLadder(this.red);
	  this.drawLadder(this.blue);
	  
//	  if(getUUID() == this.blue.uuid){
		  this.blue.can.addEventListener('touchmove', this.touchHandler.bind(null,this, this.blue));
		  this.blue.can.addEventListener('click', this.touchHandler.bind(null,this , this.blue));
		  this.user = this.blue;
//	  }else if(getUUID() == this.red.uuid){
//		  this.red.can.addEventListener('touchmove', this.touchHandler.bind(null,this, this.red));
//		  this.red.can.addEventListener('click', this.touchHandler.bind(null,this , this.red));
//		  this.user = this.red;
//	  }else{
//		  this.user=null;
//	  }
	  this.interval = setInterval(this.update.bind(null,this), 1000 / 5 );
	}
	
	touchHandler(tthis, color, ev){
		ev.preventDefault();
		var pos = tthis.getTouchPos(ev, color.can);
		
		var b_x = color.bx;
		var b_w = color.bwidth;
		
		var b_y = color.by;
		var b_h = color.bheight;
		
		if(!color.bpressed && b_x < pos.x && (b_x+b_w) > pos.x && b_y < pos.y && (b_y+b_h) > pos.y){
			if(color.pos == 15){
				console.log("-1");
				color.pos = -1;
				tthis.drawLadder(color);
			}else if(color.pos == color.start){
				console.log("-"+(color.start!=1 ? 1 : 0));
				color.start -= (color.start!=1 ? 1 : 0);
				color.tries-=1;
			}else{
				console.log("SET "+color.pos);
				color.start = color.pos;
			}
			
			if((color.start % 6) == 0 && !color.up)
				color.start -=1;
			
			color.range = (color.up && (color.start % 6) == 0 ? 5 : 1);
			
			tthis.drawButton(color,true);
			setTimeout(function(){ tthis.drawButton(color,false); }, 250);
		}
	}
	
	update(tthis){
		tthis.updateColor(tthis.blue);
		tthis.updateColor(tthis.red);
	}
	
	updateColor(c){
		if(c.pos == -1)return;
		
		if(c.up && (c.pos == (c.start+c.range) || c.pos == 15)){
			c.up = !c.up;
		}else if(!c.up && (c.pos == c.start || c.pos == 1)){
			c.up = !c.up;
		}
		
		c.pos += (c.up ? 1 : -1);
		this.drawLadder(c);
		c.ctx.fillText(c.tries, c.bx + c.bwidth/2 - c.bwidth / 15, c.by + c.bheight/2);
	}

	//get position of the touch
	getTouchPos(ev,canvas) {
		  var rect = canvas.getBoundingClientRect();
		  var x = (ev.type == "click" ? ev.clientX : ev.targetTouches[0].clientX);
		  var y = (ev.type == "click" ? ev.clientY : ev.targetTouches[0].clientY);
		  
		  return {
		    x: x - rect.left,
		    y: y - rect.top
		  };
	}
	
	drawButton(color, pressed){
		color.bpressed=pressed;
		var button = document.getElementById("button"+(pressed ? "_pressed" : ""));
		color.ctx.drawImage(button, color.bx, color.by, color.bwidth, color.bheight);
	}
	
	drawLadder(color){
		let x = 0;
		let width = 0;
		let y = 0;
		for(var i = 15; i > 0; i--){
			 var img = document.getElementById(i+( i == color.pos || color.pos == -1 ? "y" : color.c ));
			 var w = img.width;
			 var h = img.height;
			 color.ctx.drawImage(img, 10 + x + (width/2 - (i==15?0:w/2)) , 10+y,w,h);
			 y+=h;
			 x += (i==15 ? 0 : width/2 - w/2);
			 width=w;
		}
		
		var button = document.getElementById("button");
		color.bx = 10 + x;
		color.by = 10 + y;
		color.bwidth = button.width;
		color.bheight = button.height;
		color.ctx.drawImage(button, color.bx, color.by, color.bwidth, color.bheight);
	}
	
	end(){
		super.end();
	}
	
	start(containerId){
		super.start(containerId);
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			  default:
//				  var packet = new PingPongUserPacket();
//			  packet.parseFromInput(buffer);
				  this.log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
}