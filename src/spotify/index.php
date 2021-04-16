<?php 
define("PATH","../");
?>

<html>
	<head>
	  <title>Spotify Login</title>
	  <link rel="stylesheet" href="style.css">
	  <script src="<?=PATH?>vendor/buffer/bytebuffer.js"></script>
	  <script src="<?=PATH?>games/ConnectionHandler.js"></script>
	  <script src="<?=PATH?>vendor/jquery/jquery-3.4.1.min.js"></script>
	</head>
	
	<body>
	<div class="box" class="center">
	  	<div id="content" >
	  		<img src="img/logo.png" id="logo" alt="" width="321" height="263">
    	  	<br>
    	  	<br>
    	  	<br>
    	  	<div class="in">
    	  		<span>Bitte waehle Weise </span>
    		  	<select name="name" id="name">
    			  <option value="wohnzimmer">Wohnzimmer</option>
    			  <option value="keller">Keller</option>
    			</select>
    			<button type="button">HACK ME</button>
    	  	</div>
	  	</div>
<!-- 		<div id="loading" class="load_center"> -->
<!--         	<h1 id="loading_msg">Loading...</h1> -->
   <!--     	<img alt="load image" style="height: 256px; width: 256px;" class="load" src="<?=PATH?>images/load.png">
<!--         </div> -->
	  </div>
	<div id="background"></div>
	

    <script>
    function setLoading(s){
    	var load = document.getElementById('loading');
    	var content = document.getElementById('content');
    	load.style.display = (!s ? "none" : "");
    	content.style.display = (s ? "none" : "");
    }
    </script>
	<script>

// 	function initConnection(){
// 		connect(5000,
// 				function(){
			
// 				}, 
// 				function(packetId, buffer){
// 					switch(packetId){
					
					
// 					default:
// 						console.log("Packet "+packetId+" not found!");
// 						break;
// 					}
					
// 				});
// 	}

// 	$(document).ready(function(){
// 		window.initConnection=initConnection;
// 		initConnection();
// 	});
	</script>
	
	</body>
</html>