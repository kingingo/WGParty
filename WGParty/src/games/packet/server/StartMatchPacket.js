var STARTMATCH=0;

class StartMatchPacket {
	
	parseFromInput(buffer){
		this.u1_index = buffer.readInt();
		this.u2_index = buffer.readInt();
		this.u1_name=buffer.readString();
		this.u2_name=buffer.readString();
		
		let size = buffer.readInt();
		this.loaded=[];
		for(var i = 0; i < size; i++){
			let uuid = buffer.readString();
			var img = new Image();
			img.src='images/profiles/resize/'+uuid+'.jpg';
			this.loaded.push(img);
			
			if(i == this.u1_index){
				this.u1_uuid=uuid;
			}else if(i == this.u2_index){
				this.u2_uuid=uuid;
			}
		}
	}
	
	toString(){
		return "U1:"+this.u1+"("+this.u1_uuid+") U2:"+this.u2+"("+this.u2_uuid+")";
	}
}