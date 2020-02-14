IDS=0;

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