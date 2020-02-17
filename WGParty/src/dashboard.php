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
includeProfile();
?>
	</head>
<body class="text-center">
	<div id="content" style="display: none;">
		<h1>Dashboard</h1>
		<?php include 'vendor/countdown/countdown.html'; ?>
		<hr>
		<table class="center" id="table">
			<tr>
				<th>Player</th>
				<th onclick="sortTable(1)" style="cursor:pointer;">Wins</th>
				<th onclick="sortTable(2)" style="cursor:pointer;">Loses / Drinks</th>
			</tr>
		</table>
	
		<div id="stage">
			<?php setMatch(); ?>
			<?php include 'vendor/wheel/wheel.html';?>
		</div>
	</div>
		
	
		<?php include 'loading.php';?>
		<?php includeCounter(); ?>
		<script type="text/javascript">
			$('#table').hide();
			function toggle(){
				if(!$('#table').is(":hidden")){
					$('#table').hide();
					$('#stage').show();
				}else{
					$('#stage').hide();
					$('#table').show();
				}
			}
			
			initWheel();
			$(document).ready(function(){
				
				addCountdownTitleClass('countdown_min');
				setCountdownSize('1em');
				setCountdownPos('static');
				setCountdownTitle('next game in');
				
				connect(cookieCheck,function(packetId, buffer){
					switch(packetId){
					case MATCH:
						var packet = new MatchPacket();
						packet.parseFromInput(buffer);
						console.log("Winner:"+packet.winner+" Loser:"+packet.loser);
						var p1 = document.getElementById('p1');
						p1.style.backgroundImage = "url(images/profiles/"+packet.winner_uuid+".png)";
						var p2 = document.getElementById('p2');
						p2.style.backgroundImage = "url(images/profiles/"+packet.loser_uuid+".png)";
						break;
					case COUNTDOWNACK:
						var packet = new CountdownAckPacket();
						packet.parseFromInput(buffer);
						startCountdown(packet.time);
						break;
					case HANDSHAKEACK:
						var packet = new HandshakeAckPacket(); 
						packet.parseFromInput(buffer);
					    debug("Received HandshakeAckPacket -> "+packet.toString());

						if(packet.accepted){
							setLoading(false);
							
							var packet = new StatsPacket(true);
							write(packet);
							packet = new CountdownPacket(getCurrentTime());
							write(packet);
						}else{
							debug("Not Accepted...");
							window.location = "http://localhost";
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