var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {

	$("<video autoplay loop preload='auto' width=200 height=200 src='" + data.tweet.vid_url + "''></video>").prependTo("#videos");

	if ($("#videos").children().length > 8) {
		$("#videos video:last-child").remove();
	}
});

/* Updates videos based on search params */
function searchHandler()
{
	window.location.hash = $("#search").attr('value');

}