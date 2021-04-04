class LadderClickPacket{
	
	constructor(uuid, pos, start, range, up, tries){
		this.uuid = uuid;
		this.pos=pos;
		this.start=start;
		this.up = up;
		this.range=range;
		this.tries=tries;
		this.id=LADDERCLICK;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeString(this.uuid);
		this.buffer.writeInt(this.pos);
		this.buffer.writeInt(this.start);
		this.buffer.writeInt(this.range);
		this.buffer.writeBoolean(this.up);
		this.buffer.writeInt(this.tries);
		return this.buffer;
	}
	
	parseFromInput(buffer){
		this.uuid = buffer.readString();
		this.pos = buffer.readInt();
		this.start = buffer.readInt();
		this.range = buffer.readInt();
		this.up = buffer.readBoolean();
		this.tries = buffer.readInt();
	}
	
	toString(){
		return "uuid:"+this.uuid+" pos:"+this.pos+" tries:"+this.tries;
	}
}