/// <reference path="./region.ts">
/// <reference path="./random.ts">
/// <reference path="./tribe.ts">

class Game {
  private day: number;

  private regions: Region[]; 

  private events: string[][];

  private choiceFlag : Game.Choice;
  private choiceIndex : number;
  private choices : string[];
  private outcomes : (() => void)[];

  constructor() {
    this.day = 0;
    this.regions = [];
    this.events = [];
    this.choiceFlag = Game.Choice.None;
    this.choices = [];
  }

  start() {
    this.day = 0;
    this.regions = [];
    this.events = [];
    this.choiceFlag = Game.Choice.None;
    this.choices = [];
    this.outcomes = [];

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

    let landingSiteChoices : string[] = [];
    let landingSiteOutcomes : (() => void)[] = [];

    for (let r of landingSites) {
      landingSiteChoices.push(
        `A ${r.typeString()} region with ${r.foodString()} food,
        ${r.waterString()} water, and ${r.resourcesString()} resources.
        It has ${r.population()} inhabitants, split into ${r.tribesCount()} tribe(s).`
      );

      landingSiteOutcomes.push(function() {r.hasMonolith = true; console.log(`Monolith landed in ${r.typeString()}`);});
    }

    this.queueChoice(landingSiteChoices, landingSiteOutcomes);

    this.run();
  }

  run() {
    // Are we making a choice? If so, we give that priority over everything else.
    if (this.choiceFlag == Game.Choice.Started) {
      // Have we displayed all the choices yet? If not, display the next one.
      if (this.choiceIndex < this.choices.length) {
        this.displayChoice(this.choiceIndex, this.choices[this.choiceIndex])
        this.choiceIndex++;
      }
      // Otherwise just wait until a choice is made.
      else {
        this.choiceFlag = Game.Choice.Waiting;
        setTimeout(this.run.bind(this), 1);
      }
    }

    else if (this.choiceFlag == Game.Choice.Waiting) {
      setTimeout(this.run.bind(this), 10);
    }

    else if (this.choiceFlag == Game.Choice.Done) {
      console.log(`Choice made: ${this.choiceIndex}`);
      this.outcomes[this.choiceIndex]();
      this.outcomes = [];
      this.choiceFlag = Game.Choice.None;
    }

    else if (this.events.length > 0) {
      let e: string[] = this.events.shift();

      if (e[0] == "message") {
        this.displayMessage(e[1]);
      }

      else if (e[0] == "choice") {
        this.startChoice(e.slice(1));
        setTimeout(this.run.bind(this), 1);
      }
    }

    else {
      // Increment day count.
      this.day += 1;

      // Trigger again in 100ms.
      setTimeout(this.run.bind(this), 100);
    }
  }

  startChoice(choices: string[]) {
    this.choiceFlag = Game.Choice.Started;
    this.choiceIndex = 0;
    this.choices = choices;
  }

  makeChoice(choice: number) {
    // Return if we're still displaying the choices.
    if (this.choiceFlag != Game.Choice.Waiting) return;

    // Remove all choices except the one selected.
    for (let i = 0; i < this.choiceIndex; i++) {
      if (i != choice) {
        console.log(`Deleting choice ${i} from the DOM.`);
        $(`#choice-${i}`).remove();
      }
      else {
        $(`#choice-${i}`).removeClass('clickable');
        $(`#choice-${i}`).addClass('choice');
      }
    }

    this.choiceIndex = choice;
    this.choiceFlag = Game.Choice.Done;
  }

  // Add a message to the queue.
  queueMessage(message: string) {
    this.events.push(["message", message]);
  }

  // Add a choice to the choice queue.
  queueChoice(choice: string[], outcomes: (() => void)[]) {
    this.events.push(["choice"].concat(choice));
    this.outcomes = outcomes;
  }

  displayMessage(message: string) {
    // Fade the message in. Trigger the run method again once the fade in has completed.
    $(`<p>${message}</p>`).appendTo("#GameMainScreen")
    .hide().fadeIn(1000, this.run.bind(this));
  }

  displayChoice(index: number, choice: string) {
    console.log(`Displaying choice ${index}.`);

    // Fade the choice in. Trigger the run method again once the fade in has completed.
    $(`<p id='choice-${index}' class='clickable' onclick='Global.game.makeChoice(${index})'>${choice}</p>`)
    .appendTo("#GameMainScreen")
    .hide().fadeIn(500, this.run.bind(this));
  }
}

namespace Game {
  export enum Choice {
    None,
    Waiting,
    Started,
    Done
  }
}