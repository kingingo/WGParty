var COUNTER = 0;
class CounterPacket{
	
	constructor(time){
		this.time=time;
		this.id=COUNTER;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeFloat64(this.time);
		return this.buffer;
	}
	
}