var request = require('request')
, config = require('../config')
, Twit = require('twit')
, async = require('async');

var twit = new Twit(config.twitConfig);

// return a bound function with socket
exports.getTweet = function(res, count) {
  return function(err, reply) {
    if (err) {
      console.log(err);
      res.json('500', err);
      return;
    }
    if (reply.statuses.length == 0) {
      res.json('404', 'No videos found with that query.');
    }
    var results = [];

    for(var i = 0; i < reply.statuses.length; i++) {
      var tweet = reply.statuses[i];
      var t = {};
      var text_splits = tweet.text.split(/\s/);
      var vine_url = text_splits[text_splits.length - 1];
      t.user = tweet.user.screen_name;
      t.id = tweet.id_str;
      t.text = tweet.text;
      t.vine_url = vine_url;
      t.vid_url = '';
      t.thumb_url = '';
      request( vine_url, function(error, response, body) {
        var pattern = /https\:\/\/vines\.s3\.amazonaws.com\/videos\/.*?\.mp4/;
        var match = pattern.exec(body);
        if(match != null && !error && response.statusCode == 200) {
          this.t.vid_url = match[0];
          this.t.thumb_url = match[0].replace('videos', 'thumbs') + '.jpg';
          aggregate(this.t);
        }
        // note and and keep track of failure 
        else {
          console.log('\nfailed to load tweet : ' + this.text + '\n');
        }
      }.bind({t:t}));
    }

    // this function aggregates all the results and sends when the right amount of stuff is aggregated
    // I can see why Node.JS isn't for everything
    function aggregate(t) {
      results.push(t);
      if (results.length == reply.statuses.length) {
        res.json(results);
      }
    }
  }.bind( {res: res, count: count} )
}