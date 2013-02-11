/**
 * Module dependencies.
 */
"use strict";
var express = require('express'),
  http = require('http'),
  path = require('path'),
  socketio = require('socket.io'),
  Twit = require('twit'),
  request = require('request'),
  twitter = require('./twitter'),
  config = require('./config');;
// mongoose = require('mongoose'),
var app = express();
// app.locals = require(' ./locals');
app.configure(function() {
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('fatsealandpoopingsloth'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

// // database connection
// app.configure('development', function() {
//   var db = mongoose.connect('localhost', 'flowtododb');
//   app.use(express.errorHandler());
// });
// routes
var routes = {};
routes.common = require('./routes/common');
app.get('/', routes.common.index);

var httpServer = http.createServer(app);
httpServer.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(httpServer);
var twit = new Twit(config.twitConfig);

global.last_twitter_id = 2979671857232896000000; // arbitrarily high number. probably should do something smarter. 
global.last_query = {};
io.sockets.on('connection', function(socket) {
  socket.on('track', function(data) {
    global.last_query = data;
    twit.get('search/tweets', {
      q: data.track + ' source:vine_for_ios exclude:retweets',
      result_type: data.result_type,
<<<<<<< HEAD
      count: data.count
      // max_id: global.last_twitter_id
=======
      count: data.count,
      max_id: global.last_twitter_id
>>>>>>> c23f1529885022b16f0ba55d2844a5ca090e8046
    }, twitter.sendTweet(socket));
  });


  // socket.on('more', function(data) {
  //   twit.get('search/tweets', {
  //     q: global.last_query.track + ' source:vine_for_ios exclude:retweets',
  //     result_type: data.last_query.result_type,
  //     count: data.last_query.count,
  //     max_id: global.last_twitter_id
  //   }, twitter.sendTweet(socket));
  // });

  // twit.stream('statuses/filter', { track: data.track }).on('tweet', function (tweet) {
  //   var t = {};
  //   var text_splits = tweet.text.split(' ');
  //   var vine_url = text_splits[text_splits.length - 1];
  //   request(vine_url, function (error, response, body) {
  //     var pattern = /https\:\/\/vines\.s3\.amazonaws.com\/videos\/.* ?\.mp4/;
  //     var match = pattern.exec(body);
  //     if (match != null && !error && response.statusCode == 200) {
  //       t.vid_url = pattern.exec(body)[0];
  //       t.user = tweet.user.screen_name;
  //       t.id = tweet.id;
  //       t.text = tweet.text;
  //       socket.volatile.emit('tweet', {tweet: t});
  //     }
  //   });
  //   socket.on('stop', function(data) {
  //     twit.stream.stop();
  //   });
  //   socket.on('start', function(data) {
  //     twit.stream.start();
  //   });
  // });
});