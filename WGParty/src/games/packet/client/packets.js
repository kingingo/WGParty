class CountdownPacket{
	
	constructor(time){
		this.time=time;
		this.id=COUNTDOWN;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeDouble(this.time);
		return this.buffer;
	}
	
}

class HandshakePacket{
	
	constructor(uuid,state){
		this.uuid=uuid;
		this.state=state;
		this.id=HANDSHAKE;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(36,false,false);
		this.buffer.writeString(this.uuid);
		this.buffer.writeInt(this.state);
		return this.buffer;
	}
	
}

class PongPacket{
	
	constructor(){
		this.id=PONG;
	}
	
	parseToOutput(){}
}

class RegisterPacket{
	
	constructor(name, bytes, format){
		this.name=name;
		this.bytes=bytes;
		this.format=format;
		this.id=REGISTER;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(16,false,false);
		this.buffer.writeString(this.name);
		this.buffer.writeString(this.format);
		this.buffer.writeInt(this.bytes.length);
		this.buffer.writeBytes(this.bytes);
		return this.buffer;
	}
	
}

class StatsPacket{
	
	constructor(update){
		this.update=update;
		this.id=STATS;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(1,false,false);
		this.buffer.writeInt((this.update ? 1 : 0));
		return this.buffer;
	}
	
}

class WheelSpinPacket{
	
	constructor(rand){
		this.rand=rand;
		this.id=WHEELSPIN;
	}
	
	parseFromInput(buffer){
		this.rand = buffer.readFloat32();
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeFloat32(this.rand);
		return this.buffer;
	}
	
	toString(){
		return "rand:"+this.rand;
	}
	
}