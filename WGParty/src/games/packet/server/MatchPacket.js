var MATCH=0;

class MatchPacket {
	
	parseFromInput(buffer){
		this.winner = buffer.readString();
		this.winner_uuid = buffer.readString();
		
		this.loser = buffer.readString();
		this.loser_uuid = buffer.readString();
		
		this.alk = [];
		var length = buffer.readInt();
		for(var i = 0; i < length; i++){
			this.alk.push({"label":buffer.readString(),  "value":buffer.readInt(),  "pic":buffer.readString()});
		}
	}
	
	toString(){
		return "winner:"+this.winner+" loser:"+this.loser+" alk:"+this.alk.length;
	}
}