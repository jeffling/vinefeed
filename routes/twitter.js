var request = require('request');

// return a bound function with socket
// TODO: This is literally the worse thing ever. I've created a monster. If I could punch past jeff in the face I would
exports.getTweet = function(res) {
  return function(err, reply) {
    if (err) {
      console.log(err);
      res.json('500', err);
      return;
    }
    if (reply.statuses.length == 0) {
      res.json('404', 'No videos found with that query.');
      return;
    }
    var results = [];
    var count = reply.statuses.length;

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
        if (error) {
          console.log(error);
          count--;
          return;
        }
        var videoPattern = /<meta.*?property="twitter:player:stream".*?content="(.*?)"/;
        var videoUrlMatch = videoPattern.exec(body);

        var thumbnailPattern = /<meta.*?property="og:image".*?content="(.*?)"/;
        var thumbnailUrlMatch = thumbnailPattern.exec(body);
        if(videoUrlMatch != null && !error && response.statusCode == 200) {
          this.t.vid_url = videoUrlMatch[1];
          this.t.thumb_url = thumbnailUrlMatch[1];
          aggregate(this.t);
        }
        // note and and keep track of failure 
        else {
          console.log('\nfailed to load tweet : ' + this.t.text + '\n');
          count--;
        }
      }.bind({t:t}));
    }

    // this function aggregates all the results and sends when the right amount of stuff is aggregated
    // I can see why Node.JS isn't for everything
    function aggregate(t) {
      results.push(t);
      if (results.length == count) {
        res.json(results);
      }
    }
  }
};