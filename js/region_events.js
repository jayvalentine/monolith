/// <reference path="./region.ts">
var LandingEvent = /** @class */ (function () {
    function LandingEvent() {
    }
    LandingEvent.triggers = function (region) {
        if (LandingEvent.done)
            return false;
        if (region.hasMonolith) {
            LandingEvent.done = true;
            return true;
        }
        return false;
    };
    LandingEvent.outcomeMessage = function (region) {
        return "Your temperature sensors flail wildly as you scream through the planet's atmosphere,\n    blazing a trail through the sky. You slam into the ground with an earth-shattering thud, coming to rest\n    in a " + region.typeDescription() + " region.";
    };
    LandingEvent.outcomeFunction = function (region) {
        return function () { console.log("Landing event triggered in " + region.typeDescription() + " region."); };
    };
    LandingEvent.done = false;
    return LandingEvent;
}());
var RegionEvents = [
    LandingEvent,
];
