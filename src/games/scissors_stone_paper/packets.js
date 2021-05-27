class SSPSettingsPacket{
	constructor(){
		this.id=SSPSETTINGS;
	}
	
	parseToOutput(){}
	
	parseFromInput(buffer){
		this.start = buffer.readDouble();
	}
	
	toString(){
		return "start:"+this.start;
	}
}

class SSPChoosePacket{
	constructor(choose){
		this.choose = choose;
		this.id=SSPCHOOSE;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeUInt8(this.choose);
		return this.buffer;
	}
	
	parseFromInput(buffer){
		this.choose = buffer.readUInt8();
		this.uuid = buffer.readString();
	}
	
	toString(){
		return "uuid:"+this.uuid+" user_y:"+this.user_y;
	}
}

