// Application state variables
var state = {
  // initial filter - all tweets will have vine in the title. hopefully. 
  filter: 'vine',
  // first run or not
  virgin: true,
  // max_id for keeping track of which video is what
  max_id: '0'
};

// if firefox, default to flash
if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
  VideoJS.options.techOrder = ["flash", "html5"];
}

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

function fetchTweets(query) {
  $.getJSON('api/tweets', query, function(data) {
    for(var i = 0; i < data.length; i++)
    presentTweet(data[i], i);
  });
}

function playersInit(data) {
  var i = 0;
  var player, ttip, spinner, vine_link;
  for(var row = 0; row < 3; row++) {
    for(var item = 0; item < 4; item++) {
      player = $("<video id='" + i + "-player' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200'></video>");
      ttip = $("<div id='" + i + "-ttip'class='ttip'></div>");
      spinner = $("<img id='" + i + "-spinner' class='spinner' src='img/ajax-loader.gif'>");
      $('#item-' + i).append(spinner).append(player).append(ttip);
      $('#item-' + i).wrap($("<a>", {
        id: i + '-link',
        class: "vine_link",
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

function presentTweet(data, i) {
  // set max_id
  if(state.max_id == 0 || state.max_id > data.id) state.max_id = data.id;

  _V_(i + '-player').src(data.vid_url);
  $('#' + i + '-ttip').html('<strong>@' + data.user + '</strong> - ' + data.text);
  $('#' + i + '-link').prop('href', "https://twitter.com/" + data.user + "/status/" + data.id);
  /* Setup video and place in row.
     1. Set video
     2. Set tooltip
     3. Set link to twitter url
     4. Set poster
   */

  // var new_video = $("<video id='" + data.id + "' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200' src='" + data.vid_url + "'></video>");
  // var spinner = $("<img id='" + data.id + "-spinner' class='spinner' src='img/ajax-loader.gif'>");
  // var tooltip = $("<div class='ttip'>@" + data.user + ': ' + data.text + "</div>")
  // $("<div id='" + data.id + "-container' class='span3 item'>").append(spinner).append(new_video).append(tooltip).appendTo("#row" + Math.floor(state.i / 4));
  // state.i++;
  // var vine_link = $("<a>", {
  //   href: "https://twitter.com/" + data.user + "/status/" + data.id
  // });
  // $("#" + data.id).parent().wrap(vine_link);
  // // need to be done when player is ready to account for video.js preprocessing
  // _V_(data.id).addEvent("loadstart", function() {
  //   // hide the parent initially until loaded. 
  //   $("#" + data.id).hide();
  // });
  // // when video is loaded (or at the very least the thumbnail)
  // _V_(data.id).addEvent("loadedmetadata", function() {
  //   this.volume(0);
  //   $("#" + data.id + "-spinner").remove();
  //   $("#" + data.id).show();
  // });
  // // mouseover in, mouseover out callbacks
  // $("#" + data.id).hover(function() {
  //   _V_(data.id).volume(1);
  //   _V_(data.id).play();
  //   // $(this).children().prop('controls', true);
  //   $("#" + data.id).parent().css("z-index", "2");
  // }, function() {
  //   _V_(data.id).volume(0);
  //   _V_(data.id).pause();
  //   // $(this).children().prop('controls', false);
  //   $("#" + data.id).parent().css("z-index", "1");
  // });
}



$(document).ready(function() {
  playersInit();
  clearVideos();
  // initialize by finding all vine things
  if(state.virgin) {
    fetchTweets({
      track: state.filter,
      result_type: 'recent',
      count: 12
    });
    state.virgin = false;
  }

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
    state.filter = $('#searchBar').val();
    if(state.filter == '') {
      state.filter = 'vine';
    }
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