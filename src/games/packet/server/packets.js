class CountdownAckPacket {
	
	parseFromInput(buffer){
		this.time = buffer.readDouble();
		this.text = buffer.readString();
	}
	
	toString(){
		return "time:"+this.time;
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

class PlayerReadyAckPacket {
	parseFromInput(buffer){
		this.uuid = buffer.readString();
		this.force = buffer.readBoolean();
	}
	
	toString(){
		return "Uuid:"+(typeof this.uuid == "undefined" ? "undefined" : this.uuid)+" Force:"+(typeof this.force == "undefined" ? "undefined" : this.force);
	}
}

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

class IdsPacket {
	parseFromInput(buffer){
		let length = buffer.readInt();
		this.list = [];
		
		for(var i = 0; i < length; i++){
			this.list.push({packet:buffer.readString(),id:buffer.readInt()});
		}
	}
	
	toString(){
		return "list:"+this.list.length;
	}
}

class MatchPacket {
	
	parseFromInput(buffer){
		this.drawn = buffer.readBoolean();
		if(!this.drawn){
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
	}
	
	toString(){
		return "winner:"+this.winner+" loser:"+this.loser+" alk:"+this.alk.length;
	}
}

class PingPacket {
	parseFromInput(buffer){}
	
	toString(){
		return "";
	}
}

class ToggleStagePacket {
	parseFromInput(buffer){
		this.stage = buffer.readString();
	}
	
	toString(){
		return "stage:"+(typeof this.stage == "undefined" ? "undefined" : this.stage);
	}
}

class RegisterAckPacket {
	parseFromInput(buffer){
		this.uuid = buffer.readString();
	}
	
	toString(){
		return "uuid:"+(typeof this.uuid == "undefined" ? "undefined" : this.uuid);
	}
}

class SetMatchPacket {
	
	parseFromInput(buffer){
		this.u1_name=buffer.readString();
		this.u1_uuid=buffer.readString();
		this.u1_src='images/profiles/resize/'+this.u1_uuid+'.jpg';
		
		this.u2_name=buffer.readString();
		this.u2_uuid=buffer.readString();
		this.u2_src='images/profiles/resize/'+this.u2_uuid+'.jpg';
	}
	
	toString(){
		return "U1:"+this.u1+"("+this.u1_uuid+") U2:"+this.u2+"("+this.u2_uuid+")";
	}
}

class StartMatchPacket {
	
	parseFromInput(buffer){
		this.roulette_duration = buffer.readInt();
		this.roulette = buffer.readBoolean();
		this.u1_index = buffer.readInt();
		this.u2_index = buffer.readInt();
		this.u1_name=buffer.readString();
		this.u2_name=buffer.readString();
		
		let size = buffer.readInt();
		this.loaded=[];
		for(var i = 0; i < size; i++){
			let uuid = buffer.readString();
			var img = new Image();
			img.src='images/profiles/resize/'+uuid+'.jpg';
			this.loaded.push(img);
			
			if(i == this.u1_index){
				this.u1_uuid=uuid;
			}else if(i == this.u2_index){
				this.u2_uuid=uuid;
			}
		}
	}
	
	toString(){
		return "U1:"+this.u1+"("+this.u1_uuid+") U2:"+this.u2+"("+this.u2_uuid+")";
	}
}

class StatsAckPacket {
	
	parseFromInput(buffer){
		var length = buffer.readInt();
		this.list = [];
		
		for(var i = 0; i < length; i++){
			this.list.push({name:buffer.readString()
				, uuid:buffer.readString()
				, stats: this.parseFromInputStats(buffer)});
		}
	}
	
	parseFromInputStats(buffer){
		var length = buffer.readInt();
		var stats = [];
		
		for(var i = 0; i<length; i++){
			var key = buffer.readString();
			var type = buffer.readByte();
			var value;
			
			switch(type){
			case 1:
				value = buffer.readInt();
				break;
			case 2:
				value = buffer.readBoolean();
				break;
			default:
				console.log("Stats type "+type+" by key "+key+" not found!");
				break;
			}
			
			stats.push({'key':key, 'value': value});
		}
		return stats;
	}
	
	toString(){
		return "list:"+this.list.length;
	}
}