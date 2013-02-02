var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {
	$("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin' loop preload='auto' width=200 height=200 muted src='" + 
    data.tweet.vid_url + "''></video>").prependTo("#videos");

  _V_(String(data.tweet.id)).ready(function() {
    this.volume(0);
    this.play();
  });
  
  // // mouseover in mouseover out callbacks
  // $("#" + data.tweet.id).hover(function(event){
  //   _V_(String(data.tweet.id)).volume(1);
  //   alert("test");
  // }, function(event) {
  //   _V_(String(data.tweet.id)).volume(0);
  // });


if ($("#videos").children().length > 8) {
		$("#videos div:last-child").remove();
	}
});

/* Updates videos based on search params */
function searchHandler()
{
	window.location.hash = $("#search").attr('value');

}