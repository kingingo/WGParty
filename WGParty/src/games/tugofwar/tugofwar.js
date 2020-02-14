//Aliases
let Application = 
	PIXI.Application, 
	loader = PIXI.loader,
	resources = PIXI.loader.resources, 
	Graphics = PIXI.Graphics,
	Sprite = PIXI.Sprite,
	TextStyle = PIXI.TextStyle,
	Text = PIXI.Text,
	height = 400, 
	width = 600, 
	rope = undefined,
	img_rope = "images/rope2.png", 
	img_button_down = "images/button1.png", 
	img_button_over = "images/button.png", 
	img_button = "images/button2.png", 
	img_lawn = "images/lawn.png";

let style = new TextStyle({
	  fontFamily: "Arial",
	  fontSize: 36,
	  fill: "white",
	  stroke: '#ff3300',
	  strokeThickness: 4,
	  dropShadow: true,
	  dropShadowColor: "#000000",
	  dropShadowBlur: 4,
	  dropShadowAngle: Math.PI / 6,
	  dropShadowDistance: 6,
	});

let textureButton, textureButtonDown, textureButtonOver;

// Create a Pixi Application
let app = new PIXI.Application({
	width : width, // default: 800
	height : height, // default: 600
	antialias : true, // default: false
	transparent : true, // default: false
	resolution : 1
// default: 1
});

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

PIXI.loader
.add(img_rope)
.add(img_button_down)
.add(img_button_over)
.add(img_button)
.load(setup);

function setup() {
	let line = new Graphics();
	line.lineStyle(4, 0x47404f, 1);
	line.moveTo((width/2), 0);
	line.lineTo((width/2),height);
	line.x = 32;
	line.y = 32;
	app.stage.addChild(line);

	rope = new Sprite(resources[img_rope].texture);
	rope.y = (height - rope.height) / 2;
	app.stage.addChild(rope);

	textureButton = resources[img_button].texture;
	textureButtonDown = resources[img_button_down].texture;
	textureButtonOver = resources[img_button_over].texture;
	let button = new Sprite(textureButton);
	button.scale.x = 0.2;
	button.scale.y = 0.2;
	button.x = (width - button.width) * (4 / 5);
	button.y = (height - button.height) * (5 / 6);

	button.interactive = true;
	button.buttonMode = true;
	button
	// Mouse & touch events are normalized into
	// the pointer* events for handling different
	// button events.
	.on('pointerdown', onButtonDown).on('pointerup', onButtonUp).on(
			'pointerupoutside', onButtonUp).on('pointerover', onButtonOver).on(
			'pointerout', onButtonOut);

	// Use mouse-only events
	// .on('mousedown', onButtonDown)
	// .on('mouseup', onButtonUp)
	// .on('mouseupoutside', onButtonUp)
	// .on('mouseover', onButtonOver)
	// .on('mouseout', onButtonOut)

	// Use touch-only events
	// .on('touchstart', onButtonDown)
	// .on('touchend', onButtonUp)
	// .on('touchendoutside', onButtonUp)
	
	app.stage.addChild(button);
}

function checkWin(){
	if((rope.x) > 24+(width/2)){
		let message = new Text("YOU WON!", style);
		message.position.set((width - message.width)/2,(height-message.height)/2);
		app.stage.addChild(message);
	}
}

function onButtonDown() {
	if(!this.isdown){
		this.isdown = true;
		this.texture = textureButtonDown;
		
		rope.x+=40;
		
		checkWin();
	}
}

function onButtonUp() {
	this.isdown = false;
	if (this.isOver) {
		this.texture = textureButtonOver;
	} else {
		this.texture = textureButton;
	}
}

function onButtonOver() {
	this.isOver = true;
	if (this.isdown) {
		return;
	}
	this.texture = textureButtonOver;
}

function onButtonOut() {
	this.isOver = false;
	if (this.isdown) {
		return;
	}
	this.texture = textureButton;
}