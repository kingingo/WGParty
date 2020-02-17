var MATCH=0;

class MatchPacket {
	
	parseFromInput(buffer){
		this.winner = buffer.readString();
		this.img_winner = buffer.readBytes(buffer.readInt());
		this.loser = buffer.readString();
		this.img_loser = buffer.readBytes(buffer.readInt());
		
		this.alk = [];
		var length = buffer.readInt();
		for(var i = 0; i < length; i++){
			alk.push({"label":buffer.readString(),  "value":buffer.readInt(),  pic:buffer.readString()});
		}
	}
	
	toString(){
		return "";
	}
}