class GameStartAckPacket {
	constructor(){
		this.id=GAMESTARTACK;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		return this.buffer;
	}
}

class GameStartPacket {
	parseFromInput(buffer){
		this.game = buffer.readString();
	}
	
	toString(){
		return "game:"+(typeof this.game == "undefined" ? "undefined" : this.game);
	}
}