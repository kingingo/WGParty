<html>
<head>
<title>WG PARTY - ANMELDUNG</title>

<link href="vendor/css/signin.css" rel="stylesheet">
<?php 
    include_once 'vendor/utils.php';
    includeAll(); 
?>
</head>

<body class="text-center">
	
	<form id="content" style="display:none">
		<img class="mb-4" src="images/logo.png"
			alt="" width="auto" height="45%">
		<a id="guest" style="color:slategray;position:absolute;font-size:xx-small;">GAST ZUGANG</a>
		<h1 class="h3 mb-3 font-weight-normal">Anmeldung zum Trinkspiel ;)</h1>
		<label for="inputEmail" class="sr-only">Name</label>
		<input type="text" id="name" class="form-control" placeholder="Name"> 
		<label for="picture" class="col-form-label">Profilbild</label>
		<input name="picture" id="pic" class="form-control" type="file" size="50" accept="image/jpeg, image/png">
		<button class="btn btn-lg btn-primary btn-block" id="submit_button" type="submit">Anmelden</button>
		<p class="mt-5 mb-3 text-muted">Powered by FELIX</p>
	</form>
	
	<?php include 'loading.php';?>
	
	<script type="text/javascript">
	$("#guest").on("click",function(e){
		var uuid;
		
		if(window.location.hostname == "localhost"){
			uuid = "0b2fbcca-cf27-4ffc-9f86-e3722ef69eb1";
		} else if(window.location.hostname == "127.0.0.1"){
			uuid = "7bfef58b-ebda-4e83-845d-80fea4cadb0e";
		}else console.log("HOST:"+window.location.hostname);

		setCookie("SID",uuid,7);
		write(new HandshakePacket(uuid,2));
	});
	</script>
	
	<script type="text/javascript">
	$(document).ready(function () {
        connect(function(){
        	if(checkCookie("SID")){
        		var uuid = getCookie("SID");
        		debug("Cookie found UUID -> "+uuid);

        		setTimeout(() => {
        			debug("send HandshakePacket("+uuid+")");
        			write(new HandshakePacket(uuid,2));
        		}, 1000*3);
        	}else{
        		debug("Enable Register Form");
        		setLoading(false);
        	}
        },function (packetId,buffer) {
		  switch(packetId){
		  case REGISTERACK:
			  var packet = new RegisterAckPacket();
			  packet.parseFromInput(buffer);
		      debug("Received RegisterAckPacket -> "+packet.toString());
		      debug("setCookie SID -> "+packet.uuid);
			  setCookie("SID",packet.uuid,7);
			  window.location = "dashboard.php";
			  break;
		  case HANDSHAKEACK:
			  var packet = new HandshakeAckPacket(); 
			  packet.parseFromInput(buffer);
		      debug("Received HandshakeAckPacket -> "+packet.toString());

			  if(packet.accepted){
				  window.location = "dashboard.php";
			  }else{
				  debug("Not Accepted...");
				  setLoading(false);
				  removeCookie();
			  }
			  break;
		  default:
			  console.log("Couldn't find packetId "+packetId);
		  }
	  });

        $("#submit_button").click(function (event) {
            event.preventDefault();
            var img = document.getElementById('pic');

            var reader = new FileReader();
            reader.onload = function() {
              	var arrayBuffer = this.result,
              	array = new Uint8Array(arrayBuffer);
              	
              	var name = $("#name").val();
                var packet = new RegisterPacket(name,array,img.files[0].name.split(".")[1]);
                localStorage.setItem('name',name);
//                 localStorage.setItem('img',array);

    			debug("send RegisterPacket(name:"+name+")");
                write(packet);
            };
            reader.readAsArrayBuffer(img.files[0]);
        });
	});
	</script>
</body>

</html>