var STATS = 0;
class StatsPacket{
	
	constructor(update){
		this.update=update;
		this.id=STATS;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(1,false,false);
		this.buffer.writeInt((this.update ? 1 : 0));
		return this.buffer;
	}
	
}