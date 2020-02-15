/// <reference path="./tribe_events.ts">
$(document).ready(function () {
    $("#VersionString").text("Version 0.1 (" + TribeEvents.length + " events)");
    $("#StartTitle").hide();
    $("#StartText").hide();
    $("#StartVersionInfo").hide();
    $("#StartTitle").fadeIn(4000, function () {
        $("#StartText").fadeIn(1000, function () {
            $("#StartVersionInfo").fadeIn(500, function () { });
        });
    });
});
