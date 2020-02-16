/// <reference path="./tribe_events.ts">

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

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    $("body").css("border-left", "2px solid");
    $("body").css("border-right", "2px solid");
  }

})