var COUNTDOWN = 0;
class CountdownPacket{
	
	constructor(time){
		this.time=time;
		this.id=COUNTDOWN;
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeDouble(this.time);
		return this.buffer;
	}
	
}