var HANDSHAKEACK=0;

class HandshakeAckPacket {
	
	parseFromInput(buffer){
		this.accepted = (buffer.readInt()==0?false:true);
		if(this.accepted){
			this.name = buffer.readString();
			this.inGame = buffer.readBoolean();
		}
	}
	
	toString(){
		return "accepted:"+this.accepted + (this.accepted ? "" : ", name:"+this.name+", inGame:"+this.inGame);
	}
}