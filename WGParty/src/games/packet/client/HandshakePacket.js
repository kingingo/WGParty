var HANDSHAKE = 0;
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