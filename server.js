/**
 * Module dependencies.
 */
"use strict";
var express = require('express'),
  http = require('http'),
  path = require('path');
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
//   var db = mongoose.connect('localhost', 'mongodb');
//   app.use(express.errorHandler());
// });


// routes
var routes = {};
routes.common = require('./routes/common');
routes.api = require('./routes/api');

app.get('/', routes.common.index);
app.get('/api/tweets', routes.api.getTweets);

var httpServer = http.createServer(app);
httpServer.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

  // for when we want to do live streaming
  // twit.stream('statuses/filter', { track: data.track }).on('tweet', function (tweet) {
  //   var t = {};
  //   var text_splits = tweet.text.split(' ');
  //   var vineUrl = text_splits[text_splits.length - 1];
  //   request(vineUrl, function (error, response, body) {
  //     var pattern = /https\:\/\/vines\.s3\.amazonaws.com\/videos\/.* ?\.mp4/;
  //     var match = pattern.exec(body);
  //     if (match != null && !error && response.statusCode == 200) {
  //       t.vidUrl = pattern.exec(body)[0];
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