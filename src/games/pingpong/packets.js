class PingPongResetPacket{
	constructor(){
		this.id=PINGPONGRESET;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer){
		this.start = buffer.readDouble();
	}
	
	toString(){
		return "start:"+this.start;
	}
}

class PingPongUserPacket{
	constructor(uuid, user_y){
		this.uuid = uuid;
		this.user_y=parseFloat(user_y);
		this.id=PINGPONGUSER;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeString(this.uuid);
		this.buffer.writeDouble(this.user_y);
		return this.buffer;
	}
	
	parseFromInput(buffer){
		this.uuid = buffer.readString();
		this.user_y = buffer.readDouble();
	}
	
	toString(){
		return "uuid:"+this.uuid+" user_y:"+this.user_y;
	}
}

class PingPongGoalPacket{
	
	constructor(uuid, score){
		this.uuid = uuid;
		this.score = score;
		this.id=PINGPONGGOAL;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeString(this.uuid);
		this.buffer.writeInt(this.score);
		return this.buffer;
	}
	
	parseFromInput(buffer){
		this.uuid = buffer.readString();
		this.score = buffer.readInt();
	}
	
	toString(){
		return "uuid:"+this.uuid+" score:"+score;
	}
}