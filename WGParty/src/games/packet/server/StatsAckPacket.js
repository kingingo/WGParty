var STATSACK=0;

class StatsAckPacket {
	
	parseFromInput(buffer){
		var length = buffer.readInt();
		this.list = [];
		
		for(var i = 0; i < length; i++){
			this.list.push({name:buffer.readString(), uuid:buffer.readString(), wins:buffer.readInt(),loses:buffer.readInt()});
		}
	}
	
	toString(){
		return "list:"+this.list.length;
	}
}