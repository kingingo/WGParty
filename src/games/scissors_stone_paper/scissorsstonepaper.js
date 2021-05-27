loadScript("games/scissors_stone_paper/packets.js");

class ScissorsStonePaper extends Game{

	constructor(spectate, callbackStart, callbackEnd){
		super("ScissorsStonePaper",spectate, callbackStart,callbackEnd);
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
				 case SSPCHOOSE:
					 var packet = new SSPChoosePacket();
					 packet.parseFromInput(buffer);
					 var user = getUser(packet.uuid);
					 
					 if(user==null || user.uuid == getUUID())return;
					 
					 user.index = packet.choose;
					 break;
				 case SSPSETTINGS:
					 var packet = new SSPSettingsPacket();
					 packet.parseFromInput(buffer);
					 
					 this.start = packet.start;
					 break;
				 default:
					  this.log("Packet "+packetId+" not found");
					 break;
			 }
		 }
	}
	
	getUser(uuid){
		 for(var i = 0; i < this.users.length ; i++)
			 if(this.users[i].uuid == uuid)
				 return this.users[i];
		 
		 return null;
	}
	

	end(){
		super.end();
	}
	
	init(){
		this.log("Init start SSP");
		this.canvas = document.getElementById("scissors_stone_paper");
		this.canvas.width = 400;
		this.canvas.height = 700;
		this.ctx = this.canvas.getContext("2d");
//		this.setImages();
		
		let user1_img = document.createElement("img");
		user1_img.id="ssp_p1";
		user1_img.hidden=true;
		user1_img.src=getProfileS(getUUID1(),false);
		document.getElementById(this.containerId).appendChild(user1_img);
		
		let user2_img = document.createElement("img");
		user2_img.id="ssp_p2";
		user2_img.hidden=true;
		user2_img.src=getProfileS(getUUID2(),false);
		document.getElementById(this.containerId).appendChild(user2_img);
		
		let paper = document.getElementById("ssp_paper");
		let scissors = document.getElementById("ssp_scissors");
		let stone = document.getElementById("ssp_stone");
		
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

		this.users = [
			{
				profile: document.getElementById("ssp_p1"),
				uuid: getUUID1(),
				index: -1,
				last: 0,
				angle: 360,
				angle_bounce: true,
				bounce1: 450,
				bounce2: 270,
				last_switch: getCurrentTime()
			},
			{
				profile: document.getElementById("ssp_p2"),
				uuid: getUUID2(),
				index: -1,
				last: 2,
				angle: 270,
				angle_bounce: true,
				bounce1: 270,
				bounce2: 90,
				last_switch: getCurrentTime()
			}
		];
		
		if(!this.spectate){
			if(getUUID2() == getUUID()){
				this.users[0].profile = document.getElementById("ssp_p2");
				this.users[0].uuid = getUUID2();
				
				this.users[1].profile = document.getElementById("ssp_p1");
				this.users[1].uuid = getUUID1();
			}
	  		
			this.canvas.addEventListener('touchmove', this.touchHandler.bind(null,this));
			this.canvas.addEventListener('click', this.touchHandler.bind(null,this));
		}
		this.start = 0;
		this.loop(this);
		this.log("####Init END SSP####");
	}
	
//	setImages(){
//		let path = "games/scissors_stone_paper/img/";
//		this.setImg("ssp_stone",path+"stone.png");
//		this.setImg("ssp_paper",path+"paper.png");
//		this.setImg("ssp_scissors",path+"scissors.png");
//		this.setImg("ssp_wtf",path+"wtf.png");
//		this.setImg("ssp_bang",path+"bang.png");
//	}
	
//	setImg(id, path){
//		let img = document.createElement("img");
//		img.src=path;
//		img.id=id;
//		img.hidden=true;
//		document.getElementById(this.containerId).appendChild(img);
//	}

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
		if(tthis.start <= getCurrentTime() && this.spectate)return;
		
		//Nur einmal auswählen
//		if(tthis.index != -1)return;
		let pos = tthis.getTouchPos(ev);
		let x = pos.x;
		let y = pos.y;
		
		for(var i = 0; i < tthis.choose.length; i++){
			if(tthis.has_clicked(i, x, y)){
				tthis.users[0].index = i;
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
		tthis.drawBackground();
		tthis.drawProfiles();
		if(!tthis.spectate)
			tthis.drawChoose();
		tthis.drawCountdown();
		tthis.draw();
		
		if(tthis.start == 0 || tthis.start > getCurrentTime()){
			requestAnimationFrame(tthis.loop.bind(null,tthis)); 
		}else{
			let wtf = document.getElementById("ssp_wtf");
			let bang = document.getElementById("ssp_bang");
			tthis.drawImg(tthis.canvas.width/2 - tthis.users[0].profile.width/2, tthis.canvas.height/2 + tthis.users[0].profile.height/2, wtf);
			tthis.drawImg(tthis.canvas.width/2 - tthis.users[1].profile.width/2, tthis.users[1].profile.height/2, bang);
		}
	}
	
	drawProfiles(){
		this.drawImg(this.canvas.width/2 - this.users[1].profile.width/2, this.users[1].profile.height/2 ,this.users[1].profile);
		this.drawImg(this.canvas.width/2 - this.users[0].profile.width/2, this.canvas.height/2 + this.users[0].profile.height/2,this.users[0].profile);
	}
	
	draw(){
		for(var i = 0; i < this.users.length; i++){
			var user = this.users[i];
			if(user.index!= -2){
				let w = this.choose[user.last].el.width;
				let h = this.choose[user.last].el.height;
				let radians = this.degrees_to_radians(user.angle);
				
				let ax = Math.sin(radians) * 15;
				let ay = Math.cos(radians) * 15;
				
				let cx = Math.floor(this.canvas.width/2 - w/2);
				let cy = Math.floor(this.canvas.height/2 - h - (i==0? - h : - 0));
				
				this.drawImg(cx+ax,cy+ay,this.choose[user.last].el);
				
				if((getCurrentTime() - user.last_switch) > 250){
					user.last = user.index >= 0 ? user.index : this.getRandomInt(this.choose.length);
					user.last_switch = getCurrentTime();
				}

				user.angle = (user.angle_bounce ? user.angle+5 : user.angle-5);
				
				if(user.angle_bounce && user.angle > user.bounce1){
					user.angle_bounce=false;
				}
				
				if(!user.angle_bounce && this.angle < user.bounce2){
					user.angle_bounce=true;
				}
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
		
		$.get("games/scissors_stone_paper/index.php", data => {
			$("#"+containerId).append(data);
			$("#ssp_scissors").on('load', ()=>this.init());
		});
		this.callbackStart();
	}
}