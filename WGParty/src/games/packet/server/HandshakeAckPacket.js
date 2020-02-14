var HANDSHAKEACK=0;

class HandshakeAckPacket {
	
	parseFromInput(buffer){
		this.accepted = (buffer.readInt()==0?false:true);
		
		if(this.accepted)this.name = buffer.readString();
		if(this.accepted){
			this.img = buffer.toBuffer(false,0);
		}
	}
	
	toString(){
		return "accepted:"+this.accepted+",name:"+this.name+
		",img:"+(typeof this.image == "undefined" ? "undefined" : this.img.byteLength);
	}
}