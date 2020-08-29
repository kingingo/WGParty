class HigherLowerSearchChoosePacket{
	constructor(higher, leftIndex, rightIndex){
		this.higher=higher;
		this.leftIndex=leftIndex;
		this.rightIndex=rightIndex;
		this.id=HIGHERLOWERSEARCHCHOOSE;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeBoolean(this.higher);
		this.buffer.writeInt(this.leftIndex);
		this.buffer.writeInt(this.rightIndex);
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