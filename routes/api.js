var twitter = require('./twitter')
, config = require('../config')
, Twit = require('twit');

var twit = new Twit(config.twitConfig);

exports.getTweets = function(req, res) {
	twit.get('search/tweets', {
		q: req.query.track + ' vine.co/v/ exclude:retweets',
		result_type: req.query.result_type,
		count: req.query.count,
		max_id: req.query.max_id
	}, twitter.getTweet(res));
};