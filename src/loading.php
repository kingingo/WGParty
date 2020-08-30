<div id="loading" class="load_center">
	<h1 id="loading_msg">Loading...</h1>
	<img alt="load image" style="height: 256px; width: 256px;" class="load"
		src="images/load.png">
</div>

<script>
function setLoading(s){
	var load = document.getElementById('loading');
	var content = document.getElementById('content');
	load.style.display = (!s ? "none" : "");
	content.style.display = (s ? "none" : "");
}
</script>