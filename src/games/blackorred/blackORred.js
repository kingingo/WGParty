loadScript("games/blackorred/packets.js");

const bor_canvas_id = "card_table";
const bor_card_width = 138;
const bor_card_height = 192;

class BlackOrRed extends Game{
	
	constructor(spectate, callbackStart, callbackEnd){
		super("BlackOrRed",spectate, callbackStart,callbackEnd);
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			 case BLACKORREDCARDS:
				 var packet = new BlackOrRedCardsPacket();
				 packet.parseFromInput(buffer);
				 
				 this.show_cards = packet.show_cards;
				 this.cards = packet.cards;
				 console.log("CARDS: "+JSON.stringify(this.cards));
				 
				 for(var i = 0; i < this.users.length; i++){
					 this.users[i].choose = this.Array(this.show_cards);
				 }

				 console.log("USER[2] LENGTH "+this.users[2].length);
				 for(var i = 0; i < this.show_cards; i++){
					 this.users[2].choose[i] = this.isRed(this.cards[i])?1:2;
					 console.log("users[2].choose["+i+"] = "+this.users[2].choose[i]);
				 }
				 this.createImages(this.cards);
				 
				 if(!this.spectate){
					 if(this.users[0].uuid == getUUID()){
						 this.uid = 0;
					 }else if(this.users[1].uuid == getUUID()){
						 this.uid = 1;
					 }
					 
					 this.canvas.addEventListener('touchmove', ev => this.touchHandler(ev));
					 this.canvas.addEventListener('click', ev => this.touchHandler(ev));
				 }
		    	 this.interval = setInterval(() => this.update(), 1000 / 3 );
		    	 console.log("START INTERVALL!!");
				 break;
			 case USERCHOOSECOLOR:
				 var packet = new UserChooseColorPacket();
				 packet.parseFromInput(buffer);
				 
				 var user = this.users[0].uuid == packet.uuid ? this.users[0] : this.users[1].uuid == packet.uuid ? this.users[1] : null;
				 
				 if(user!=null){
					 console.log("UserChooseColorPacket "+user.name+" CHOOSE["+packet.deck_card+"]="+packet.color);
					 user.choose[packet.deck_card] = packet.color;
					 
					 if(this.spectate && this.users[0].choose[packet.deck_card] > 0 && this.users[1].choose[packet.deck_card] > 0)
						 this.deck_card = packet.deck_card+1;
				 }else{
					 console.log("UserChooseColorPacket User null!? "+packet);
				 }
				 break;
			  default:
				  this.log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
	
	end(){
		super.end();
		clearInterval(this.interval);
		this.reset();
	}
	
	 Array(size) {
	    var a = [];
	    for (var i = 0; i < size; i++) {
	        a.push(0);
	    }
	    return a;
	}
	
	init(){
		this.canvas = document.getElementById(bor_canvas_id);
		// width="900" height="600"
		
		this.canvas.width = 900;
		this.canvas.height = 600;
		
		this.ctx = this.canvas.getContext("2d");
		this.background = document.getElementById("background");
		this.cover = document.getElementById("card_cover");
		this.buttons = {
				red: {
					x:this.canvas.width/3, 
					y:this.canvas.height - (this.canvas.height/5), 
					color:"red", 
					pressed:false, 
					pressed_color:"#f37979",
					choose_id: 1,
				},
				black: {
					x:this.canvas.width - this.canvas.width/3, 
					y:this.canvas.height - (this.canvas.height/5), 
					color:"black", 
					pressed:false, 
					pressed_color:"#3a3838",
					choose_id: 2,
				},
				radius: 50
		};
		this.deck_card = 0;
		
		this.users = [
			{
				name:localStorage.getItem('p1_name'),
				uuid:getUUID1(),
				path:getProfile(getUUID1()),
				x:this.canvas.width - this.canvas.width/10,
				choose:[0,0,0],
			},
			{
				name:localStorage.getItem('p2_name'),
				uuid:getUUID2(),
				path:getProfile(getUUID2()),
				x:this.canvas.width - this.canvas.width/5 + 25,
				choose:[0,0,0],
			},
			{
				choose:[0,0,0],
				x:this.canvas.width - this.canvas.width/4,
			}
		];
		console.log("CREATE USERS!!");
		this.createProfileImg();
		this.canvas.scrollIntoView();
	}
	
	isRed(card){
		return card.includes("karo") || card.includes("herz");
	}
	
	createProfileImg(){
		this.users.forEach(user => {
			if(typeof user.path == 'undefined')return;
			
			user.img = document.createElement("img");
			user.img.width = 50;
			user.img.height = 50;
			user.img.src=user.path;
			user.img.id="profile_"+user.name;
			user.img.hidden=true;
			document.getElementById(this.containerId).appendChild(user.img);
		});
	}
	
	createImages(cards){
		for(var i = 0; i < cards.length; i++){
			let img = document.createElement("img");
			img.width = bor_card_width;
			img.height = bor_card_height;
			img.src="games/blackorred/img/"+cards[i];
			img.id="card"+i;
			img.hidden=true;
			document.getElementById(this.containerId).appendChild(img);
		}
	}

	update(){
		this.render();
	}
	
	start(containerId){
		super.start(containerId);
		
		$.get("games/blackorred/index.php", data => {
			$("#"+containerId).append(data);
			this.init();
			this.callbackStart();
		});
	}
	
	reset(){
		if(!this.spectate){
			this.canvas.removeEventListener('click', this.touchHandler);
			this.canvas.removeEventListener('touchmove', this.touchHandler);
		}
	}
	
	touchHandler(ev){
		if(this.buttons.red.pressed || this.buttons.black.pressed || this.deck_card >= this.users[2].choose.length)return;
		ev.preventDefault();
		var pos = this.getTouchPos(ev);
		var r = this.buttons.radius;
		var r2 = Math.pow(r,2);
		
		var red_x = this.buttons.red.x;
		var red_y = this.buttons.red.y;
		
		var black_x = this.buttons.black.x;
		var black_y = this.buttons.black.y;
		
		let button = null;
		if( (Math.pow(pos.x-red_x, 2) + Math.pow(pos.y-red_y, 2)) < r2){
			button = this.buttons.red;
		}else if( (Math.pow(pos.x-black_x, 2) + Math.pow(pos.y-black_y, 2)) < r2){
			button = this.buttons.black;
		}
		
		if(button!=null){
			this.users[this.uid].choose[this.deck_card] = button.choose_id;
			write(new UserChooseColorPacket(getUUID(),this.deck_card,button.choose_id));
			
			this.drawButton(button, true);
			setTimeout(() => this.drawButton(button, false), 400);
			this.deck_card+=1;
			
			console.log(this.deck_card+" >= "+this.users[2].choose.length);
			if(this.deck_card >= this.users[2].choose.length){
				this.reset();
			}
		}
	}
	
	getTouchPos(ev) {
		  var rect = this.canvas.getBoundingClientRect();
		  var x = (ev.type == "click" ? ev.clientX : ev.targetTouches[0].clientX);
		  var y = (ev.type == "click" ? ev.clientY : ev.targetTouches[0].clientY);
		  
		  return {
		    x: x - rect.left,
		    y: y - rect.top
		  };
	}
	
	render(){
		this.drawBackground();
		
		this.drawProfile(this.users[0]);
		this.drawProfile(this.users[1]);
		this.drawPoints(this.users[2]);
		
		this.drawCards(this.cards.length);
		this.drawButton(this.buttons.red);
		this.drawButton(this.buttons.black);
	}
	
	resetCanvas(){
		this.ctx.strokeStyle = "#000";
		this.ctx.lineWidth = 1;
	}
	
	drawPoints(user){
		this.resetCanvas();
		for(var i = 0; i < this.deck_card; i++){
			this.ctx.beginPath();
			this.ctx.arc(user.x + 50/2, 50*2 + 30 * (i+1), 10, 0, 2 * Math.PI);
			this.ctx.fillStyle = user.choose[i] == 0 ? "white" : (user.choose[i] == this.buttons.red.choose_id ? "red" : "black");
			this.ctx.fill();
			this.ctx.stroke();
		}
	}
	
	drawProfile(user){
		if(getUUID() == user.uuid){
			this.ctx.strokeStyle = "green";
			this.ctx.lineWidth = 2;
		}else{
			this.resetCanvas();
		}
		
		this.ctx.drawImage(user.img, user.x, user.img.height, user.img.width, user.img.height);
		this.ctx.strokeRect(user.x, user.img.height, user.img.width, user.img.height);
		this.drawPoints(user);
	}
	
	drawCards(amount){
		var x = this.canvas.width/2 - this.cover.width;
		var y = this.canvas.height/3;

		for(var i = amount-1; i >= 0; i--){
			if(i < this.deck_card){
				var card = document.getElementById("card"+i);
				this.ctx.drawImage(card, x, y, card.width, card.height);
			}else{
				this.ctx.drawImage(this.cover, x, y, this.cover.width, this.cover.height);
			}
			
			x+= 30;
			y-= 30;
		}
	}
	
	drawButton(button, pressed = false){
		button.pressed=pressed;
		this.ctx.strokeStyle = "gray";
		this.ctx.lineWidth = 5;
		
		this.ctx.beginPath();
		this.ctx.arc(button.x, button.y, this.buttons.radius, 0, 2 * Math.PI);
		this.ctx.fillStyle = pressed ? button.pressed_color : button.color;
		this.ctx.fill();
		this.ctx.stroke();
	}
	
	drawBackground(){
		this.ctx.drawImage(this.background, 0, 0, this.background.width, this.background.height);
	}
}