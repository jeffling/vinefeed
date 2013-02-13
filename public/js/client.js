// Application state variables
var state = {
  // initial filter - all tweets will have vine in the title. hopefully. 
  filter: 'vine',
  // max_id for keeping track of which video is what
  max_id: '0'
};


// Initializes the players and other elements
function playersInit(data) {
  var i = 0;
  var player, ttip, spinner, vine_link;
  for(var row = 0; row < 3; row++) {
    for(var item = 0; item < 4; item++) {
      player = $("<video id='" + i + "-player' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200'></video>");
      ttip = $('<div>', {
        id: i + '-ttip',
        'class':'ttip'
      });
      spinner = $('<img>', {
        id: i + '-spinner',
        'class':'spinner',
        src:'img/ajax-loader.gif'
      });
      $('#item-' + i).append(spinner).append(player).append(ttip);
      $('#item-' + i).wrap($("<a>", {
        id: i + '-link',
        'class': "vine_link",
        href: "#"
      }));
      // when video is loaded (or at the very least the thumbnail)
      _V_(i + '-player').addEvent("loadedmetadata", function() {
        $('#' + this + '-spinner').hide();
        $('#' + this + '-player').show();
        $('#' + this + '-ttip').show();
      }.bind(i));
      // mouseover in, mouseover out callbacks
      $("#" + i + '-player').hover(function() {
        _V_(this + '-player').volume(1);
        _V_(this + '-player').play();
        $("#" + this + '-player').parent().css("z-index", "2");
      }.bind(i), function() {
        _V_(this + '-player').volume(0);
        _V_(this + '-player').pause();
        $("#" + this + '-player').parent().css("z-index", "1");
      }.bind(i));
      i++;
    }
  }
}


// if firefox, default to flash
if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
  VideoJS.options.techOrder = ["flash", "html5"];
}


// clears the screen of current videos and preps for next video
function clearVideos() {
  var spinner;
  for(var i = 0; i < 12; i++) {
    $('#' + i + '-player').hide();
    $('#' + i + '-spinner').show();
    $('#' + i + '-ttip').html();
    $('.ttip').hide();
    $('.vine_link').prop('href', '#');
  }
}


// Fetches the tweets from the server given a twitter API query
function fetchTweets(query) {
  console.log(query);
  $.getJSON('api/tweets', query, function(data) {
    for(var i = 0; i < data.length; i++)
    presentTweet(data[i], i);
  });
}



// Sets the players to the new tweets
function presentTweet(data, i) {
  // set max_id to avoid duplicate videos
  if(state.max_id == 0 || state.max_id > data.id) state.max_id = data.id;

  _V_(i + '-player').src(data.vid_url);
  $('#' + i + '-ttip').html('<strong>@' + data.user + '</strong> - ' + data.text);
  $('#' + i + '-link').prop('href', "https://twitter.com/" + data.user + "/status/" + data.id);
}


// sets the window has
function setHash() {
  if ($('#searchBar').val() == '') {
    document.location.hash == ''
    state.filter = 'vine';
  }
  else {
    document.location.hash = $('#searchBar').val();
    state.filter = document.location.hash.slice(1);
  }
}


$(document).ready(function() {
  playersInit();
  clearVideos();
  // initialize by finding all vine things
  if (document.location.hash != '') {
    state.filter = document.location.hash.slice(1);
    $('#searchBar').val(document.location.hash.slice(1)); 
  }
  fetchTweets({
    track: state.filter,
    result_type: 'recent',
    count: 12
  });

  // element callbacks
  $('#moreBtn').click(function() {
    clearVideos();
    fetchTweets({
      track: state.filter,
      result_type: 'recent',
      count: 12,
      max_id: state.max_id
    });
    return false;
  });

  $('#searchForm').submit(function() {
    setHash();
    clearVideos();
    state.max_id = 0;
    fetchTweets({
      track: state.filter,
      result_type: 'recent',
      count: 12
    });
    return false;
  })
});