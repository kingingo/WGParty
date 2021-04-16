<?php
function includeFavicon(){
    echo '<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.ico" type="image/x-icon">';
}


function includeWheel(){
    echo '<link href="vendor/wheel/wheel.css" rel="stylesheet">
		<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
		<script src="vendor/wheel/wheel.js"></script>
        <script src="vendor/roulette/roulette.js"></script>
        <script src="vendor/profile/profile.js"></script>';
}

function includeProfile(){
    echo '<link href="vendor/profile/profile.css" rel="stylesheet">';
    echo '<script src="vendor/profile/profile.js"></script>';
}

function setMatch(){
    echo '
    <div class="profileContainer">
		<div class="profile" id="p1">
			<img alt="loser" id="p1_loser" class="loser" src="images/loser.png">
    		<img alt="krone" id="p1_krone" class="krone" src="images/knossiKrone.png">
        	<p id="p1_name"></p>
		</div>
		<div id="p1_roulette" class="profile"></div>
		<img alt="vs" class="vs" src="images/vs.png">
		<div class="profile" id="p2">
			<img alt="loser" id="p2_loser" class="loser" src="images/loser.png">
    		<img alt="krone" id="p2_krone" class="krone" src="images/knossiKrone.png">
        	<p id="p2_name"></p>
		</div>
		<div id="p2_roulette" class="profile"></div>
	</div>';
}

function includeCounter(){
    echo '<link href="vendor/countdown/countdown.css" rel="stylesheet">
		<script src="vendor/countdown/countdown.js"></script>';
}

function includeWord(){
    echo '<link href="vendor/word/word.css" rel="stylesheet"><script src="vendor/word/word.js"></script>';
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
    includeFavicon();
    includeBootstrap();
    echo '<link href="vendor/css/style.css" rel="stylesheet">';
    echo '<script src="vendor/buffer/bytebuffer.js"></script>';
    echo '<script type="text/javascript" src="vendor/cookies/cookies.js"></script>';
    echo '<script src="games/ConnectionHandler.js"></script>';
    includePackets();
}

function includePackets(){
    echo '<script src="games/packet/client/packets.js"></script>';
    echo '<script src="games/packet/server/packets.js"></script>';
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

function getProfile(uuid){
	return "/images/profiles/resize/"+uuid+"_"+window.profile_size+".jpg";
}

function getName2(){
	return localStorage.getItem('p2_name');
}

function getName1(){
	return localStorage.getItem('p1_name');
}

function getUUID2(){
	return localStorage.getItem('p2_uuid');
}

function getUUID1(){
	return localStorage.getItem('p1_uuid');
}

function rand(min,max){
	return Math.floor((Math.random() * max) + min);
}

function getUUIDO(){
	if(localStorage.getItem('p1_uuid') == getUUID()){
		return localStorage.getItem('p2_uuid');
	}
	return localStorage.getItem('p1_uuid');
}

function getUUID(){
	return getCookie("SID");
}

var cookieCheck=function(){
	if(typeof this.game !== 'undefined'){
		this.game.cancel();
		this.game.end();
	}
	
	if(checkCookie("SID")){
		var uuid = getCookie("SID");
		debug("Cookie found UUID -> "+uuid);

// 		setTimeout(() => {
			debug("send HandshakePacket("+uuid+")");
			write(new HandshakePacket(uuid,3));
// 		}, 1000*5);
	}else{
		removeCookie("SID");
		window.location = "http://"+url+"/";
	}
}
</script>