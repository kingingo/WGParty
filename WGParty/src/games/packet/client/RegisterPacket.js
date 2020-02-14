var REGISTER = 0;
class RegisterPacket{
	
	constructor(name, bytes){
		this.name=name;
		this.bytes=bytes;
		this.id=REGISTER;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(16,false,false);
		this.buffer.writeString(this.name);
		this.buffer.writeInt(this.bytes.length);
		this.buffer.writeBytes(this.bytes);
		return this.buffer;
	}
	
}