import "../packets.js";

HIGHERLOWERSEARCHCHOOSE=0;
HIGHERLOWERSEARCHPACKET=0;

class HigherLowerSearchChoosePacket{
	constructor(higher){
		this.higher=higher;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeBoolean(this.higher);
		return this.buffer;
	}
}

class HigherLowerSearchPacket {
	parseFromInput(buffer){
		var length = buffer.readInt();
		this.list = [];
		for(var i = 0; i < length; i++){
			list.push({"request":buffer.readString(),"path":buffer.readString(),"amount":buffer.readInt()});
		}
	}
	
	toString(){
		return "list:"+list.length;
	}
}