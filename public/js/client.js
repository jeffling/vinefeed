var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {
	$("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin' loop preload='auto' width=200 height=200 muted src='" + 
    data.tweet.vid_url + "''></video>").prependTo("#videos");

  _V_(String(data.tweet.id)).ready(function() {
    this.volume(0);
    this.play();
  });

if ($("#videos").children().length > 8) {
		$("#videos video:last-child").remove();
	}
});

/* Updates videos based on search params */
function searchHandler()
{
	window.location.hash = $("#search").attr('value');

}