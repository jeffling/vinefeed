/**
 * Module dependencies.
 */
"use strict";
var express = require('express'),
  http = require('http'),
  path = require('path'),
  socketio = require('socket.io'),
  Twit = require('twit'),
  request = require('request')
;
  // mongoose = require('mongoose'),

var app = express();
// app.locals = require(' ./locals');

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
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
routes.twitter = require('./routes/twitter');
app.get('/', routes.common.index);

var httpServer = http.createServer(app);
httpServer.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(httpServer);
var twit = new Twit({
    consumer_key:         'gA11sspNJdtdCL2gWDQqFA', 
    consumer_secret:      'uhBxdHaryjLcAcC9D985WYNbyT9LAzK03FMDbfnBZfc',
    access_token:         '150977185-F3trFzvsc3qjFd8DlrMbkWJXjj97IiHkifvP4EjR', 
    access_token_secret:  'GOA66sBv471fk8HPYSwomCsarmeO17FYg0Fa6Ao9E'
})

io.sockets.on('connection', function (socket) {
  twit.stream('statuses/filter', { track: 'vine co v' }).on('tweet', function (tweet) {
    var t = {};
    var text_splits = tweet.text.split(' ');
    var vine_url = text_splits[text_splits.length - 1];
    request(vine_url, function (error, response, body) {
      var pattern = /https\:\/\/vines\.s3\.amazonaws.com\/videos\/.*?\.mp4/;
      var match = pattern.exec(body);
      if (match != null && !error && response.statusCode == 200) {
        t.vid_url = pattern.exec(body)[0];
        t.user = tweet.user.screen_name;
        t.id = tweet.id;
        socket.volatile.emit('tweet', {tweet: t});
      }
    });
  });  
});