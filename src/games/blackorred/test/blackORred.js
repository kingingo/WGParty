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

function getUUID(){
	return "138cbd2a-8db2-4a28-bdbd-03df5d64851a";
}

const canvas_id = "card_table";
const card_width = 138;
const card_height = 192;

class BlackOrRed extends Game{
	constructor(spectate, callbackStart, callbackEnd){
		super("BlackOrRed",spectate, callbackStart,callbackEnd);
	}
	
	init(){
		this.canvas = document.getElementById(canvas_id);
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
		var types = ["karo","herz","pik","kreuz"];
		var cards = [];
		types.forEach(type => {
			for(var i = 1; i < 14; i++)
				cards.push(type+"/"+i+".png");
		});
		//Shuffle
		cards.sort(() => 0.5-Math.random());
		this.createImages(cards,5);
		
		if(!this.spectate){
			  this.canvas.addEventListener('touchmove', ev => this.touchHandler(ev));
			  this.canvas.addEventListener('click', ev => this.touchHandler(ev));
		}

		this.users = [
			{
				name:"Felix",
				uuid:"138cbd2a-8db2-4a28-bdbd-03df5d64851a",
				path:"img/felix.jpg", 
				x:this.canvas.width - this.canvas.width/10,
				choose:[0,0,0],
			},
			{
				name:"Lea",
				uuid:"ffbef80f-ad3e-49f2-95cd-e8fbae633473",
				path:"img/lea.jpg", 
				x:this.canvas.width - this.canvas.width/5 + 25,
				choose:[0,0,0],
			},
			{
				choose:[(this.isRed(cards[0])?1:2),(this.isRed(cards[1])?1:2),(this.isRed(cards[2])?1:2)],
				x:this.canvas.width - this.canvas.width/4,
			}
		];
		this.createProfileImg();
		this.render();
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
			document.body.appendChild(user.img);
		});
	}
	
	createImages(cards, amount){
		for(var i = 0; i < amount; i++){
			let img = document.createElement("img");
			img.width = card_width;
			img.height = card_height;
			img.src="../img/"+cards[i];
			img.id="card"+i;
			img.hidden=true;
			document.body.appendChild(img);
		}
	}

	update(){
		this.render();
	}
	
	start(containerId){
		super.start(containerId);
		this.init();
		this.interval = setInterval(() => this.update(), 1000 / 3 );
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
			this.users[0].choose[this.deck_card] = button.choose_id;
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
		
		this.drawCards(5);
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

window.game = new BlackOrRed(false,() => console.log("Game Starts"),() => console.log("Game Ends"));
window.game.start("");