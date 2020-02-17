var COUNTDOWNACK=0;

class CountdownAckPacket {
	
	parseFromInput(buffer){
		this.time = buffer.readFloat64();
	}
	
	toString(){
		return "time:"+this.time;
	}
}