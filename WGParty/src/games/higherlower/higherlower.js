loadScript("games/higherlower/packets.js");

class HigherLower{
	
	constructor(callbackStart, callbackEnd){
		this.active=false;
		this.callbackStart = callbackStart;
		this.callbackEnd = callbackEnd;
	}
	
	answer(b){
		var packet = new HigherLowerSearchChoosePacket(b,this.currentIndex, this.currentIndex+1);
		write(packet);

		this.right_request_amount.innerHTML = this.numberWithCommas(this.right_pic.amount);
		if(this.right_pic.amount > this.left_pic.amount){
			this.higher.style="background-color:green;";
			this.lower.style="background-color:red;";
		}else{
			this.higher.style="background-color:red;";
			this.lower.style="background-color:green;";
		}
		
		setTimeout(function(tthis){
			tthis.hide();
			if((tthis.right_pic.amount > tthis.left_pic.amount) == b){
				//RICHTIG
				tthis.vs.innerHTML="✔";
				tthis.vs.style="background-color:green;";
			}else{
				//FALSCH
				tthis.vs.innerHTML="✘";
				tthis.vs.style="background-color:red;";
			}
			
			setTimeout(function(tthis){tthis.next();}.bind(null,tthis),500);
		}.bind(null,this),1000);
	}
	
	next(){
		this.log("LOG: "+this.currentIndex+" "+this.list.length);
		if( (this.currentIndex+2) > (this.list.length-1) ){
			this.end();
		}else{
			this.set(this.currentIndex+2);
		}
	}
	
	reset(){
		this.vs.innerHTML="";
		this.vs.style="";

		this.higher.style="";
		this.lower.style="";
	}
	
	hide(){
		$('#hl-higher').hide();
		$('#hl-lower').hide();
		
		$('#hl-right_request_amount').show();
	}
	
	show(){
		$('#hl-higher').show();
		$('#hl-lower').show();
		
		$('#hl-right_request_amount').hide();
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			 	case HIGHERLOWERSEARCH:
					this.log("GOT HIGHERLOWERSEARCH");
			 		var packet = new HigherLowerSearchPacket();
			 		packet.parseFromInput(buffer);
			 		
			 		//request, path, amount
			 		this.list = packet.list;
			 		this.set(0);
				 break;
			  default:
				  this.log("Packet "+packetId+" not found");
				  break;
			 }
		 }
	}
	
	set(index){
		this.reset();
		this.show();
		this.currentIndex = index;
		this.log("Set "+index);
		this.left_pic = this.list[this.currentIndex];
		this.right_pic = this.list[this.currentIndex+1];
		
		this.left.style="background-image: url("+this.left_pic.path+");";
		this.left_request.innerHTML = this.left_pic.request;
		this.left_request_amount.innerHTML = this.numberWithCommas(this.left_pic.amount);
		
		this.right.style="background-image: url("+this.right_pic.path+");";
		this.right_request.innerHTML = this.right_pic.request;
	}
	
	end(){
		this.callbackEnd();
		this.active=false;
		
		$('#'+this.containerId).html("");
	}
	
	numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	start(containerId){
		this.active=true;
		this.containerId=containerId;
		$.get("games/higherlower/index.php", function (tthis, data) {
            $("#"+containerId).append(data);
            tthis.left=document.getElementsByClassName("hl-left-half")[0];
            tthis.left_request=document.getElementById("hl-left_request");
            tthis.left_request_amount=document.getElementById("hl-left_request_amount");

            tthis.right=document.getElementsByClassName("hl-right-half")[0];
            tthis.right_request=document.getElementById("hl-right_request");
            tthis.right_request_amount=document.getElementById("hl-right_request_amount");
    		
    		//Buttons
            tthis.higher = document.getElementById('hl-higher');
    		if(tthis.higher!=null)tthis.higher.addEventListener("click", function(){tthis.answer(true);});
    		else tthis.log('higher null');
    		tthis.lower = document.getElementById('hl-lower');
    		if(tthis.lower!=null)tthis.lower.addEventListener("click", function(){tthis.answer(false);});
    		else tthis.log('lower null');
    		
    		tthis.vs = document.getElementById('hl-vs');
    		
    		tthis.callbackStart();
    		
    		var packet = new GameStartAckPacket();
    		write(packet);
    		tthis.log("write GameStartAckPacket to Server");
        }.bind(null,this));
	}
	
	log(msg){
		console.log("HigherLower | "+msg);
	}
}