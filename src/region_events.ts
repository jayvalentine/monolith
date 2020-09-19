// <reference path="region">

interface RegionEvent {
  triggers(region: Region) : boolean;

  outcomeMessage(region: Region) : string;
  outcomeFunction(region: Region) : (() => void);
}

class LandingEvent {
  static done : boolean = false;

  static triggers(region: Region) {
    if (LandingEvent.done) return false;

    if (region.hasMonolith) {
      LandingEvent.done = true;
      return true
    }
    
    return false;
  }

  static outcomeMessage(region: Region) {
    return `Your temperature sensors flail wildly as you scream through the planet's atmosphere,
    blazing a trail through the sky. You slam into the ground with an earth-shattering thud, coming to rest
    in a ${region.typeDescription()} region.`;
  }

  static outcomeFunction(region: Region) {
    return function () {console.log(`Landing event triggered in ${region.typeDescription()} region.`)};
  }
}

let RegionEvents : RegionEvent[] = [
  LandingEvent,
]