// <reference path="tribe_events">

$(document).ready(function() {
  $("#VersionString").text(`Version 0.1 (${TribeEvents.length} events)`);
  $("#StartTitle").hide();
  $("#StartText").hide();
  $("#StartVersionInfo").hide();

  $("#StartTitle").fadeIn(4000, function () {
    $("#StartText").fadeIn(1000, function () {
      $("#StartVersionInfo").fadeIn(500, function () {})
    });
  });

  var width = screen.width * window.devicePixelRatio;

  if (width < 700) {
    $("body").css("border-left", "2px solid");
    $("body").css("border-right", "2px solid");
  }

})
