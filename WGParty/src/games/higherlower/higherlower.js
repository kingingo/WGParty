import "packets.js";

class HigherLower{
	
	constructor(callbackStart, callbackEnd){
		this.left=document.getElementById("left-half");
		this.left_request=document.getElementById("left_request");
		this.left_request_amount=document.getElementById("left_request_amount");
		this.right=document.getElementById("right-half");
		this.right_request=document.getElementById("right_request");
		this.right_request_amount=document.getElementById("right_request_amount");
		this.callbackStart = callbackStart;
		this.callbackEnd = callbackEnd;
		this.active=false;
	}
	
	onmessage(packetId, buffer){
		 if(active){
			 switch(packetId){
			 	case HIGHERLOWERSEARCHPACKET:
			 		var packet = new HigherLowerSearchPacket();
			 		packet.parseFromInput(buffer);
			 		
			 		//request, path, amount
			 		this.list = packet.list;
				 break;
			  default:
				  log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
	
	set(index){
		this.left.style="background-image: url("+list[index].path+");";
		this.left_request.innerHTML = list[index].request;
		
		this.right.style="background-image: url("+list[index-1].path+");";
		
	}
	
	end(){
		this.callbackEnd();
		this.active=false;
	}
	
	start(){
		this.active=true;
		this.callbackStart();
	
	}
	
	log(msg){
		console.log("HigherLower | "+msg);
	}
}