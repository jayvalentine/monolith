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

  var dpi_x = document.getElementById('dpi').offsetWidth;
  var width = screen.width / dpi_x;

  if (width < 5) {
    $("body").css("border-left", "2px solid");
    $("body").css("border-right", "2px solid");
  }

})