var COUNTERACK=0;

class CounterAckPacket {
	
	parseFromInput(buffer){
		this.time = buffer.readFloat64();
	}
	
	toString(){
		return "time:"+this.time;
	}
}