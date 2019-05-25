/// <reference path="./region.ts">
/// <reference path="./random.ts">
/// <reference path="./tribe.ts">

class Game {
  private day: number;

  private regions: Region[]; 

  private messages: string[];

  constructor() {
    this.day = 0;
    this.regions = [];
    this.messages = [];
  }

  start() {
    this.day = 0;
    this.regions = [];
    this.messages = [];

    // Generate a number of regions.
    const regionLimit : number = Random.interval(30, 50);
    for (let i = 0; i < regionLimit; i++) {
      // Create a new region.
      let r : Region = new Region();

      // Add as many tribes as there are food in the region.
      for (let f = 0; f < r.food(); f++) {
        let t : Tribe = new Tribe(Random.interval(30, 90));
        r.addTribe(t);
      }

      this.regions.push(r);
    }

    // Initial game message.
    this.queueMessage(
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

    this.queueMessage(
      `As your sensors engage you become aware of ${landingSitesLimit} landing sites
      on the planet below.`
    );

    for (let r of landingSites) {
      this.queueMessage(
        `${r.typeString()} with ${r.foodString()} food,
        ${r.waterString()} water, and ${r.resourcesString()} resources.
        It has ${r.population()} inhabitants, split into ${r.tribesCount()} tribe(s).`
      );
    }

    this.run();
  }

  run() {
    // Check to see if any messages need displaying.
    console.log(this.messages.length);
    if (this.messages.length > 0) {
      this.displayMessage(this.messages.shift());
    }
    else {
      // Increment day count.
      this.day += 1;

      // Trigger again in 100ms.
      setTimeout(this.run.bind(this), 100);
    }
  }

  // Add a message to the queue.
  queueMessage(message: string) {
    this.messages.push(message);
  }

  displayMessage(message: string)
  {
    // Fade the message in. Trigger the run method again once the fade in has completed.
    $(`<p>${message}</p>`).appendTo("#GameMainScreen").hide().fadeIn(1000, this.run.bind(this));
  }
}