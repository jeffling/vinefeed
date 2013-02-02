var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {
	$('#test').append(data.tweet.user + "\n");
});
