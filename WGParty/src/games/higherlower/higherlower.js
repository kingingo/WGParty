loadScript("games/higherlower/packets.js");

class HigherLower{
	
	constructor(callbackStart, callbackEnd){
		this.active=false;
		this.callbackStart = callbackStart;
		this.callbackEnd = callbackEnd;
	}
	
	answer(b){
		var packet = new HigherLowerSearchChoosePacket(b);
		write(packet);

		this.right_request_amount.innerHTML = this.list[this.currentIndex].amount;
		if(this.list[this.currentIndex].amount > this.list[this.currentIndex-1].amount){
			this.higher.style="background-color:green;";
			this.lower.style="background-color:red;";
		}else{
			this.higher.style="background-color:red;";
			this.lower.style="background-color:green;";
		}
		
		this.hide();
		if((this.list[this.currentIndex].amount > this.list[this.currentIndex-1].amount) == b){
			//RICHTIG
			this.vs.innerHTML="✔";
			this.vs.style="background-color:green;";
		}else{
			//FALSCH
			this.vs.innerHTML="✘";
			this.vs.style="background-color:red;";
		}
	}
	
	hide(){
		$('#higher').hide();
		$('#lower').hide();
		
		$('#right_request_amount').show();
	}
	
	show(){
		$('#higher').show();
		$('#lower').show();
		
		$('#right_request_amount').hide();
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			 	case HIGHERLOWERSEARCH:
			 		var packet = new HigherLowerSearchPacket();
			 		packet.parseFromInput(buffer);
			 		
			 		//request, path, amount
			 		this.list = packet.list;
			 		this.set(1);
				 break;
			  default:
				  log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
	
	set(index){
		this.currentIndex = index;
		//background-image: url('http://api.higherlowergame.com/_client/images/general/truman-show.jpg');
		console.log("SETTED");
		this.left.style="background-image: url("+this.list[index-1].path+");";
		console.log("SETTED "+this.left.style);
		this.left_request.innerHTML = this.list[index-1].request;
		this.left_request_amount.innerHTML = this.list[index-1].amount;
		
		this.right.style="background-image: url("+this.list[index].path+");";
		this.right_request.innerHTML = this.list[index].request;
	}
	
	end(){
		this.callbackEnd();
		this.active=false;
		
		$('#'+this.containerId).html("");
	}
	
	start(containerId){
		this.active=true;
		this.containerId=containerId;
		$.get("games/higherlower/index.php", function (tthis, data) {
            $("#"+containerId).append(data);
            tthis.left=document.getElementsByClassName("left-half")[0];
            tthis.left_request=document.getElementById("left_request");
            tthis.left_request_amount=document.getElementById("left_request_amount");

            tthis.right=document.getElementsByClassName("right-half")[0];
            tthis.right_request=document.getElementById("right_request");
            tthis.right_request_amount=document.getElementById("right_request_amount");
    		
    		//Buttons
            tthis.higher = document.getElementById('higher');
    		if(tthis.higher!=null)tthis.higher.addEventListener("click", function(){tthis.answer(true);});
    		else console.log('higher null');
    		tthis.lower = document.getElementById('lower');
    		if(tthis.lower!=null)tthis.lower.addEventListener("click", function(){tthis.answer(false);});
    		else console.log('lower null');
    		
    		tthis.vs = document.getElementById('vs');
    		
    		tthis.callbackStart();
    		tthis.show();
    		
    		var packet = new GameStartAckPacket();
    		write(packet);
        }.bind(null,this));
	}
	
	log(msg){
		console.log("HigherLower | "+msg);
	}
}