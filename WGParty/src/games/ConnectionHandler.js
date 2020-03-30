var socket;
var url = "192.168.178.21";//"localhost";

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
	
	socket.send(data.buffer);
}

function connect(onopen, onmessage){
	  socket = new WebSocket("ws://"+url+":8887");
	  socket.binaryType="arraybuffer";
	  // callback-Funktion wird gerufen, wenn die Verbindung erfolgreich
	  // aufgebaut werden konnte
	  
	  socket.onopen = function () {
		  debug("Verbindung wurde erfolgreich aufgebaut");
	  };

	  // callback-Funktion wird gerufen, wenn eine neue Websocket-Nachricht
	  // eintrifft
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
	    	  onopen();
	      }else if(packetId==PING){
	    	  write(new PongPacket());
	      }else{
		      onmessage(packetId, buffer);  
	      }
	  };
	  
	  // callback-Funktion wird gerufen, wenn ein Fehler auftritt
	  socket.onerror = function (errorEvent) {
	      console.log("Error! Die Verbindung wurde unerwartet geschlossen");
	  };

	  socket.onclose = function (closeEvent) {
		  setLoading(true);
	      console.log('Die Verbindung wurde geschlossen --- Code: ' + closeEvent.code + ' --- Grund: ' + closeEvent.reason);
	      // connect after 5 sec
	      setTimeout(function(){connect(onopen,onmessage)}, 5000);
	  };
  }

function loadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function debug(msg){
	console.log("DEBUG: "+msg);
}