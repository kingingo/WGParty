//https://codepen.io/mattgreenberg/pen/EKQoEy

class Song{
	
	constructor(title, urls,progress, duration){
		this.title = title;
		this.urls = urls;
		this.progress = progress;
		this.duration = duration;
	}
	
}


(function() {
  //variables
  var changePosition, changeSong, changeVolume, pauseSong, playSong, playlist, updatePositionSlider, updateSlider;
  
  window.songs = [
	  new Song("Stole the Show", {"640":"https://i.scdn.co/image/ab67616d0000b27335590cb9280d5a1f5221ae1a",
		  "300":"https://i.scdn.co/image/ab67616d00001e0235590cb9280d5a1f5221ae1a",
		  "64":"https://i.scdn.co/image/ab67616d0000485135590cb9280d5a1f5221ae1a",}, 157523,203406),
	  new Song("Betonowy las - Ptaki Remix", {"640":"https://i.scdn.co/image/ab67616d0000b27334b730aea3d1ea02a10e659e",
		  "300":"https://i.scdn.co/image/ab67616d00001e0234b730aea3d1ea02a10e659e",
		  "64":"https://i.scdn.co/image/ab67616d0000485134b730aea3d1ea02a10e659e",}, 109756,203406),
	  new Song("1st Of July", {"640":"https://i.scdn.co/image/ab67616d0000b273308364e199f031c32cd80c6f",
		  "300":"https://i.scdn.co/image/ab67616d00001e02e0e0ce61c1f48ab03d3f0103",
		  "64":"https://i.scdn.co/image/ab67616d00004851e0e0ce61c1f48ab03d3f0103",}, 114742,164981),
  ]
  window.open = true;

  window.volume = 0.5;

  window.position = 0;

  window.duration = 40.8;

  window.currentSong = window.songs[0];

  window.add = null;

  changeSong = function(song) {
    window.currentSong.stop();
    window.currentSong.pos(0);
    window.position = 0;
    jQuery(".slider").slider("value", 0);
    window.currentSong = song;
    jQuery(".play-song > i").removeClass('fa-play');
    jQuery(".play-song > i").addClass('fa-pause');
    window.open = false;
    return song.play();
  };

  updatePositionSlider = function() {
    return window.position += 1;
  };

  playSong = function(song) {
    song.play();
    return window.add = setInterval(updatePositionSlider, 1000);
  };

  pauseSong = function(song) {
    song.pause();
    return clearInterval(window.add);
  };

  changeVolume = function(song) {
    return song.volume(window.volume);
  };

  changePosition = function(song) {
    return song.pos(window.position);
  };

  updateSlider = function() {
    return jQuery(".slider").slider("value", window.position);
  };

  jQuery(function() {
    var slideUp;
    jQuery(".slider").slider({
      min: 0,
      range: "min",
      max: window.duration,
      value: 0,
      slide: function(event, ui) {
        window.position = ui.value;
        return changePosition(window.currentSong);
      }
    });
    setInterval(updateSlider, 100);
    jQuery("#volume-off").click(function() {
      currentSong.volume(0);
      return jQuery(".slider-volume").slider("value", 0);
    });
    jQuery("#volume-up").click(function() {
      currentSong.volume(1);
      return jQuery(".slider-volume").slider("value", 100);
    });
    jQuery(".slider-volume").slider({
      min: 0,
      range: "min",
      max: 100,
      value: 50,
      slide: function(event, ui) {
        window.volume = ui.value / 100;
        return changeVolume(window.currentSong);
      }
    });
    jQuery("#play").click(function() {
      if (window.open) {
        playSong(window.currentSong);
        jQuery(".play-song > i").removeClass('fa-play');
        jQuery(".play-song > i").addClass('fa-pause');
        window.open = !window.open;
        return setInterval(updateSlider, 100);
      } else {
        pauseSong(window.currentSong);
        jQuery(".play-song > i").removeClass('fa-pause');
        jQuery(".play-song > i").addClass('fa-play');
        return window.open = !window.open;
      }
    });
    slideUp = true;
    jQuery(".slide-up").click(function() {
      if (slideUp) {
        jQuery(".song-list, .playlist-controls, .overlay").addClass("active");
        jQuery(".slide-up").html("<i class='fa fa-chevron-down'></i>");
        return slideUp = !slideUp;
      } else {
        jQuery(".song-list, .playlist-controls, .overlay").removeClass("active");
        jQuery(".slide-up").html("<i class='fa fa-chevron-up'></i>");
        return slideUp = !slideUp;
      }
    });
    return jQuery("tr").click(function() {
      if (jQuery(this).attr('data-title') === "billyBreathes") {
        changeSong(billyBreathes);
        jQuery(".slider").slider("option", "max", 331.6);
        window.duration = 331.6;
        jQuery(".song").html("Billy Breathes");
        setInterval(updateSlider, 100);
      } else if (jQuery(this).attr('data-title') === "harryHood") {
        jQuery(".song").html("Harry Hood");
        window.duration = 40.8;
        setInterval(updateSlider, 100);
        jQuery(".slider").slider("option", "max", 40.8);
        changeSong(harryHood);
        setInterval(updateSlider, 100);
      } else if (jQuery(this).attr('data-title') === "suzyGreenberg") {
        jQuery(".song").html("Suzy Greenberg");
        window.duration = 40.8;
        setInterval(updateSlider, 100);
        jQuery(".slider").slider("option", "max", 40.8);
        changeSong(suzyGreenberg);
        setInterval(updateSlider, 100);
      } else if (jQuery(this).attr('data-title') === "themeFromTheBottom") {
        changeSong(themeFromTheBottom);
        jQuery(".song").html("Theme From The Bottom");
        jQuery(".slider").slider("option", "max", 382.2);
        window.duration = 382.2;
        setInterval(updateSlider, 100);
      }
      jQuery(".song-list, .playlist-controls, .overlay").removeClass("active");
      jQuery(".slide-up").html("<i class='fa fa-chevron-up'></i>");
      return slideUp = !slideUp;
    });
  });

}).call(this);