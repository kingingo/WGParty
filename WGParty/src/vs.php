<html>
	<head>
		<title>WG PARTY - VS</title>
		<script src="vendor/jquery/jquery-3.4.1.min.js"></script>
		<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
		<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
		<link href="vendor/css/style.css" rel="stylesheet">	
		<link href="vendor/wheel/wheel.css" rel="stylesheet">
    	<link href="vendor/countdown/countdown.css" rel="stylesheet">
		<script src="vendor/countdown/countdown.js"></script>
		<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>	
     	<script src = "vendor/wheel/wheel.js"></script>
	</head>
	
	<body>
		<button onclick="toggle()" style="display:flex;float left;" class="btn btn-warning">fertig</button>
		<script type="text/javascript">
			var c = true;
			startCountdown(60);
			function toggle(){
				if(c){
					//switch to game
					stopCountdown();
					initWheel();
					activateWheel();
					document.getElementById('countdown').style.display="none";
					document.getElementById('game').style.opacity="100%";
				}else{
					//switch to countdown
					document.getElementById('game').style.opacity="10%";
					document.getElementById('countdown').style.display="block";
					startCountdown(60);
				}
				c=!c;
			}
		</script>
		
		<div class="box">
    		<div id="countdown">
    			<h1>COUNTDOWN</h1>
    			<h1 id="h1"></h1>
    		</div>
    		
    		<div style="opacity: 10%" id="game">
    			<img alt="?" src="images/unknown.png">
    			<img alt="vs" style="height: 100px;width: auto;"src="images/vs.png">
    			<img alt="?" src="images/unknown.png">
       	 		<div style="display:none" id="question">
       	 			<img class="center">
       	 			<strong class="center"></strong>
       	 		</div>
    			<div id="chart"></div>
    		</div>
		</div>
		<script type="text/javascript">
			initWheel();
		</script>
	</body>
</html>