var animations = ['toplong','rotate','fall','jump','balance'];

function setWord(id,w,color){
	var word = $('#'+id);
	word.html("");
	for(var i = 0; i < w.length; i++){
		word.append('<span>'+w.charAt(i)+'</span>');
	}
	
	const spans = document.querySelectorAll('#'+id+' span');

	spans.forEach((span, idx) => {
		span.addEventListener('click', (e) => {
			e.target.classList.add(getAnimation(idx));
		});
		span.addEventListener('animationend', (e) => {
			e.target.classList.remove(getAnimation(idx));
		});
		if(typeof color !== undefined)span.style.color=color;
		
		// Initial animation
		setTimeout(() => {
			span.classList.add(getAnimation(idx));
		}, 750 * (idx+1))
	});
}

function getAnimation(i){
	return animations.length > i ? animations[i] : animations[0];
}

