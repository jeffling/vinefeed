var Twit = require('twit')

var T = new Twit({
    consumer_key:         'gA11sspNJdtdCL2gWDQqFA', 
    consumer_secret:      'uhBxdHaryjLcAcC9D985WYNbyT9LAzK03FMDbfnBZfc',
    access_token:         '150977185-F3trFzvsc3qjFd8DlrMbkWJXjj97IiHkifvP4EjR', 
    access_token_secret:  'GOA66sBv471fk8HPYSwomCsarmeO17FYg0Fa6Ao9E'
})

//
//  filter the twitter public stream by the word 'mango'. 
//
var stream = T.stream('statuses/filter', { track: 'vine.co' })
stream.on('tweet', function (tweet) {
  console.log(tweet)
})

//
// filter the public stream by the latitude/longitude bounded box of San Francisco
//
// var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]

// var stream = T.stream('statuses/filter', { locations: sanFrancisco })

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })