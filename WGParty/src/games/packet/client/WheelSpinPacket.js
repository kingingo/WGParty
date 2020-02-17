var WHEELSPIN = 0;
class WheelSpinPacket{
	
	constructor(rand){
		this.rand=rand;
		this.id=WHEELSPIN;
	}
	
	parseFromInput(buffer){
		this.rand = buffer.readFloat32();
	}
	
	parseToOutput(){
		this.buffer = new dcodeIO.ByteBuffer(8,false,false);
		this.buffer.writeFloat32(this.rand);
		return this.buffer;
	}
	
	toString(){
		return "rand:"+this.rand;
	}
	
}