var twitter = require('./twitter')
, config = require('../config')
, Twit = require('twit')
, async = require('async');

var twit = new Twit(config.twitConfig);

exports.getTweets = function(req, res) {
	twit.get('search/tweets', {
		q: req.query.track + ' source:vine_for_ios exclude:retweets',
		result_type: req.query.result_type,
		count: req.query.count,
		max_id: req.query.max_id
	}, twitter.getTweet(res, req.query.count));
};