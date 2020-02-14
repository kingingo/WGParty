var socket;

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
	  socket = new WebSocket("ws://localhost:8887");
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
	      
	      if(packetId==IDS){
	    	  var packet = new IdsPacket();
	    	  packet.parseFromInput(buffer);
	    	  debug("Received IdsPacket("+packet.toString()+")");
	    	  var list = packet.list;
	    	  
	    	  for(var i = 0; i < list.length; i++){
	    		  window[list[i].packet]=list[i].id;
	    		  debug(list[i].packet+" set id to "+list[i].id == window[list[i].packet]);
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

function debug(msg){
	console.log("DEBUG: "+msg);
}