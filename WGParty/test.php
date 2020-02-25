<html>
<head> <?php
include_once 'vendor/utils.php';
includeAll();
includeWheel();
?>
<link href="vendor/css/profile2.css" rel="stylesheet">

<style type="text/css">

.roulette{
    height: 256px;
    width: 256px;
}
</style>

</head>
<body>
	<div class="profileContainer">
		<div class="profile" id="p1">
			<img hidden alt="loser" id="p1_loser" class="loser" src="images/loser.png">
			<img hidden alt="krone" id="p1_krone" class="krone" src="images/knossiKrone.png">
			<p id="p1_name">Felix</p>
		</div>
		<div id="p1_roulette">
			<img src="images/profiles/resize/704ca1d7-a836-3c9d-a20e-812201fb28c4.jpg" />
			<img src="images/profiles/resize/a52fd7a5-9b47-39f8-b9f6-e9e5f5e123c3.jpg" />
			<img src="images/profiles/resize/a201aeb4-a217-3296-856c-44c5604b7511.jpg" />
			<img src="images/profiles/resize/c1f80edd-ea77-3146-90a2-062dda3eb15c.jpg" />
			<img src="images/profiles/resize/d0c00898-8457-49f8-9eee-1ab664307e6e.jpg" />
			<img src="images/profiles/resize/d8f7de47-9b1f-3e3d-85d3-41f380524de5.jpg" />
			<img src="images/profiles/resize/d30e5cd5-127c-32b7-adbf-099b2a040641.jpg" />
		</div>
		
		<img alt="vs" class="vs" src="images/vs.png">
		<div class="profile" id="p2">
			<img hidden alt="loser" id="p2_loser" class="loser" src="images/loser.png">
			<img hidden alt="krone" id="p2_krone" class="krone" src="images/knossiKrone.png">
			<p id="p2_name">Oskar</p>
		</div>
		<div id="p2_roulette">
				<img src="images/profiles/resize/704ca1d7-a836-3c9d-a20e-812201fb28c4.jpg" />
				<img src="images/profiles/resize/a52fd7a5-9b47-39f8-b9f6-e9e5f5e123c3.jpg" />
				<img src="images/profiles/resize/a201aeb4-a217-3296-856c-44c5604b7511.jpg" />
				<img src="images/profiles/resize/c1f80edd-ea77-3146-90a2-062dda3eb15c.jpg" />
				<img src="images/profiles/resize/d0c00898-8457-49f8-9eee-1ab664307e6e.jpg" />
				<img src="images/profiles/resize/d8f7de47-9b1f-3e3d-85d3-41f380524de5.jpg" />
				<img src="images/profiles/resize/d30e5cd5-127c-32b7-adbf-099b2a040641.jpg" />
			</div>
	</div>

	<script type="text/javascript">
	
	function setKrone(id){
		var k = document.createElement('img');
		k.src="images/knossiKrone.png";
		k.classList.add('krone');
		k.id=id+'_krone';
		document.getElementById(id).appendChild(k);
	}

	function setLoser(id){
		var k = document.createElement('img');
		k.src="images/loser.png";
		k.classList.add('loser');
		k.id=id+'_loser';
		document.getElementById(id).appendChild(k);
	}
	
	$('#p1').hide();
	$('#p2').hide();
	
	var option = {
		speed : 10,
		duration : 3,
		stopImageNumber : 0,
		startCallback : function() {
			console.log('start');
		},
		slowDownCallback : function() {
			console.log('slowDown');
		},
		stopCallback : function($stopElm) {
			console.log('stop');
		}
	}
	var p1_r = $('#p1_roulette');
	p1_r.roulette(option);
	var p2_r = $('#p2_roulette');
	p2_r.roulette(option);

</script>
</body>
</html>
>
