class PingPongUserPacket{
	
	constructor(uuid, y){
		this.uuid = uuid;
		this.y=parseFloat(y);
		this.id=PINGPONGUSER;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeString(this.uuid);
		this.buffer.writeDouble(this.y);
		return this.buffer;
	}
	
	parseFromInput(buffer){
		this.uuid = buffer.readString();
		this.y = buffer.readDouble();
	}
	
	toString(){
		return "uuid:"+this.uuid+" y:"+this.y;
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