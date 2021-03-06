import $ from "jquery";

import { Random } from "./random";
import { Region } from "./region";
import { RegionEvents } from "./region_events";
import { Tribe, Attitudes } from "./tribe";
import {TribeEvents } from "./tribe_events";

export class Game {
  private day: number;

  private regions: Region[]; 

  private events: string[][];
  private outcomes : (() => void)[][];
  private outcomeMessages : string[][];

  private choiceFlag : Game.Choice;
  private choiceIndex : number;
  private choices : string[];
  private choiceOutcomes : (() => void)[];
  private choiceOutcomeMessages : string[];

  constructor() {
    this.day = 0;
    this.regions = [];
    this.events = [];
    this.choiceFlag = Game.Choice.None;
    this.choices = [];
    this.choiceIndex = -1;
    this.choiceOutcomes = [];
    this.choiceOutcomeMessages = [];
    this.outcomes = [];
    this.outcomeMessages = [];
  }

  start() {
    this.day = 0;
    this.regions = [];
    this.events = [];
    this.choiceFlag = Game.Choice.None;
    this.choices = [];
    this.outcomes = [];
    this.outcomeMessages = [];

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

    // Generate a number of neighbours for each region.
    for (let region of this.regions) {
      // Get the list of other regions (i.e. filter this one out of the full list).
      let otherRegions = this.regions.filter(function (value, index, array) {return value != region});

      // 1-4 neighbours for each region.
      const numNearby : number = Random.interval(1, 4);
      for (let i = 0; i < numNearby; i++) {
        // Pick another region from the list.
        let other = Random.choice(otherRegions);

        // Set these two regions as neighbours.
        region.addNearbyRegion(other);

        // Exclude the region we've just picked from further selection.
        otherRegions = otherRegions.filter(function (value, index, array) {return value != other});
      }
    }

    // Initial game message.
    this.queueMessage(
      `You awaken in a cold void. A glistening blue-green marble hangs below you.
      You slowly become aware of the various sensors attached to you, reading
      magnetic fields, temperature, radiation, and more.
      You observe Kepler 62-f slowly, and search for a landing site.`,
      function () {}
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
      on the planet below.`,
      function () {}
    );

    let landingSiteChoices : string[] = [];
    let landingSiteOutcomes : (() => void)[] = [];
    let landingSiteOutcomeMessages : string[] = [];

    for (let r of landingSites) {
      landingSiteChoices.push(
        `A ${r.typeDescription()} region with ${r.foodString()} food,
        ${r.waterString()} water, and ${r.resourcesString()} resources.
        It has ${r.population()} inhabitants, split into ${r.tribesCount()} tribe(s).`
      );

      landingSiteOutcomes.push(function() {r.hasMonolith = true;});
      landingSiteOutcomeMessages.push("");
    }

    this.queueChoice(landingSiteChoices, landingSiteOutcomeMessages, landingSiteOutcomes);

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

      this.choiceOutcomes[this.choiceIndex]();
      this.choiceOutcomes = [];

      this.displayMessage(this.choiceOutcomeMessages[this.choiceIndex]);
      this.choiceOutcomeMessages = [];

      this.choiceFlag = Game.Choice.None;
    }

    else if (this.events.length > 0) {
      let e: string[] = this.events.shift()!;
      let o: (() => void)[] = this.outcomes.shift()!;
      let m: string[] = this.outcomeMessages.shift()!;

      if (e[0] == "message") {
        // Perform the outcome, even if it is nothing.
        o[0]();

        // Display the message.
        this.displayMessage(e[1]);
      }

      else if (e[0] == "choice") {
        this.startChoice(e.slice(1), m, o);
        setTimeout(this.run.bind(this), 1);
      }
    }

    else {
      // Initialise population count to 0.
      let populationCount : number = 0;
      let tribesCount : number = 0;

      // See if any region events trigger.
      for (let region of this.regions) {
        for (let regionEvent of RegionEvents) {
          // If this region event triggers on this region, queue a message.
          if (regionEvent.triggers(region)) {
            this.queueMessage(regionEvent.outcomeMessage(region), regionEvent.outcomeFunction(region));
          }
        }

        let tribesToRemove : Tribe[] = []

        for (let tribe of region.tribes()) {
          if (tribe.dead) tribesToRemove.push(tribe);
          else {
            // If the tribe has been encountered, add its population to the total.
            if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered) {
              populationCount += tribe.population();
              tribesCount++;
            }

            let triggered : boolean = false;

            for (let tribeEvent of TribeEvents) {
              // If this tribe event triggers on this tribe, queue a message or a choice.
              if (!triggered && tribeEvent.triggers(tribe, region, tribe.progress(tribeEvent))) {
                // Reset progress towards the event.
                tribe.resetProgress(tribeEvent);

                if (tribeEvent.isChoice()) {
                  this.queueMessage(tribeEvent.choicePrompt(tribe), function () {});
                  this.queueChoice(tribeEvent.choices(tribe),
                                  tribeEvent.outcomeMessages(tribe, region),
                                  tribeEvent.outcomeFunctions(tribe, region));
                }
                else {
                  // If the event is not a choice, we can safely assume it has exactly one outcome.
                  this.queueMessage(tribeEvent.outcomeMessages(tribe, region)[0],
                                    tribeEvent.outcomeFunctions(tribe, region)[0]);
                }

                triggered = true;
              }
              else {
                tribe.increaseProgress(tribeEvent, tribeEvent.progress(tribe, region));
              }
            }

            tribe.grow();
          }
        }

        // Remove all the dead tribes.
        for (let tribe of tribesToRemove) {
          region.removeTribe(tribe);
        }
      }

      // Increment day count.
      this.day += 1;

      // Trigger again in 50ms.
      setTimeout(this.run.bind(this), 20);

      let populationString : string;

      if (populationCount > 1000000) {
        populationString = `${(populationCount/1000000).toFixed(2)}M`;
      }
      else if (populationCount > 1000) {
        populationString = `${(populationCount/1000).toFixed(2)}K`;
      }
      else {
        populationString = `${populationCount}`;
      }

      $("#GameDate").text(`Year ${Math.floor(this.day / 276)}, Day ${this.day % 276}. Population ${populationString}, ${tribesCount} Tribes (Encountered).`);
    }
  }

  startChoice(choices: string[], outcomeMessages: string[], outcomes: (() => void)[]) {
    this.choiceFlag = Game.Choice.Started;
    this.choiceIndex = 0;
    this.choices = choices;
    this.choiceOutcomes = outcomes;
    this.choiceOutcomeMessages = outcomeMessages;
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
        $(`#choice-${i}`).removeAttr('id');
      }
    }

    this.choiceIndex = choice;
    this.choiceFlag = Game.Choice.Done;
  }

  // Add a message to the queue.
  queueMessage(message: string, outcome: (() => void)) {
    this.events.push(["message", message]);
    this.outcomes.push([outcome]);
    this.outcomeMessages.push([""]);
  }

  // Add a choice to the choice queue.
  queueChoice(choice: string[], outcomeMessages: string[], outcomes: (() => void)[]) {
    this.events.push(["choice"].concat(choice));
    this.outcomes.push(outcomes);
    this.outcomeMessages.push(outcomeMessages);
  }

  displayMessage(message: string) {
    // Do nothing but trigger the run method if the message is empty.
    if (message.length == 0) {
      setTimeout(this.run.bind(this), 1);
      return;
    }

    // Fade the message in.
    $(`<p>${message}</p>`).insertBefore("#GameDate")
    .hide().fadeIn(1000);

    // Trigger the run method 2 seconds from now.
    setTimeout(this.run.bind(this), 2000);

    // Force scroll to the bottom of the screen.
    $('html, body').scrollTop($("#GameDate")!.offset().top);
  }

  displayChoice(index: number, choice: string) {
    console.log(`Displaying choice ${index}.`);

    // Fade the choice in. Trigger the run method again once the fade in has completed.
    $(`<p id='choice-${index}' class='clickable'>${choice}</p>`)
    .click(() => this.makeChoice(index))
    .insertBefore("#GameDate")
    .hide().fadeIn(500, this.run.bind(this));

    // Force scroll to the bottom of the screen.
    $('html, body').scrollTop($("#GameDate")!.offset().top);
  }
}

export namespace Game {
  export enum Choice {
    None,
    Waiting,
    Started,
    Done
  }
}