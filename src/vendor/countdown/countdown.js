var time_limit,target_date,id, days, hours, minutes, seconds; // variables for time units
var countdown = document.getElementById("countdown"); // get tag element
setCountdownSize('6em');

function stopCountdown(){
	if(typeof id == 'undefined')return;
	$('#countdown_h1').text("00:00:00");
	clearInterval(id);
	id = undefined;
}

function startCountdown(target_time){
	stopCountdown();
	target_date = target_time; // set the countdown date
	time_limit = (target_time - getCurrentTime())/1000;
	getCountdown();

	id=setInterval(function () { getCountdown(); }, 1000);
}

function setCountdownSize(size){
	countdown.style.fontSize = size;
}

function addCountdownTitleClass(clazz){
	var el = document.getElementById('countdown_title');
	el.classList.add(clazz);
}

function setCountdownPos(pos){
	countdown.style.position=pos;
}

function setCountdownTitle(title){
	var el = document.getElementById('countdown_title');
	el.innerHTML=title;
}

function getCurrentTime(){
	return new Date().getTime();
}

function getCountdown(){
	// find the amount of "seconds" between now and target
	var current_date = getCurrentTime();
	var seconds_left = (target_date - current_date) / 1000;
	
	if ( seconds_left >= 0 ) {
	   if ( (seconds_left * 1000 ) < ( time_limit / 2 ) )  {
		     $( '#tiles' ).removeClass('color-full');
		     $( '#tiles' ).addClass('color-half');
	   	} 
	    if ( (seconds_left * 1000 ) < ( time_limit / 4 ) )  {
	    	$( '#tiles' ).removeClass('color-half');
	    	$( '#tiles' ).addClass('color-empty');
	    }
	  
		days = pad( parseInt(seconds_left / 86400) );
		seconds_left = seconds_left % 86400;
			 
		hours = pad( parseInt(seconds_left / 3600) );
		seconds_left = seconds_left % 3600;
			  
		minutes = pad( parseInt(seconds_left / 60) );
		seconds = pad( parseInt( seconds_left % 60 ) );
		// format countdown string + set tag value
		$('#countdown_h1').text(hours + ":" + minutes + ":" + seconds);
	}
}

function pad(n) {
	return (n < 10 ? '0' : '') + n;
}