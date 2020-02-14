REGISTERACK=0;

class RegisterAckPacket {
	parseFromInput(buffer){
		this.uuid = buffer.readString();
	}
	
	toString(){
		return "uuid:"+(typeof this.uuid == "undefined" ? "undefined" : this.uuid);
	}
}