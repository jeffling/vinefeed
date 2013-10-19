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
      var vineUrlMatch = /https?:\/\/t\.co\/[A-Za-z0-9]+/.exec(tweet.text);
      t.user = tweet.user.screen_name;
      t.id = tweet.id_str;
      t.text = tweet.text;
      t.vineUrl = (vineUrlMatch) ? vineUrlMatch[0] : "err";
      t.vidUrl = '';
      t.thumbUrl = '';

      request( t.vineUrl, function(error, response, body) {
        if (error) {
          console.log('\nfailed to load tweet : ' + this.t.text + '\n');
          console.log(error);
          count--;
          return;
        }

        var videoMatch = /<meta.*?property="twitter:player:stream".*?content="(.*?)"/.exec(body);

        var thumbnailMatch = /<meta.*?property="og:image".*?content="(.*?)"/.exec(body);

        if(videoMatch && thumbnailMatch && response.statusCode == 200) {
          this.t.vidUrl = videoMatch[1];
          this.t.thumbUrl = thumbnailMatch[1];
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