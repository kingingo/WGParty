loadScript("games/higherlower/packets.js");

class HigherLower extends Game{
	
	constructor(spectate,callbackStart, callbackEnd){
		super("HigherLower",spectate, callbackStart,callbackEnd);
	}
	
	answer(b){
		if(!this.spectate){
			var packet = new HigherLowerSearchChoosePacket(b,this.currentIndex, this.currentIndex+1);
			write(packet);
		}else{
			if(!(this.done[0][this.currentIndex/2] && this.done[1][this.currentIndex/2])){
				return;
			}
		}

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
				$("#hl_spec_"+tthis.currentIndex+"_"+tthis.table_id).html("✔");
				tthis.vs.innerHTML="✔";
				tthis.vs.style="background-color:green;";
			}else{
				//FALSCH
				$("#hl_spec_"+tthis.currentIndex+"_"+tthis.table_id).html("✘");
				tthis.vs.innerHTML="✘";
				tthis.vs.style="background-color:red;";
			}
			
			setTimeout(function(tthis){tthis.next();}.bind(null,tthis),500);
		}.bind(null,this),1000);
	}
	
	next(){
		this.log("LOG: "+this.currentIndex+" "+this.list.length);
		if( (this.currentIndex+2) > (this.list.length-1) ){
			$('#hl-end').show();
			$('#hl-board').hide();
			
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
	
	setspec(user_index, index, right){
		var el = document.getElementById("hl_spec_"+index+"_"+user_index);
		el.innerHTML = (right ? "✔" : "✘");
	}
	
	setPics(){
		if(this.spectate){
			$("#hl-higher").css("--images","");
			$("#hl-lower").css("--images","");
			
			for(var i = 0; i <= 1; i++){
				
				console.log("setPics: ");
				console.log("	User"+i+": "+(i==0?getName1():getName2()));
				console.log("	Index: "+(this.currentIndex/2));
				console.log("	higher: "+this.higher_users[i][this.currentIndex/2]);
				console.log("	set: "+(this.higher_users[i][this.currentIndex/2] ? "higher" : "lower"));
				console.log("	done: "+this.done[i][this.currentIndex/2]);
				
				var element = $("#hl-" + (this.higher_users[i][this.currentIndex/2] ? "higher" : "lower"));
				let _img = element.css("--images");
				let uuid = i == 0 ? getUUID1() : getUUID2();
				
				if(this.done[i][this.currentIndex/2]){
			 		 console.log("_img:"+_img);
			 		 if(_img!=undefined && _img.length>0){
			 			 _img+=", ";
				 		 element.css("--width","64px");
				 		 element.css("--bg-repeat","no-repeat, repeat");
			 		 }else{
				 		 element.css("--width","32px");
				 		 element.css("--bg-repeat","no-repeat");
			 		 }
			 		 
			 		 element.css("--images",(_img==undefined?"":_img)+"url('"+getProfileS(uuid,false)+"')");
				}
			}
		}
	}
	
	onmessage(packetId, buffer){
		 if(this.active){
			 switch(packetId){
			 	case HIGHERLOWERANSWERED:
					this.log("GOT HIGHERLOWERANSWERED");
		 		 var packet = new HigherLowerAnsweredPacket();
			 	 packet.parseFromInput(buffer);
				 	 
			 	 if(getUUID1() == packet.uuid){
			 		this.done[0][packet.index/2] = true;
			 		this.higher_users[0][packet.index/2] = packet.higher;
			 		console.log("USER1 "+getName1()+" higher:"+packet.higher);
			 		this.setspec(1, packet.index,packet.right);
			 	 }else if(getUUID2() == packet.uuid){
			 		this.done[1][packet.index/2] = true;
			 		this.higher_users[1][packet.index/2] = packet.higher;
			 		console.log("USER2 "+getName2()+" higher:"+packet.higher);
			 		this.setspec(2, packet.index,packet.right);
			 	 }
			 		
				 if(this.spectate){
				 	 if(this.currentIndex == packet.index){
				 		 this.setPics();
//				 		 var element = $("#hl-" + (packet.higher ? "higher" : "lower"));
//				 		 let _img = element.css("--images");
//				 		 
//				 		 console.log("_img:"+_img);
//				 		 if(_img!=undefined && _img.length>0){
//				 			 _img+=", ";
//					 		 element.css("--width","64px");
//					 		 element.css("--bg-repeat","no-repeat, repeat");
//				 		 }else{
//					 		 element.css("--width","32px");
//					 		 element.css("--bg-repeat","no-repeat");
//				 		 }
//				 		 
//				 		 element.css("--images",(_img==undefined?"":_img)+"url('"+getProfileS(packet.uuid,false)+"')");
				 	 }
				 }
				 break;
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
		if(this.spectate)
			this.setPics();
	}
	
	end(){
		super.end();
	}
	
	numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	start(containerId){
		super.start(containerId);
		document.getElementById(containerId).innerHTML = "";
		
		$.get("games/higherlower/index.php", function (tthis, data) {
            $("#"+containerId).append(data);
			$('#hl-end').hide();
			$("#hl_spec_1").html(getName1());
			$("#hl_spec_2").html(getName2());
			
			if(tthis.spectate){
				tthis.table_id = 3;
			}else{
				$("#hl_spec_3").remove();
				$("#hl_spec_0_3").remove();
				$("#hl_spec_2_3").remove();
				$("#hl_spec_4_3").remove();

				if(getUUID() == getUUID1()){
					tthis.table_id=1;
				}else if(getUUID() == getUUID2()){
					tthis.table_id=2;
				}
			}
			$("#hl_spec_"+tthis.table_id).html(getName());
			
			tthis.done = [[false,false,false],[false,false,false]];
			tthis.higher_users = [[false,false,false],[false,false,false]];
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
        }.bind(null,this));
		
//		if(this.spectate){
//			$.get("games/higherlower/spectate.php", function (tthis, data) {
//	            $("#"+containerId).append(data);
//	            document.getElementById('hl_spec_1').innerHTML = localStorage.getItem('p1_name');
//	            document.getElementById('hl_spec_2').innerHTML = localStorage.getItem('p2_name');
//	    		tthis.callbackStart();
//			}.bind(null,this));
//		}else{
//			$.get("games/higherlower/index.php", function (tthis, data) {
//	            $("#"+containerId).append(data);
//	            tthis.left=document.getElementsByClassName("hl-left-half")[0];
//	            tthis.left_request=document.getElementById("hl-left_request");
//	            tthis.left_request_amount=document.getElementById("hl-left_request_amount");
//
//	            tthis.right=document.getElementsByClassName("hl-right-half")[0];
//	            tthis.right_request=document.getElementById("hl-right_request");
//	            tthis.right_request_amount=document.getElementById("hl-right_request_amount");
//	    		
//	    		//Buttons
//	            tthis.higher = document.getElementById('hl-higher');
//	    		if(tthis.higher!=null)tthis.higher.addEventListener("click", function(){tthis.answer(true);});
//	    		else tthis.log('higher null');
//	    		tthis.lower = document.getElementById('hl-lower');
//	    		if(tthis.lower!=null)tthis.lower.addEventListener("click", function(){tthis.answer(false);});
//	    		else tthis.log('lower null');
//	    		
//	    		tthis.vs = document.getElementById('hl-vs');
//
//	    		tthis.callbackStart();
//	        }.bind(null,this));
//		}
	}
}