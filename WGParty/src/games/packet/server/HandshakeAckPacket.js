var HANDSHAKEACK=0;

class HandshakeAckPacket {
	
	parseFromInput(buffer){
		this.accepted = (buffer.readInt()==0?false:true);
		if(this.accepted)this.name = buffer.readString();
	}
	
	toString(){
		return "accepted:"+this.accepted+",name:"+this.name
	}
}