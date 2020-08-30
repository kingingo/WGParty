<html>
<head>
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
</head>

<body class="text-center">
	<div id="content" style="display: none;">
		<img src="" id="mini-profile" alt="Italian Trulli">

		<div class="word" id="dashboard"></div>
		<div class="word" id="ingame"></div>
		<?php include 'vendor/countdown/countdown.html'; ?>
		<hr>
		<table class="center" id="table">
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
					$('#table').show();
					$('#stage0').hide();
					$('#stage1').hide();
					$('#stage2').hide();
					break;
				case 'stage0':
					$('#table').hide();
					$('#stage0').show();
					$('#stage1').hide();
					$('#stage2').hide();
					break;
				case 'stage1':
					$('#table').hide();
					$('#stage0').hide();
					$('#stage1').show();
					$('#stage2').hide();
					break;
				case 'stage2':
					$('#table').hide();
					$('#stage0').hide();
					$('#stage1').hide();
					$('#stage2').show();
					break;
				}
			}

			function init(){
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
						
						$("#left-mini-profile").attr("src","/images/profiles/resize/"+getUUID1()+".jpg");
						$("#right-mini-profile").attr("src","/images/profiles/resize/"+getUUID2()+".jpg");
						
						toggle('stage0');
						  break;
					case PLAYERREADYACK:
						var packet = new PlayerReadyAckPacket();
						packet.parseFromInput(buffer);
						console.log("RECEIVED PlayerReadyAckPacket");

						if(packet.uuid != getUUID()){
							console.log("ENTERED PlayerReadyAckPacket");
							if(packet.uuid == getUUID1()){
								$("#left-stage0").css("background-color","green");
							}else if(packet.uuid == getUUID2()){
								$("#right-stage0").css("background-color","green");
							}else{
								console.log("PLAYERREADYACK uuid "+packet.uuid+" id passt nicht");
								console.log(getStackTrace().join('\n'));
							}
						}
						 break;
					case STARTMATCH:
						var packet = new StartMatchPacket();
						packet.parseFromInput(buffer);

						localStorage.setItem('p1_uuid',packet.u1_uuid);
						localStorage.setItem('p1_name',packet.u1_name);
						
						localStorage.setItem('p2_uuid',packet.u2_uuid);
						localStorage.setItem('p2_name',packet.u2_name);

						
						var p1_r = $('#p1_roulette');
						p1_r.empty();
						for(var i = 0; i < packet.loaded.length; i++)
							p1_r.append(packet.loaded[i]);
						
						p1_r.roulette({
							id: "p1",
							speed : 10,
							duration : packet.roulette ? rand(3,5) : 1,
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
						
						var p2_r = $('#p2_roulette');
						p2_r.empty();
						let img;
						for(var i = 0; i < packet.loaded.length; i++){
							img = new Image();
							img.src = packet.loaded[i].src;
							p2_r.append(img);
						}
						p2_r.roulette({
							id: "p2",
							speed : 10,
							duration :  packet.roulette ? rand(3,5) : 1,
							stopImageNumber : packet.u2_index,
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

						$('#p1').hide();
						$('#p2').hide();
						toggle('stage1');
						toggle('ingame');

						if(packet.roulette){
							setTimeout(function(){
								p1_r.roulette('start');
							},3000);
							setTimeout(function(){
								p2_r.roulette('start');
							},1500);
						}else{
							p1_r.roulette('start');
							p2_r.roulette('start');
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
						this.game.end();
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
						if(packet.text.toUpperCase() == 'next game in'.toUpperCase()){
							toggle("table");
							toggle('dashboard');
						}
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
							window.location = "http://"+url;
						}
						break;
					case GAMESTART:
						var packet = new GameStartPacket();
						packet.parseFromInput(buffer);

						var spectate = true;
						if(getUUID() == getUUID1() || getUUID() == getUUID2()){
							spectate=false;
						}
						console.log("SPECTATE: "+spectate);

						switch(packet.game){
						case "higherlower":
							this.game = new HigherLower(spectate,
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
						var table = document.getElementById('table');
						
						for(var i = 0; i < list.length; i++){
							var stats = list[i];
							var el = document.getElementById(stats.uuid);

							if(el==null){
								table.appendChild(createRow(stats));
							}else{
// 								console.log("update "+stats.name+" to wins:"+stats.wins+" loses:"+stats.loses);
								updateRow(stats,el);
							}
							sortTable(undefined,false);
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
				$("#mini-profile").attr("src","/images/profiles/resize/"+getUUID()+".jpg");
				window.initConnection=initConnection;
				initConnection();
			});

			
		</script>
</body>
</html>