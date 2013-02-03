$(document).ready(function() { 

var socket = io.connect('http://localhost');

// initialize by finding all vine things
socket.on('connect', function() {
  socket.emit('track', { track: 'vine co v'});
});


socket.on('tweet', function (data) {
  var new_video = $("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin magnify' loop preload='auto' width='200' height='200' src='" + 
      data.tweet.vid_url + "''></video>");
  new_video.fadeIn("slow").css("display","inline-block");
  new_video.qtip({content: 'Tweeted by ' + data.tweet.user, show: 'mouseover', hide: 'mouseout'});
	$("<div>").append(new_video).appendTo("#videos");
		

  _V_(String(data.tweet.id)).ready(function() {
    this.volume(0);
    this.play();
  });

  $("#" + String(data.tweet.id)).css({"width": "", "height" : ""});
  
  // mouseover in mouseover out callbacks
  $("#" + data.tweet.id).hover(function(){
    _V_(String(data.tweet.id)).volume(1);
  }, function() {
    _V_(String(data.tweet.id)).volume(0);
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