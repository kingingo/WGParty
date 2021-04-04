loadScript("games/ladder/packets.js");

const red_canvas_id = "red_ladder";
const blue_canvas_id = "blue_ladder";
const color_blue = "b";
const color_red = "r";

class Ladder extends Game{
	constructor(spectate, callbackStart, callbackEnd){
		super("Ladder",spectate, callbackStart,callbackEnd);
	}
	
	start(containerId){
		super.start(containerId);
		document.getElementById(containerId).innerHTML = "";
		
		$.get("games/ladder/index.php", function (tthis, data) {
            $("#"+containerId).append(data);
            
            var blue_canvas = document.getElementById(blue_canvas_id);
    		var ctx_blue = blue_canvas.getContext("2d");
    		ctx_blue.font = "40pt Calibri";
    		tthis.blue = {
    				start : 1,
    				pos : 1,
    				range : 1,
    				up: true,
    				tries : 15,
    				
    				can : blue_canvas, 
    				ctx: ctx_blue, 
    				c: color_blue,
    				uuid: getUUID2(),

    				bx: 0,
    				by: 0,
    				bwidth: 0,
    				bheight: 0,
    				bpressed: false
    			};
    		
    		var red_canvas = document.getElementById(red_canvas_id);
    		var ctx_red = red_canvas.getContext("2d");
    		ctx_red.font = "40pt Calibri";
    		tthis.red = {
    				start : 1,
    				pos : 1,
    				range : 1,
    				up: true,
    				tries : 15,
    				
    				can : red_canvas, 
    				ctx: ctx_red, 
    				c: color_red,
    				uuid: getUUID1(),
    				
    				bx: 0,
    				by: 0,
    				bwidth: 0,
    				bheight: 0,
    				bpressed: false
    		};
            
			tthis.init(containerId);
    		tthis.callbackStart();
		}.bind(null,this));
	}
	
	init(containerId){
		var array = [{path: "blue", id: "b"},{path: "red", id: "r"},{path: "yellow", id: "y"}];
		var con = document.getElementById(containerId);
	  	
	  	array.forEach(element => {
	  		for(var i = 0; i < 15; i++){
	  			let img = document.createElement("img");
	  			img.src="games/ladder/img/"+element['path']+"/"+i+".png";
	  			img.id=(i+1)+element['id'];
	  			img.hidden=true;
	  			con.appendChild(img);
	  		}
	  	});
      this.blue.name = localStorage.getItem('p1_name');
      this.red.name = localStorage.getItem('p2_name');
		
	  this.drawLadder(this.red);
	  this.drawLadder(this.blue);
	  
	  if(getUUID() == this.blue.uuid){
		  this.blue.can.addEventListener('touchmove', this.touchHandler.bind(null,this, this.blue));
		  this.blue.can.addEventListener('click', this.touchHandler.bind(null,this , this.blue));
		  this.user = this.blue;
	  }else if(getUUID() == this.red.uuid){
		  this.red.can.addEventListener('touchmove', this.touchHandler.bind(null,this, this.red));
		  this.red.can.addEventListener('click', this.touchHandler.bind(null,this , this.red));
		  this.user = this.red;
	  }else{
		  this.user=null;
	  }
	  this.interval = setInterval(this.update.bind(null,this), 1000 / 5 );
	}
	
	touchHandler(tthis, color, ev){
		ev.preventDefault();
		var pos = tthis.getTouchPos(ev, color.can);
		
		var b_x = color.bx;
		var b_w = color.bwidth;
		
		var b_y = color.by;
		var b_h = color.bheight;
		
		if(!color.bpressed && color.pos != -1 && color.tries > 0 && b_x < pos.x && (b_x+b_w) > pos.x && b_y < pos.y && (b_y+b_h) > pos.y){
			if(color.pos == 15){
				console.log("-1");
				color.pos = -1;
				tthis.drawLadder(color);
			}else if(color.pos == color.start){
				console.log("-"+(color.start!=1 ? 1 : 0));
				color.start -= (color.start!=1 ? 1 : 0);
				color.tries-=1;
				
				if(color.tries == 0){
					tthis.drawLadder(color);
				}
			}else{
				console.log("SET "+color.pos);
				color.start = color.pos;
			}
			
			if((color.start % 6) == 0 && !color.up)
				color.start -=1;
			
			color.range = (color.up && (color.start % 6) == 0 ? 5 : 1);
			
			write(new LadderClickPacket(color.uuid, color.pos, color.start,color.range, color.up, color.tries));
			tthis.drawButton(color,true);
			setTimeout(function(){ tthis.drawButton(color,false); }, 250);
		}
	}
	
	update(tthis){
		tthis.updateColor(tthis.blue);
		tthis.updateColor(tthis.red);
	}
	
	updateColor(c){
		if(c.pos == -1 || c.tries == 0)return;
		
		if(c.up && (c.pos == (c.start+c.range) || c.pos == 15)){
			c.up = !c.up;
		}else if(!c.up && (((c.pos-1)%6)==0 || c.pos == c.start || c.pos == 1)){
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
		clearInterval(this.interval);
		
		if(getUUID() == this.blue.uuid){
			this.blue.can.removeEventListener('touchmove', this.touchMoveHandler);
			this.blue.can.removeEventListener('click', this.touchHandler);
		}else if(getUUID() == this.red.uuid){
			this.red.can.removeEventListener('touchmove', this.touchMoveHandler);
			this.red.can.removeEventListener('click', this.touchHandler);
		}
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			 case LADDERCLICK:
				 var packet = new LadderClickPacket();
				 packet.parseFromInput(buffer);
				 
				 var c = null;
				 if(this.blue.uuid == packet.uuid){
					 c = this.blue;
				 }else if(this.red.uuid == packet.uuid){
					 c = this.red;
				 }
				 
				 if(c != null){
					 this.drawButton(c,true);
					 setTimeout(function(tthis){ tthis.drawButton(c,false); }.bind(null,this), 250);
					 
					 c.start = packet.start;
					 c.pos = packet.pos;
					 c.range = packet.range;
					 c.up = packet.up;
					 c.tries = packet.tries;
				 }
				 break;
			  default:
				  this.log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
}