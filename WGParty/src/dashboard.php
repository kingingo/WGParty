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
	</head>
<body class="text-center">
	<div id="content" style="display: none;">
		<div class="word" id="dashboard"></div>
		<div class="word" id="ingame"></div>
		<?php include 'vendor/countdown/countdown.html'; ?>
		<hr>
		<table class="center" id="table">
			<tr>
				<th>Player</th>
				<th onclick="sortTable(1)" style="cursor:pointer;">Wins</th>
				<th onclick="sortTable(2)" style="cursor:pointer;">Loses / Drinks</th>
			</tr>
		</table>
	
		<div id="stage1">
			<?php setMatch(); ?>
			<?php include 'vendor/wheel/wheel.html';?>
		</div>
		<div id="stage2">
		
		</div>
	</div>
	
		<?php include 'loading.php';?>
		<?php includeCounter(); ?>
		<script type="text/javascript">
			setWord('dashboard','DASHBOARD');
			setWord('ingame','INGAME','lightgreen');
			toggle('dashboard');
			function toggle(v){
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
					$('#stage1').hide();
					$('#stage2').hide();
					break;
				case 'stage1':
					$('#table').hide();
					$('#stage1').show();
					$('#stage2').hide();
					break;
				case 'stage2':
					$('#table').hide();
					$('#stage1').hide();
					$('#stage2').show();
					break;
				}
			}
			toggle('table');
			
			$(document).ready(function(){
				addCountdownTitleClass('countdown_min');
				setCountdownSize('1em');
				setCountdownPos('static');
				setCountdownTitle('next game in');
				
				connect(cookieCheck,function(packetId, buffer){
					switch(packetId){
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
						console.log("Winner:"+packet.winner+" Loser:"+packet.loser);

						if(packet.winner.toUpperCase() == localStorage.getItem('p1_name')){
							setStatus('p1',true);
							setStatus('p2',false);
						}else{
							setStatus('p2',true);
							setStatus('p1',false);
						}

						initWheel(packet.alk);
						if(packet.loser_uuid === getUUID()){
							setTimeout(() => {
								activateWheel();
								console.log("Wheel is start klar!");
							},100);
						}

						toggle("stage1");
						break;
					case COUNTDOWNACK:
						var packet = new CountdownAckPacket();
						packet.parseFromInput(buffer);
						
						startCountdown(packet.time);
						setCountdownTitle(packet.text);
						debug("Set Countdown to "+packet.time+" text:"+packet.text+" time_limit: "+time_limit+" secs");
						if(packet.text == 'next game in'){
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
						console.log("Packet "+packetId+" not found!");
						break;
					}
				});
			});

			
		</script>
</body>
</html>