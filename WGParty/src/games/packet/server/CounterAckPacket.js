var COUNTDOWNACK=0;

class CountdownAckPacket {
	
	parseFromInput(buffer){
		this.time = buffer.readDouble();
	}
	
	toString(){
		return "time:"+this.time;
	}
}