// Application state variables
var state = {
  // initial filter
  filter: '',
  // max_id for keeping track of which video is what
  max_id: '0',
  // how many tweets we want. Maybe in the future we'll have some sort of variable layout
  count: 12,
  // result_type
  result_type: 'recent'
};


// Initializes the players and other elements
// TODO: switch to flowplayer so bad computers won't die
function playersInit() {
  var i = 0;
  var player, ttip, spinner, vine_link;
  for(var row = 0; row < 3; row++) {
    for(var item = 0; item < 4; item++) {
      player = $("<video id='" + i + "-player' class='video-js vjs-default-skin bigger magnify' loop preload='auto' width='200' height='200'></video>");
      ttip = $('<div>', {
        id: i + '-ttip',
        'class': 'ttip'
      });
      spinner = $('<img>', {
        id: i + '-spinner',
        'class': 'spinner spinner-margin',
        src: 'img/ajax-loader.gif',
        style: 'display: block;'
      });
        var videoItem = $('#item-' + i);
        videoItem.append(spinner).append(player).append(ttip);
        videoItem.wrap($("<a>", {
          id: i + '-link',
          'class': "vine_link",
          href: "#"
        }));
      // when video is loaded (or at the very least the thumbnail)
      _V_(i + '-player').addEvent("loadedmetadata", function() {
        console.log('loaded metadata');
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
  var spinner = $('.spinner');
  spinner.prop("src", "img/ajax-loader.gif");
  spinner.show();
  $('.ttip').hide();
  $('.vine_link').prop('href', '#');
  for(var i = 0; i < state.count; i++) {
    if (! (navigator.userAgent.toLowerCase().indexOf('firefox') != -1))
      $('#' + i + '-player').hide();
    $('#' + i + '-ttip').html();
  }
}


// Fetches the tweets from the server given a twitter API query
// TODO: use promises
function fetchTweets(query) {
  $.ajax({
    dataType: 'json',
    url: 'api/tweets',
    data: query,
    success: function(data) {
      for(var i = 0; i < data.length; i++)
        presentTweet(data[i], i);

      // hide failed videos >.> What a shitty way to work around a terrible terrible backend
      for(; i < state.count; i++) {
        $('#' + i + '-spinner').hide();
      }
    },
    error: function(jqXHR) {
      console.log(jqXHR);
      var alert = $('<div>', {
        'class': 'alert',
        html: '<strong>' + jqXHR.statusText + '</strong> - ' + jqXHR.responseText + '<a class="close" data-dismiss="alert" href="#">&times;</a>'
      });
      $('#videos').prepend(alert);
      $('.alert').alert();
      $('.spinner').hide();
    },
    timeout: 20000
  });
}


// Sets the players to the new tweets
function presentTweet(data, i) {
  // set max_id to avoid duplicate videos
  if(state.max_id == 0 || state.max_id > data.id) state.max_id = data.id - 1;

  // load thumbnail
  $('#' + i + '-spinner').prop("src", data.thumbUrl);

  // load the video and accompanying information
  _V_(i + '-player').src(data.vidUrl);
  $('#' + i + '-ttip').html('<strong>@' + data.user + '</strong> - ' + data.text);
  $('#' + i + '-link').prop('href', "https://twitter.com/" + data.user + "/status/" + data.id);
}


// sets the window has
function setHash() {
  var searchBar = $('#searchBar');
  if(searchBar.val() == '') {
    document.location.hash = '';
    state.filter = 'vine';
  } else {
    document.location.hash = searchBar.val();
    state.filter = document.location.hash.slice(1);
  }
}


$(document).ready(function() {
  playersInit();
  clearVideos();
  // initialize by finding all vine things
  if(document.location.hash != '') {
    state.filter = document.location.hash.slice(1);
    $('#searchBar').val(document.location.hash.slice(1));
  }
  fetchTweets({
    track: state.filter,
    result_type: state.result_type,
    count: state.count
  });

  // element callbacks
  $('#moreBtn').click(function() {
    clearVideos();
    fetchTweets({
      track: state.filter,
      result_type: state.result_type,
      count: state.count,
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
      result_type: state.result_type,
      count: state.count
    });
    return false;
  });

  // center the spinner cause it's tiny
  $( ".spinner" ).load(function() {
    if ( $( this ).height() > 100) {
      $( this ).removeClass( "spinner-margin" );
    }

    if ( $( this ).height() < 100) {
      $( this ).addClass( "spinner-margin" );
    }
  });
});