var COUNTDOWNACK=0;

class CountdownAckPacket {
	
	parseFromInput(buffer){
		this.time = buffer.readDouble();
		this.text = buffer.readString();
	}
	
	toString(){
		return "time:"+this.time;
	}
}