var websocket;
var url = "192.168.178.110";
var server_ip = "192.168.178.110:8887";

function write(packet){
	var b = packet.parseToOutput();
	var id = packet.id;
	var data = new dcodeIO.ByteBuffer(8,false,false);
	var relative = (typeof b === 'undefined');
	
	if(relative){
		data.writeInt(0);
	}else{
		data.writeInt(b.capacity());
	}
	data.writeInt(id);
	data.resizeNormal = false;
	
	if(!relative)data.writeBytes(b.buffer);
	
	websocket.send(data.buffer);
}

function connect(timeout = 2000,onopen, onmessage){
	new Promise(function(resolve, reject) {
		debug("try to connect to "+server_ip+"... (timeout:"+timeout+")");
		const socket = new WebSocket("ws://"+server_ip);
			
	      const timer = setTimeout(function() {
	          done();
	          socket.close();
	          reject(new Error("webSocket timeout"));
	      }, timeout);
        
        function done() {
            // cleanup all state here
            clearTimeout(timer);
            socket.removeEventListener('error', error);
        }

        function error(e) {
            reject(e);
            done();
        }

        socket.addEventListener('open', function() {
            resolve(socket);
            done();
        });
        socket.addEventListener('error', error);
        
        socket.onopen = function () {
  		  debug("connection established");
  	  };

	  socket.binaryType="arraybuffer";
  	  socket.onmessage = function(messageEvent){
  		  var data = messageEvent.data;
  	      var buffer = dcodeIO.ByteBuffer.wrap(data,"binary",false,false);

  	      buffer.readInt();
  	      var packetId = buffer.readInt();
  	      
  	      if(packetId==0){
  	    	  var packet = new IdsPacket();
  	    	  packet.parseFromInput(buffer);
  	    	  debug("Received IdsPacket("+packet.toString()+")");
  	    	  var list = packet.list;
  	    	  
  	    	  for(var i = 0; i < list.length; i++){
  	    		  window[list[i].packet]=list[i].id;
  	    		  debug(list[i].packet+" set id to "+ window[list[i].packet]);
  	    	  }
  	    	  window['LIST_IDS'] = list;
  	    	  onopen();
  	      }else if(packetId==PING){
  	    	  write(new PongPacket());
  	      }else{
  	    	  
  	    	  for(var i = 0; i < window.LIST_IDS.length; i++){
  	    		  if(window.LIST_IDS[i].id == packetId){
  	    			  debug("REC PACKET:"+window.LIST_IDS[i].packet+" packetId:"+packetId);
  	    			  break;
  	    		  }
  	    	  }
  	    	  
  	    	  
  		      onmessage(packetId, buffer);  
  	      }
  	  };
  	  
  	  // callback-Funktion wird gerufen, wenn ein Fehler auftritt
  	  socket.onerror = function (errorEvent) {
  		  debug("Error! The connection was unexpectedly closed --- Code: '" + errorEvent.code + " --- Reason: " +errorEvent.reason);
  	  };

  	  socket.onclose = function (closeEvent) {
  		  setLoading(true);
  		  debug('The connection was closed --- Code: ' + closeEvent.code + ' --- Reason: ' + closeEvent.reason);
  	      socket.close();
		  window.initConnection();
  	  };
	}).then(function(socket) {
		   window.websocket = socket;
	}).catch(function(err) {
	    console.log(err);
	});
}

function loadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function debug(msg){
	console.log("DEBUG: "+msg);
}

class Game{
	constructor(game,spectate, callbackStart, callbackEnd){
		this.active=false;
		this.game=game;
		this.spectate=spectate;
		this.callbackEnd = callbackEnd;
		this.callbackStart = callbackStart;
		this.cancelCallbackEnd = false;
	}
	
	cancel(){
		this.cancelCallbackEnd=true;
	}
	
	clear(){
		console.log("GAME CLEAR CLEAR!!!!");
		$('#'+this.containerId).html("");
	}
	
	end(){
		if(!this.cancelCallbackEnd)
			this.callbackEnd();
		this.active=false;
	}
	
	start(containerId){
		this.active=true;
		this.containerId=containerId;
	}
	
	log(msg){
		console.log(this.game+" | "+msg);
	}
}