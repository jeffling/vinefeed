var request = require('request');

// return a bound function with socket
exports.sendTweet = function(socket) {
  return function(err, reply) {
    if (err) {
      console.log(err);
      return;
    }
    var failures = 0;
    for(var i = 0; i < reply.statuses.length; i++) {
      var tweet = reply.statuses[i];
      var t = {};
      var text_splits = tweet.text.split(/\s/);
      var vine_url = text_splits[text_splits.length - 1];
      t.user = tweet.user.screen_name;
      t.id = tweet.id_str;
      t.text = tweet.text;
      t.vine_url = vine_url;
      // update global last_twitter_id
      if( global.last_twitter_id > tweet.id ) {
        global.last_twitter_id = tweet.id;
        console.log(global.last_twitter_id);
      }
      request( vine_url, function(error, response, body) {
        var pattern = /https\:\/\/vines\.s3\.amazonaws.com\/videos\/.*?\.mp4/;
        var match = pattern.exec(body);
        if(match != null && !error && response.statusCode == 200) {
          this.t.vid_url = match[0];
          this.socket.volatile.emit('tweet', {
            tweet: this.t
          });
        }
        // note and and keep track of failure 
        else {
          console.log('failed to load tweet : ' + this.text);
          failure += 1;
        }
      }.bind({
        socket: this,
        t: t,
        failures = failures
      }) );
    }
    // if failures are detected, fetch more tweets bitch
    if ( failures > 0 ) {
      twit.get('search/tweets', {
        q: global.last_query.track + ' source:vine_for_ios exclude:retweets',
        result_type: global.last_query.result_type,
        count: failures,
        max_id: global.last_twitter_id
      }, twitter.sendTweet(socket));
    }
  }.bind(socket)
}