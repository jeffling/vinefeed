// Application state variables
var state = {
  filter: 'vine',  // initial filter - all tweets will have vine in the title. hopefully. 
  virgin: true,  // first run or not
  i: 0, // daryn's crazy row thing
  loading: 0; // keep track of how many videos are still loading
};

function presentTweet(data) {
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
  var new_video = $("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200' src='" + data.tweet.vid_url + "''></video>");
  var tooltip = $("<div class='ttip'>@" + data.tweet.user + ': ' + data.tweet.text + "</div>")
  $("<div class='span3 item'>").append(new_video).append(tooltip).appendTo("#row" + Math.floor(state.i / 4));
  state.i++;
  // wrap the vine feed thing with an link
  var vine_link = $("<a>", {
    href: "https://twitter.com/" + data.tweet.user + "/status/" + data.tweet.id
  });
  $("#" + data.tweet.id).parent().wrap(vine_link);
  // load spinner
  $("#" + data.tweet.id).parent().spin();
  // need to be done when player is ready to account for video.js preprocessing
  _V_(data.tweet.id).addEvent("ready", function() {
    // hide the parent initially until loaded. 
    $("#" + data.tweet.id).parent().children().hide();
  });
  // when video is loaded (or at the very least the thumbnail)
  _V_(data.tweet.id).addEvent("loadeddata", function() {
    $("#" + data.tweet.id).parent().spin(false);
    $("#" + data.tweet.id).parent().children().fadeIn("slow").show();
    state.loading -= 1;
    this.volume(0);
  });
  // mouseover in, mouseover out callbacks
  $("#" + data.tweet.id).hover(function() {
    _V_(data.tweet.id).volume(1);
    _V_(data.tweet.id).play();
    // $(this).children().prop('controls', true);
    $("#" + data.tweet.id).parent().css("z-index", "2");
  }, function() {
    _V_(data.tweet.id).volume(0);
    _V_(data.tweet.id).pause();
    // $(this).children().prop('controls', false);
    $("#" + data.tweet.id).parent().css("z-index", "1");
  });
}


// if firefox, default to flash
if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
  VideoJS.options = {
    techOrder: ["flash", "html5"]
  };
  console.log(_V_.options.techOrder);
}


$(document).ready(function() {
  var socket = io.connect();
  // initialize by finding all vine things
  socket.on('connect', function() {
    if(state.virgin) {
      socket.emit('track', {
        track: state.filter,
        result_type: 'recent',
        count: 12
      });
      state.loading += 12;
      state.virgin = false;
    }
  });
  // when we get a tweet from the server
  socket.on('tweet', function(data) {
    presentTweet(data);
  });
  // element callbacks
  $('#searchbar').submit(function() {
    state.filter = $("input:first").val(); //TODO: Use identifiers
    $("#videos").empty();
    state.i = 0;
    socket.emit('track', {
      track: state.filter,
      result_type: 'recent',
      count: 12
    });
    state.loading += 12;
    return false;
  });

  // $(window).scroll(function() {
  //   if($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
  //     socket.emit('more', {});
  //   }
  // });
});