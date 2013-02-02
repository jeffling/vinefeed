var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {
	$("<div>").append(
		$("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin magnify' loop preload='auto' width='200' height='200' src='" + 
    	data.tweet.vid_url + "''></video>")
	).fadeIn("slow").css("display","inline-block").prependTo("#videos");

  _V_(String(data.tweet.id)).ready(function() {
    this.volume(0);
    $("#" + String(data.tweet.id)).css("display", "inline-block");
  });

  $("#" + String(data.tweet.id)).css({"width": "", "height" : ""});
  
  // mouseover in mouseover out callbacks
  $("#" + data.tweet.id).hover(function(){
    _V_(String(data.tweet.id)).volume(1);
    _V_(String(data.tweet.id)).play();

  }, function() {
    _V_(String(data.tweet.id)).volume(0);
    _V_(String(data.tweet.id)).pause();
  });

// if ($("#videos").children().length > 8) {
// 		$("#videos div:last-child").remove();
// 	}
});

/* Updates videos based on search params */
function searchHandler()
{
	window.location.hash = $("#search").attr('value');

}