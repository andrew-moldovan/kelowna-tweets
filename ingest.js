var Twitter = require('twitter');
var elasticsearch = require('elasticsearch');

var twitterClient = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var elasticsearchClient = new elasticsearch.Client({
  host: ''
});

var q = "kelowna,okanagan,ylw"
twitterClient.stream('statuses/filter', {track: q},  function(stream){
  stream.on('data', function(tweet) {
    tweet.timestamp = new Date(tweet.created_at);
    console.log(tweet.text);
    postToES(tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

function postToES(tweet) {
  elasticsearchClient.create({
    id: tweet.id,
    index: 'kelowna_tweets',
    type: 'tweets',
    body: tweet
  }, function (error) {
    if (error) {
      console.trace(error);
    } else {
      console.log('Tweet added successfully');
    }
  });
}
