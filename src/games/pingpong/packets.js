class PingPongSettingsPacket{
	constructor(){
		this.id=PINGPONGSETTINGS;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer){
		this.player1 = new PingPongPlayerPacket();
		this.player1.parseFromInput(buffer,false);
		
		this.player2 = new PingPongPlayerPacket();
		this.player2.parseFromInput(buffer,false);
		
		this.ball = new PingPongBallPacket();
		this.ball.parseFromInput(buffer,false);
		
		this.start = buffer.readDouble();
		this.canvas_width = buffer.readInt();
		this.canvas_height = buffer.readInt();
		this.paddle_width = buffer.readInt();
		this.paddle_height = buffer.readInt();
	}
	
	toString(){
		return "start:"+this.start
		+" CANVAS_WIDTH:"+this.canvas_width+" CANVAS_HEIGHT:"+this.canvas_height
		+" PADDLE_WIDTH:"+this.paddle_width+" PADDLE_HEIGHT:"+this.paddle_height;
	}
}

class PingPongGoalPacket{
	
	constructor(){
		this.id=PINGPONGGOAL;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer){
		this.uid = buffer.readInt();
		this.score = buffer.readInt();
	}
	
	toString(){
		return "uid:"+this.uid+" score:"+this.score;
	}
}

class PingPongPlayerPacket{
	
	constructor(downPressed, upPressed, x , y , uid, uuid){
		this.downPressed = downPressed;
		this.upPressed = upPressed;
		
		this.x = x;
		this.y = y;
		this.uid = uid;
		this.uuid = uuid;
		this.id=PINGPONGPLAYER;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeBoolean(this.downPressed);
		this.buffer.writeBoolean(this.upPressed);
		this.buffer.writeInt(this.y);
		this.buffer.writeInt(this.uid);
		return this.buffer;
	}
	
	parseFromInput(buffer, onlyPosition){
		if(!onlyPosition){
			this.downPressed = buffer.readBoolean();
			this.upPressed = buffer.readBoolean();
		}
		
		this.x = buffer.readInt();
		this.y = buffer.readInt();
		this.uid = buffer.readInt();
	}
	
	toString(){
		return "uuid:"+this.uuid;
	}
}

class PingPongStartPacket{
	
	constructor(){
		this.id=PINGPONGSTART;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer){
		this.start = buffer.readDouble();
	}
	
	toString(){
		return "start:"+this.uuid;
	}
}

class PingPongBallPacket{
	
	constructor(){
		this.id=PINGPONGBALL;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer, onlyPosition){
		this.x = buffer.readInt();
		this.y = buffer.readInt();
		if(!onlyPosition){
			this.radius = buffer.readInt();
		}
	}
	
	toString(){
		return "x/y:"+this.x+"/"+this.y+" r:"+this.radius;
	}
}