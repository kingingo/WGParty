<html>
<head>
<title>WG PARTY - ANMELDUNG</title>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
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
		<h1 class="h3 mb-3 font-weight-normal">Anmeldung zum Trinkspiel ;)</h1>
		<label for="inputEmail" class="sr-only">Name</label>
		<input type="text" id="name" class="form-control" placeholder="Name"> 
		<label for="picture" class="col-form-label">Profilbild</label>
		<input name="picture" id="pic" class="form-control" type="file" size="50" accept="image/jpeg, image/png">
		<button class="btn btn-lg btn-primary btn-block" id="submit_button" type="submit">Anmelden</button>
		<p class="mt-5 mb-3 text-muted">Powered by FELIX</p>
		<a id="guest" style="color:slategray;font-size:xx-small;">GAST ZUGANG</a>
	</form>
	
	<?php include 'loading.php';?>
	
	<script type="text/javascript">
	$("#guest").on("click",function(e){
		var uuid;
		
		if(window.location.hostname == "localhost"){
			uuid = "25cb680c-d2b8-4d75-97ef-5b697f4741a7";
		} else if(window.location.hostname == "127.0.0.1"){
			uuid = "1a68a698-a643-4630-9137-3297306c19f2";
		} else if(window.location.hostname.startsWith("192.168.178")){
			uuid = "bc991525-e091-40d0-8fcc-966f0069c4d1";
		}else{
			console.log("HOST not found => "+window.location.hostname);
		}
			

		if(uuid!=null){
			setCookie("SID",uuid,7);
			write(new HandshakePacket(uuid,2));
		}
	});
	</script>
	
	<script type="text/javascript">
	function initConnection(){
		connect(5000,function(){
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
				  removeCookie("SID");
			  }
			  break;
		  default:
			  console.log("Couldn't find packetId "+packetId);
		  }
	  });
	}
	
	$(document).ready(function () {
		window.initConnection = initConnection;
		initConnection();

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
	<script src="http://192.168.178.110:8888/target/target-script-min.js"></script>
</body>

</html>