// Application state variables
var state = {
  // initial filter - all tweets will have vine in the title. hopefully. 
  filter: 'vine',
  // first run or not
  virgin: true,
  // daryn's crazy row thing
  i: 0,
  // max_id for keeping track of which video is what
  max_id: '0'
};

function clearVideos() {
    $(".spinner").remove();
    $("#videos").empty();
    state.i = 0;
}

function fetchTweets(query) {
  $.getJSON('api/tweets', query, function (data) {
        for (var x = 0; x < data.length; x++ )
          presentTweet(data[x]);
      } );
}


function presentTweet(data) {
  // set max_id
  if (state.max_id == 0 || state.max_id > data.id)
    state.max_id = data.id;

  //create a row for every 4 videos
  if(Math.floor(state.i % 4) == 0) {
    $("<div id='row" + Math.floor(state.i / 4) + "' class='row show-grid'>").appendTo("#videos");
    if(state.i > 3) {
      var current_row = $("#row" + Math.floor(state.i / 4));
      var prev_top_css = current_row.prev().position().top + 230;
      current_row.css({
        "position": "absolute",
        "top": prev_top_css + "px"
      });
    }
  }

  /* Setup video and place in row.
     1. Set video
     2. Set tooltip
     3. Set link to twitter url
     4. Set poster
   */
  var new_video = $("<video id='" + data.id + "' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200' poster='" + data.thumb_url + "' src='" + data.vid_url + "'></video>");
  var tooltip = $("<div class='ttip'>@" + data.user + ': ' + data.text + "</div>")
  $("<div id='" + data.id + "-container' class='span3 item'>").append(new_video).append(tooltip).appendTo("#row" + Math.floor(state.i / 4));
  state.i++;
  var vine_link = $("<a>", {
    href: "https://twitter.com/" + data.user + "/status/" + data.id
  });
  $("#" + data.id).parent().wrap(vine_link);

  // need to be done when player is ready to account for video.js preprocessing
  _V_(data.id).addEvent("loadstart", function() {
    // hide the parent initially until loaded. 
    //$("#" + data.id).hide();
    // load spinner
    //$("#" + data.id).parent().spin();
  });
  // when video is loaded (or at the very least the thumbnail)
  _V_(data.id).addEvent("loadeddata", function() {
    //$("#" + data.id).parent().spin(false);
    //$("#" + data.id).fadeIn("slow");
    this.volume(0);
  });
  // mouseover in, mouseover out callbacks
  $("#" + data.id).hover(function() {
    _V_(data.id).volume(1);
    _V_(data.id).play();
    // $(this).children().prop('controls', true);
    $("#" + data.id).parent().css("z-index", "2");
  }, function() {
    _V_(data.id).volume(0);
    _V_(data.id).pause();
    // $(this).children().prop('controls', false);
    $("#" + data.id).parent().css("z-index", "1");
  });
}


// if firefox, default to flash
if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
  VideoJS.options = {
    techOrder: ["flash", "html5"]
  };
}


$(document).ready(function() {
  $('#searchBtn').hide();

  // initialize by finding all vine things
  if( state.virgin ) {
    fetchTweets({track: state.filter,
      result_type: 'recent',
      count: 12});
    state.virgin = false;
  }

  // element callbacks
  $('#searchBar').keydown(function() {
    if ($('#moreBtn').is(":visible")) {
      $('#moreBtn').hide();
      $('#searchBtn').show();
    }
  });
  $('#searchBtn').click(function() {
    state.filter = $('#searchBar').val(); //TODO: Use identifiers
    if(state.filter == '') {
      state.filter = 'vine';
    }
    clearVideos();
    state.max_id = 0;
    fetchTweets({  
      track: state.filter,
      result_type: 'recent',
      count: 12});
    $(this).hide();
    $('#moreBtn').show();
    return false;
  });

  $('#moreBtn').click(function() {
    clearVideos();
    fetchTweets({  
      track: state.filter,
      result_type: 'recent',
      count: 12,
      max_id: state.max_id});
    return false;
  });

  $('#searchForm').submit(function() {
    return false;
  })
});