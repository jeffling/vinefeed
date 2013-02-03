$(document).ready(function() { 

var socket = io.connect('http://localhost');

// initialize by finding all vine things
socket.on('connect', function() {
  socket.emit('track', { track: 'vine co v'});
});

var i = 0;
var list = ["", "300px", "515px", "730px"];

socket.on('tweet', function (data) {

	if (Math.floor(i % 4) == 0) {
		$("<div id='row" + Math.floor(i/4) + "' class='row' style='margin-left: 0px;'>").appendTo("#videos");
	}
  var new_video = $("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin magnify' loop preload='auto' width='200' height='200' src='" + 
      data.tweet.vid_url + "''></video>");
  var tooltip = $("<div class='ttip'>@" + data.tweet.user + ': ' + data.tweet.text + "</div>");
  new_video.fadeIn("slow").css("display","inline-block");
  /*new_video.qtip({content: '@' + data.tweet.user + ': ' + data.tweet.text, width: 200, show: 'mouseover', hide: 'mouseout',  position: {
      corner: {
         target: 'bottomLeft',
         tooltip: 'topMiddle'
      },
      adjust:{
        x:100
      },
   }});*/

	$("<div class='item' style='left: " + list[Math.floor(i% 4)] + "'>").append(new_video).append(tooltip).appendTo("#row" + Math.floor(i/4));
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