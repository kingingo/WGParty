var HANDSHAKE = 0;
class HandshakePacket{
	
	constructor(uuid){
		this.uuid=uuid;
		this.id=HANDSHAKE;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(36,false,false);
		this.buffer.writeString(this.uuid);
		return this.buffer;
	}
	
}