$(document).ready(function() { 

var socket = io.connect('http://localhost');

// initialize by finding all vine things
socket.on('connect', function() {
  socket.emit('track', { track: 'cats' });
  socket.emit('more', {track: 'cats'});
});

var i = 0;

socket.on('tweet', function (data) {

	if (Math.floor(i % 4) == 0) {
		$("<div id='row" + Math.floor(i/4) + "' class='row show-grid'>").appendTo("#videos");
		if (i > 3) {
			var current_row = $("#row" + Math.floor(i/4));
			var prev_top_css = current_row.prev().position().top + 230;
			current_row.css({"position" : "absolute", "top" : prev_top_css + "px"});
		}
	}
	var new_video = $("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin bigger magnify' loop preload='auto' width='200' height='200' src='" + 
	    data.tweet.vid_url + "''></video>");
	new_video.fadeIn("slow")
	new_video.qtip({content: '@' + data.tweet.user + ': ' + data.tweet.text, show: 'mouseover', hide: 'mouseout'});

	$("<div class='span3 item'>").append(new_video).appendTo("#row" + Math.floor(i/4));
	i++;

  _V_(String(data.tweet.id)).ready(function() {
    this.volume(0);
  });

  $("#" + String(data.tweet.id)).css({"width": "", "height" : ""});
  
  // mouseover in mouseover out callbacks
  $("#" + data.tweet.id).hover(function(){
    _V_(String(data.tweet.id)).volume(1);
    _V_(String(data.tweet.id)).play();
    $("#" + data.tweet.id).parent().css("z-index", "2");
  }, function() {
    _V_(String(data.tweet.id)).volume(0);
    _V_(String(data.tweet.id)).pause();
    $("#" + data.tweet.id).parent().css("z-index", "1");
  });

  if ($("#videos").children().length == 8) {
  	socket.emit('stop', {});
  }

});

}); 
/* Updates videos based on search params */
function searchHandler()
{
  window.location.hash = $("#search").attr('value');

}