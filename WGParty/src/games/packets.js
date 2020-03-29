GAMESTART=0;

class GameStartPacket {
	parseFromInput(buffer){
		this.game = buffer.readString();
	}
	
	toString(){
		return "game:"+(typeof this.game == "undefined" ? "undefined" : this.game);
	}
}