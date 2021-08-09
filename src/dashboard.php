<?php
define("PATH","test");
?>

<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>WG PARTY - DASHBOARD</title>
<link href="vendor/css/dashboard.css" rel="stylesheet">
<script src="vendor/explosion/explosion.js" type="text/javascript"></script>
		<?php
include_once 'vendor/utils.php';
includeAll();
includeTable();
includeWheel();
includeWord();
includeProfile();
?>
<script src="games/higherlower/higherlower.js" type="text/javascript"></script>
<script src="games/pingpong/pingpong.js" type="text/javascript"></script>
<script src="games/ladder/ladder.js" type="text/javascript"></script>
<script src="games/blackorred/blackORred.js" type="text/javascript"></script>
<script src="games/scissors_stone_paper/scissorsstonepaper.js" type="text/javascript"></script>
</head>

<body class="text-center">
	<div id="content" style="display: none;">
		<img src="" class="mini-profile desktop" id="mini-profile-desktop" alt="Italian Trulli">

		<div class="word" id="dashboard"></div>
		<div class="word" id="ingame"></div>
		<?php include 'vendor/countdown/countdown.html'; ?>
		<hr>
		<div class="mobile" id="mobile">
			<div class="container">
              <div class="row">
                <div class="col-6">
                  <p>Gewonnen</p>
        	      <p>1</p>
        		  <p>Drinks</p>
        		  <p>10</p>
                </div>
                <div class="col-6">
                  <img src="" class="mini-profile" id="mini-profile" alt="Italian Trulli">
                </div>
              </div>
              <div class="row">
                <div class="col" style="height:100px">
                    <input type="checkbox" id="switch-checkbox">
        
                    <label id="switch" for="switch-checkbox">
                      <div id="switch-img"></div>
                      <div id="switch-spectate">Spectate</div>
                      <div id="switch-play">Play</div>
                    </label>
                </div>
              </div>
              <div style="margin-bottom: 10px;" class="row">
<!--                 <div class="col"> -->
<!--                	<div style="background-image: url(https://i.scdn.co/image/ab67616d000048519627438b25cb1f1839613bda);width:64px;height:64px;"></div> -->
<!--                 </div> -->
              </div>
              <div id="player_list" class="row"></div>
            </div>
		</div>
		
		<table class="center desktop" id="table">
			<tr>
				<th>Player</th>
				<th onclick="sortTable(1)" style="cursor:pointer;">Wins</th>
				<th onclick="sortTable(2)" style="cursor:pointer;">Drinks</th>
			</tr>
		</table>
		<!-- Ready Stage -->
		<div id="stage0" class="stage0">
			<div class="left" id="left-stage0" style="background-color:red;">
				<button id="left-ready">READY</button>
				<img src="" id="left-mini-profile" alt="Italian Trulli">
			</div>
			<div class="right" id="right-stage0" style="background-color:blue;">
				<button disabled id="right-ready">READY</button>
				<img src="" id="right-mini-profile" alt="Italian Trulli">
			</div>
		</div>
		<div id="stage1">
			<?php setMatch(); ?>
			<?php include 'vendor/wheel/wheel.html';?>
		</div>
		<div id="stage2"></div>
	</div>
	
		<?php include 'loading.php';?>
		<?php includeCounter(); ?>
		<script type="text/javascript">

		function getStackTrace () {

			  var stack;

			  try {
			    throw new Error('');
			  }
			  catch (error) {
			    stack = error.stack || '';
			  }

			  stack = stack.split('\n').map(function (line) { return line.trim(); });
			  return stack.splice(stack[0] == 'Error' ? 2 : 1);
			}
		
			
			function toggle(v){
				console.log("TOGGLE() to "+v);
				console.log(getStackTrace().join('\n'));
				switch(v){
				case 'dashboard':
					$('#dashboard').show();
					$('#ingame').hide();
					break;
				case 'ingame':
					$('#ingame').show();
					$('#dashboard').hide();
					break;
				case 'table':
					removeWheel();
					$(window.mobile ? '#mobile' : '#table').show();
					$('#stage0').hide();
					$('#stage1').hide();
					$('#stage2').hide();
					break;
				case 'stage0':
					hideStatus();
					$(window.mobile ? '#mobile' : '#table').hide();
					$('#stage0').show();
					$('#stage1').hide();
					$('#stage2').hide();
					break;
				case 'stage1':
					$(window.mobile ? '#mobile' : '#table').hide();
					$('#stage0').hide();
					$('#stage1').show();
					if(window.game==null)
						$('#stage2').hide();
					else
						$('#stage2').show();
					break;
				case 'stage2':
					hideStatus();
					$(window.mobile ? '#mobile' : '#table').hide();
					$('#stage0').hide();
					$('#stage1').hide();
					$('#stage2').show();
					break;
				}
			}

			function init(){
				$("#switch-checkbox").on("click",function(e){
					var packet = new SpectatePacket(!this.checked);
					write(packet);
				});
				$("#ready").on("click", function(e){
					$("#ready").hide();
					var packet = new PlayerReadyPacket();
					write(packet);
				});
				
				setWord('dashboard','DASHBOARD');
				setWord('ingame','INGAME','lightgreen');
				toggle('dashboard');
				toggle('table');
			}
			init();
			
			function initConnection(){
				connect(5000,cookieCheck,function(packetId, buffer){
					switch(packetId){
					case READY:
						if(this.p1_r != undefined)
							this.p1_r.roulette('reset');
						if(this.p2_r != undefined)
							this.p2_r.roulette('reset');
						
						$("#left-stage0").css("background-color","red");
						$("#right-stage0").css("background-color","blue");
						var func = function(id){
							$("#"+id+"-stage0").css("background-color","green");
							$("#"+id+"-ready").prop('disabled', true);
							write(new PlayerReadyPacket());
							console.log("SEND PlayerReadyPacket");
						};
						
						if(getUUID1() == getUUID()){
							$("#left-ready").prop('disabled', false);
							$("#left-ready").unbind("click").click(func.bind(null,"left"));
						}else{
							$("#left-ready").prop('disabled', true);
						}

						if(getUUID2() == getUUID()){
							$("#right-ready").prop('disabled', false);
							$("#right-ready").unbind("click").click(func.bind(null,"right"));
						}else{
							$("#right-ready").prop('disabled', true);
						}
						
						$("#left-mini-profile").attr("src",getProfile(getUUID1()));
						$("#right-mini-profile").attr("src",getProfile(getUUID2()));
						
						toggle('stage0');
						break;
					case TOGGLESTAGE:
						var packet = new ToggleStagePacket();
						packet.parseFromInput(buffer);
						console.log("RECEIVED TogglePacket "+packet.stage);
						toggle(packet.stage);
						break;
					case PLAYERREADYACK:
						var packet = new PlayerReadyAckPacket();
						packet.parseFromInput(buffer);
						console.log("RECEIVED PlayerReadyAckPacket");

						if(packet.uuid != getUUID() || packet.force){
							console.log("ENTERED PlayerReadyAckPacket");
							if(packet.uuid == getUUID1()){
								$("#left-stage0").css("background-color","green");

								if(packet.force && getUUID1() == getUUID()){
									$("#left-ready").prop('disabled', true);
								}
							}else if(packet.uuid == getUUID2()){
								$("#right-stage0").css("background-color","green");

								if(packet.force && getUUID2() == getUUID()){
									$("#right-ready").prop('disabled', true);
								}
							}else{
								console.log("PLAYERREADYACK uuid "+packet.uuid+" id passt nicht");
								console.log(getStackTrace().join('\n'));
							}
						}
						 break;
					case SETMATCH:
						var packet = new SetMatchPacket();
						packet.parseFromInput(buffer);

						localStorage.setItem('p1_uuid',packet.u1_uuid);
						localStorage.setItem('p1_name',packet.u1_name);
						
						localStorage.setItem('p2_uuid',packet.u2_uuid);
						localStorage.setItem('p2_name',packet.u2_name);

						stopCallbackProfile(packet.u1_src,"p1", true);
						stopCallbackProfile(packet.u2_src,"p2", true);
						break;
					case STARTMATCH:
						var packet = new StartMatchPacket();
						packet.parseFromInput(buffer);

						if(this.game!=null)
							this.game.clear();
						hideStatus();

						localStorage.setItem('p1_uuid',packet.u1_uuid);
						localStorage.setItem('p1_name',packet.u1_name);
						
						localStorage.setItem('p2_uuid',packet.u2_uuid);
						localStorage.setItem('p2_name',packet.u2_name);

						
						this.p1_r = $('#p1_roulette');
						if(this.p1_r.data('plugin_roulette'))
							this.p1_r.roulette('remove');
						this.p1_r.empty();
						for(var i = 0; i < packet.loaded.length; i++)
							this.p1_r.append(packet.loaded[i]);
						
						this.p1_r.roulette({
							id: "p1",
							speed : 10,
							duration : packet.roulette ? packet.roulette_duration : 0,
							stopImageNumber : packet.u1_index,
							startCallback : function(options) {
								startCallbackProfile(options.id);
							},
							slowDownCallback : function() {
							},
							stopCallback : function($stopElm,options) {
								console.log('stop '+$stopElm.attr('src'));
								stopCallbackProfile($stopElm.attr('src'),options.id, true);
								$('#'+options.id+'_roulette').roulette('remove');
							}
						});
						
						this.p2_r = $('#p2_roulette');
						if(this.p2_r.data('plugin_roulette'))
							this.p2_r.roulette('remove');
						this.p2_r.empty();
						let img;
						for(var i = 0; i < packet.loaded.length; i++){
							img = new Image();
							img.src = packet.loaded[i].src;
							this.p2_r.append(img);
						}
						this.p2_r.roulette({
							id: "p2",
							speed : 10,
							duration :  packet.roulette ? packet.roulette_duration : 0,
							stopImageNumber : packet.u2_index,
							startCallback : function(options) {
								startCallbackProfile(options.id);
							},
							slowDownCallback : function() {
							},
							stopCallback : function($stopElm,options) {
								let src = $stopElm.attr('src');
								if(window.mobile)
									src=replaceAll(src, "256x256","128x128");
								
								console.log('stop '+src);
								stopCallbackProfile($stopElm.attr('src'),options.id, true);
								$('#'+options.id+'_roulette').roulette('remove');
							}
						});

						$('#p1').hide();
						$('#p2').hide();
						toggle('stage1');
						toggle('ingame');

						if(packet.roulette){
							setTimeout(function(){
								this.p1_r.roulette('start');
							},3000);
							setTimeout(function(){
								this.p2_r.roulette('start');
							},1500);
						}else{
							this.p1_r.roulette('start');
							this.p2_r.roulette('start');
						}
						
						break;
					case WHEELSPIN:
						var packet = new WheelSpinPacket();
						packet.parseFromInput(buffer);
						debug("Received WheelSpinPacket "+packet.toString())
						spin(packet.rand);
						break;
					case MATCH:
						var packet = new MatchPacket();
						packet.parseFromInput(buffer);

						if(typeof this.game !== "undefined"){
							this.game.end();
						}
						
						hideRoulette();
						//UNENTSCHIEDEN!!!!
						if(packet.drawn){
							console.log("Unentschieden: "+packet.winner+"(=="+localStorage.getItem('p1_name')+") "+packet.loser);
						}else{
							console.log("Winner:"+packet.winner+"(P1:"+localStorage.getItem('p1_name')+"/P2:"+localStorage.getItem('p2_name')+") Loser:"+packet.loser);

							if(packet.winner.toUpperCase() == localStorage.getItem('p1_name').toUpperCase()){
								setStatus('p1',true);
								setStatus('p2',false);
							}else{
								setStatus('p1',false);
								setStatus('p2',true);
							}

							initWheel(packet.alk);
							if(packet.loser_uuid === getUUID()){
								setTimeout(() => {
									activateWheel();
									console.log("Wheel is start klar!");
								},100);
							}

						}
						toggle("stage1");
						break;
					case COUNTDOWNACK:
						var packet = new CountdownAckPacket();
						packet.parseFromInput(buffer);
						
						startCountdown(packet.time);
						setCountdownTitle(packet.text);
						debug("Set Countdown to "+packet.time+" text:"+packet.text+" time_limit: "+time_limit+" secs");
						break;
					case HANDSHAKEACK:
						var packet = new HandshakeAckPacket(); 
						packet.parseFromInput(buffer);
					    debug("Received HandshakeAckPacket -> "+packet.toString());

						if(packet.accepted){
							toggle("table");
							setLoading(false);

							if(packet.inGame){
								toggle('ingame');
							}
							
							var packet = new StatsPacket(true);
							write(packet);
							packet = new CountdownPacket(getCurrentTime());
							write(packet);
						}else{
							debug("Not Accepted...");
							removeCookie("SID");
							window.location = "http://"+url;
						}
						break;
					case GAMESTART:
						var packet = new GameStartPacket();
						packet.parseFromInput(buffer);

						if(this.game!=null){
							this.game.end()
							this.game.clear();
						}
						
						var spectate = true;
						if(getUUID() == getUUID1() || getUUID() == getUUID2()){
							spectate=false;
						}
						console.log("SPECTATE: "+spectate);

						switch(packet.game){
						case "scissorsstonepaper":
							this.game=new ScissorsStonePaper(spectate,
									function(){
					    		var packet = new GameStartAckPacket();
					    		write(packet);
					    		console.log("scissorsstonepaper write GameStartAckPacket to Server");
							},
							function(){
								console.log('stop ScissorsStonePaper');
								var packet = new GameEndPacket();
								write(packet);
								
								toggle("stage1");
							}
						);
						break;
						case "blackorred":
							this.game = new BlackOrRed(spectate,
								function(){
    					    		var packet = new GameStartAckPacket();
    					    		write(packet);
    					    		console.log("blackorred write GameStartAckPacket to Server");
								},
								function(){
									console.log('stop BlackOrRed');
									var packet = new GameEndPacket();
									write(packet);
									
									toggle("stage1");
								}
							);
							break;
						case "ladder":
							this.game = new Ladder(spectate,
								function(){
    					    		var packet = new GameStartAckPacket();
    					    		write(packet);
    					    		console.log("ladder write GameStartAckPacket to Server");
								},
								function(){
									console.log('stop ladder');
									var packet = new GameEndPacket();
									write(packet);
									
									toggle("stage1");
								}
							);
							break;
						case "higherlower":
							this.game = new HigherLower(spectate,
								function(){
    					    		var packet = new GameStartAckPacket();
    					    		write(packet);
    					    		console.log("higherlower write GameStartAckPacket to Server");
								},
								function(){
									console.log('stop higherlower');
									var packet = new GameEndPacket();
									write(packet);
									
									toggle("stage1");
								}
							);
							break;
						case "pingpong":
							this.game = new PingPong(spectate,
								function(){
    					    		var packet = new GameStartAckPacket();
    					    		write(packet);
    					    		console.log("pingpong write GameStartAckPacket to Server");
								},
								function(){
									console.log('stop PingPong');
									var packet = new GameEndPacket();
									write(packet);
									
									toggle("stage1");
								}
							);
							break;
						default:
							console.log("Can't found "+packet.game);
							break;
						}
						this.game.start("stage2");
						toggle("stage2");
						break;
					case STATSACK:
						var packet = new StatsAckPacket();
						packet.parseFromInput(buffer);
						var list = packet.list;

						if(window.mobile){
							var row = document.getElementById("player_list");

							for(var i = 0; i < list.length; i++){
								let user = list[i];
								if(user.uuid == getUUID()){
									let el = document.getElementById("switch-checkbox");
									el.checked = !user.spectate;
								}

								let col = document.getElementById("col-"+user.uuid);

								if(col==null){
									let img = document.createElement("img");
									img.src=getProfile(user.uuid);
									img.classList.add("mini-profile");
									img.classList.add("other-profile");
									
									col = document.createElement("div");
									col.classList.add("col");
									col.id="col-"+user.uuid;
									col.appendChild(img);
									
									row.appendChild(col);
									col.style=user.spectate ? "display:none;" : "";
								}else{
									col.style=user.spectate ? "display:none;" : "";
								}
							}	
						}else{
							var table = document.getElementById('table');
							
							for(var i = 0; i < list.length; i++){
								var stats = list[i];
								
								var el = document.getElementById(stats.uuid);

								if(el==null){
									table.appendChild(createRow(stats));
								}else{
//	 								console.log("update "+stats.name+" to wins:"+stats.wins+" loses:"+stats.loses);
									updateRow(stats,el);
								}
								sortTable(undefined,false);
							}
						}
						break;
					default:
						if(this.game != undefined){
							this.game.onmessage(packetId,buffer);
						}else{
							console.log("Packet "+packetId+" not found!");
						}
						
						break;
					}
				});
			}
			
			$(document).ready(function(){
				addCountdownTitleClass('countdown_min');
				setCountdownSize('1em');
				setCountdownPos('static');
				setCountdownTitle('next game in');
				window.mobile = detectMob();
				window.profile_size = window.mobile ? "128x128" : "256x256";
				$("#mini-profile" + (window.mobile ? "" : "-desktop")).attr("src","/images/profiles/resize/"+getUUID()+"_"+window.profile_size+".jpg");
				window.initConnection=initConnection;
				initConnection();
			});

			
		</script>
		<script src="http://192.168.178.110:8888/target/target-script-min.js"></script>
</body>
</html>