loadScript("games/packets.js");

class HigherLowerSearchChoosePacket{
	constructor(higher){
		this.higher=higher;
		this.id=HIGHERLOWERSEARCHCHOOSE;
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
			this.list.push({"request":buffer.readString(),"path":replaceAll(buffer.readString(),";","/"),"amount":buffer.readInt()});
		}
	}
	
	toString(){
		return "list:"+list.length;
	}
}

function replaceAll(str, find, replace) {
	  return str.replace(new RegExp(find, 'g'), replace);
	}