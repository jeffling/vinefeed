// Application state variables
var state = {
  // initial filter - all tweets will have vine in the title. hopefully. 
  filter: 'vine',
  // first run or not
  virgin: true,
  // daryn's crazy row thing
  i: 0,
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
  var new_video = $("<video id='" + data.id + "' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200' src='" + data.vid_url + "'></video>");
  var tooltip = $("<div class='ttip'>@" + data.user + ': ' + data.text + "</div>")
  $("<div id='" + data.id + "-container' class='span3 item'>").append(new_video).append(tooltip).appendTo("#row" + Math.floor(state.i / 4));
  state.i++;
  // wrap the vine feed thing with an link
  var vine_link = $("<a>", {
    href: "https://twitter.com/" + data.user + "/status/" + data.id
  });
  $("#" + data.id).parent().wrap(vine_link);
  // load spinner
  $("#" + data.id).parent().spin();
  // need to be done when player is ready to account for video.js preprocessing
  _V_(data.id).addEvent("loadstart", function() {
    // hide the parent initially until loaded. 
    $("#" + data.id).hide();
  });
  // when video is loaded (or at the very least the thumbnail)
  _V_(data.id).addEvent("loadeddata", function() {
    $("#" + data.id).parent().spin(false);
    $("#" + data.id).fadeIn("slow").show();
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
  // initialize by finding all vine things
  if( state.virgin ) {
    $.getJSON('api/tweets',{  
      track: state.filter,
      result_type: 'recent',
      count: 12}, function (data) {
        for (var x = 0; x < data.length; x++ )
          presentTweet(data[x]);
      } );
    state.virgin = false;
  }


  // element callbacks
  $('#searchbar').submit(function() {
    state.filter = $("input:first").val(); //TODO: Use identifiers
    if(state.filter == '') {
      state.filter = 'vine';
    }
    $("#videos").empty();
    state.i = 0;
    $.getJSON('api/tweets',{  
      track: state.filter,
      result_type: 'recent',
      count: 12}, function (data) {
        for (var x = 0; x < data.length; x++ )
          presentTweet(data[x]);
      } );
    return false;
  });

  // still can't handle this shit
  // $(window).scroll(function() {
  //   if(($(window).scrollTop() >= $(document).height() - $(window).height() - 10) && (state.loading == 0) && (state.virgin == false)) {
  //     console.log('more requested');
  //     socket.emit('track', {
  //       track: state.filter,
  //       result_type: 'recent',
  //       count: 12
  //     });
  //     state.loading += 12;
  //   }
  // });
});