	function startCallbackProfile(id){
		var p = $('#'+id);
		var p_name = $('#'+id+'_name');
		p_name.html(localStorage.getItem(id+'_name'));
		var p_r = $('#'+id+'_roulette');
		p.hide();
		p.css('background-image','');
		p_r.show();
		
		var k = $('#'+id+'_krone');
		var l = $('#'+id+'_loser');
		k.hide();
		l.hide();
	}

	function setStatus(id, win){
		var k = $('#'+id+'_krone');
		var l = $('#'+id+'_loser');
		
		console.log("STATUS "+id+" win: "+win);
		
		if(win){
			k.show();
			l.hide();
		}else{
			k.hide();
			l.show();
		}
	}
	
	function hideRoulette(){
		var p = $('#p1');
		var p_r = $('#p1_roulette');
		p.show();
		p_r.hide();
		
		var p2 = $('#p2');
		var p2_r = $('#p2_roulette');
		p2.show();
		p2_r.hide();
	}
	
	function stopCallbackProfile(src, id){
		var p = $('#'+id);
		var p_r = $('#'+id+'_roulette');
		p.show();
		p_r.hide();
		p.css('background-image','url('+src+')');
		console.log("CALL stopCallbackProfile src:"+src+" id:"+id);
	}