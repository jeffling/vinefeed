"use strict";
var Twit = require('twit')
  , request = require('request')
  , socketio = require('socket.io');
  
//
//  filter the twitter public stream by the word 'mango'. 
//
var io = socketio.listen(httpServer);
var twit = new Twit({
    consumer_key:         'gA11sspNJdtdCL2gWDQqFA', 
    consumer_secret:      'uhBxdHaryjLcAcC9D985WYNbyT9LAzK03FMDbfnBZfc',
    access_token:         '150977185-F3trFzvsc3qjFd8DlrMbkWJXjj97IiHkifvP4EjR', 
    access_token_secret:  'GOA66sBv471fk8HPYSwomCsarmeO17FYg0Fa6Ao9E'
})

io.sockets.on('connection', function (socket) {
  twit.stream('statuses/filter', { track: 'vine co v' }).on('tweet', function (tweet) {
    console.log("tweet detected \n");

    var t = {};
    var text_splits = tweet.text.split(' ');
    var vine_url = text_splits[text_splits.length - 1];

    request(vine_url, function (error, response, body) {
      //sometimes pattern doesn't match
      var pattern = /https\:\/\/vines\.s3\.amazonaws.com\/videos\/.*?\.mp4/;
      var match = pattern.exec(body);
      if (match != null && !error && response.statusCode == 200) {
        t.vid_url = pattern.exec(body)[0];
        t.user = tweet.user.screen_name;
        socket.volatile.emit('tweet', {tweet: t});
      }
    });
  });  
});
//
// filter the public stream by the latitude/longitude bounded box of San Francisco
//
// var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]

// var stream = T.stream('statuses/filter', { locations: sanFrancisco })

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })