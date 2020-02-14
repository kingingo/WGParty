<?php
function includeWheel(){
    echo '<link href="vendor/wheel/wheel.css" rel="stylesheet">
		<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
		<script src="vendor/wheel/wheel.js"></script>';
}

function includeProfile(){
    echo '<link href="vendor/css/profile.css" rel="stylesheet">';
}

function setMatch(){
    echo '
    <div class="profileContainer">
    <div class="profile" id="p1">
		<img hidden alt="loser" id="p1_loser" class="loser" src="images/loser.png">
    	<img alt="krone" id="p1_krone" class="krone" src="images/knossiKrone.png">
	</div>
    <img alt="vs" class="vs" src="images/vs.png">
    <div class="profile" id="p2">
		<img alt="loser" id="p2_loser" class="loser" src="images/loser.png">
    	<img hidden alt="krone" id="p2_krone" class="krone" src="images/knossiKrone.png">
	</div>
    </div>';
}

function includeCounter(){
    echo '<link href="vendor/countdown/countdown.css" rel="stylesheet">
		<script src="vendor/countdown/countdown.js"></script>';
}

function includeTable(){
    echo '<script src="vendor/table/table.js"></script>';
}

function includeBootstrap(){
    echo '<script src="vendor/jquery/jquery-3.4.1.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">';
}

function includeAll(){
    includeBootstrap();
    echo '<link href="vendor/css/style.css" rel="stylesheet">';
    echo '<script src="vendor/buffer/bytebuffer.js"></script>';
    echo '<script type="text/javascript" src="vendor/cookies/cookies.js"></script>';
    echo '<script src="games/ConnectionHandler.js"></script>';
    includePackets();
}

function includePackets(){
    includePath("games/packet/client/");
    includePath("games/packet/server/");
}

function includePath($path){
    $handle=opendir($path);
    
    while (($file = readdir($handle))!==false) {
        if(strpos(basename($file),'.js')){
            echo '<script type="text/javascript" src="'.$path.'/'.$file.'"></script>';
        }
        
    }
    
    closedir($handle);
}
?>

<script>
var cookieCheck=function(){
	if(checkCookie("SID")){
		var uuid = getCookie("SID");
		debug("Cookie found UUID -> "+uuid);

// 		setTimeout(() => {
			debug("send HandshakePacket("+uuid+")");
			write(new HandshakePacket(uuid));
// 		}, 1000*5);
	}else{
		window.location = "http://localhost/";
	}
}
</script>