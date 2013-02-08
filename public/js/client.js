

// if firefox, default to flash
if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
  VideoJS.options={techOrder:["flash","html5"]};
  console.log (_V_.options.techOrder);
}
var filter = 'vine';
$(document).ready(function() {

  var socket = io.connect();
  var virgin = true;

  // initialize by finding all vine things
  socket.on('connect', function() {
    if (virgin) {
      socket.emit('track', {
        track: filter
      });
    }
  });
  socket.on('disconnect', function () {
    virgin = false;
  });

  var i = 0;
  socket.on('tweet', function(data) {
    if(Math.floor(i % 4) == 0) {
      $("<div id='row" + Math.floor(i / 4) + "' class='row show-grid'>").appendTo("#videos");
      if(i > 3) {
        var current_row = $("#row" + Math.floor(i / 4));
        var prev_top_css = current_row.prev().position().top + 230;
        current_row.css({
          "position": "absolute",
          "top": prev_top_css + "px"
        });
      }
    }
    var vine_link = $("<a>", {
      href: "https://twitter.com/" + data.tweet.user + "/status/" + data.tweet.id
    });
    var new_video = $("<video id='" + data.tweet.id + "' class='video-js vjs-default-skin bigger magnify' loop preload='metadata' width='200' height='200' src='" + data.tweet.vid_url + "''></video>");
    var tooltip = $("<div class='ttip'>@" + data.tweet.user + ': ' + data.tweet.text + "</div>")
    $("<div class='span3 item'>").append(new_video).append(tooltip).appendTo("#row" + Math.floor(i / 4));
    i++;    

    $("#" + data.tweet.id).parent().wrap(vine_link);

    // hide the parent initially until loaded
    $("#" + data.tweet.id).parent().hide();

    $("#" + data.tweet.id).css({
      "width": "",
      "height": ""
    });


    // when video is loaded (or at the very least the thumbnail)
    _V_(data.tweet.id).addEvent("loadeddata", function() {
      this.volume(0);
      $("#" + data.tweet.id).parent().fadeIn("slow").show();
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
  });

  $('#searchbar').submit(function() {
    filter = $("input:first").val(); //TODO: Use identifiers
    $("#videos").empty();
    i = 0;
    socket.emit('track', {
      track: filter
    });
    return false;
  });

});