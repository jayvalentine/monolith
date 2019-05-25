/// <reference path="./region.ts">
/// <reference path="./random.ts">

class Game {
  private day: number;

  private regions: Region[]; 

  constructor() {
    this.day = 0;
    this.regions = [];
  }

  start() {
    this.day = 0;
    this.regions = [];

    // Generate a number of regions.
    const regionLimit : number = Random.interval(30, 50);
    for (let i = 0; i < regionLimit; i++) {
      this.regions.push(new Region());
    }

    // Initial game message.
    this.displayMessage(
      `You awaken in a cold void. A glistening blue-green marble hangs below you.
      You slowly become aware of the various sensors attached to you, reading
      magnetic fields, temperature, radiation, and more.
      You observe Kepler 62-f slowly, and search for a landing site.`
    )

    // Determine a number of landing sites.
    let landingSites : Region[] = []

    let regionsCopy : Region[] = this.regions

    // Determine number of sites to pick.
    const landingSitesLimit : number = Random.interval(4, 8);
    for (let i = 0; i < landingSitesLimit; i++) {
      let r : Region = Random.choice(regionsCopy);
      landingSites.push(r);
      regionsCopy = regionsCopy.filter(function (value, index, array) {return value != r});
      console.log(regionsCopy.length)
    }

    this.displayMessage(
      `As your sensors engage you become aware of ${landingSitesLimit} landing sites
      on the planet below.`
    );

    for (let r of landingSites) {
      this.displayMessage(
        `${r.typeString()} with ${r.foodString()} food,
        ${r.waterString()} water, and ${r.resourcesString()} resources.`
      );
    }
  }

  displayMessage(message: string)
  {
    let displayFunction = function () {
      $("#GameMainScreen").append(`<p>${message}</p>`).hide().fadeIn(1000);
    }

    $.when(displayFunction()).done(function () {});
  }
}