/**
 * Module dependencies.
 */
"use strict";
var express = require('express'),
  http = require('http'),
  path = require('path'),
  io = require('socket.io');
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
app.get('/', routes.common.index);


http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

io.listen(http);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
  });
});