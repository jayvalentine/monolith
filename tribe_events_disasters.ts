/// <reference path="random.ts">
/// <reference path="tribe.ts">
/// <reference path="region.ts">

class FireSpreadsEvent {
  public static id : string = "FireSpreadsEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    if (!(tribe.hasTechnology("fire") && tribe.hasTechnology("construction"))) return false

    if (tribe.hasCulture("cautious")) return Random.chance(0.000001);
    else return Random.chance(0.00003);
  }

  static progress(tribe: Tribe, region: Region) : number {
    return 0;
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "They are being punished.",
      "This is a learning experience."
    ];
  }

  static choicePrompt(tribe: Tribe) : string {
    return `One day, while a member of ${tribe.title()} is cooking with fire, the roof of their home
    catches alight. Before long, multiple buildings are in flames. The tribespeople desperately try
    to put out the fire, and succeed, but not before it has caused significant damage.`;
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [
      `The tribe sees this as a punishment, but for what, they are not sure.`,
      `The tribe has suffered heavy losses, but finds the strength to continue, and learn how to control the fire better.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        // 20% chance for tribe to become superstitious,
        // 80% chance for tribe to become fearful.
        // Tribe gains the 'disasters are punishment' culture.
        if (Random.chance(0.2)) {
          tribe.attitudes.monolith = Attitudes.Monolith.Superstitious;
        }
        else {
          tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
        }

        tribe.addCulture("disastersArePunishment");

        // Tribe population reduced by 30-70%.
        const currentPopulation : number = tribe.population();
        const lowerLimit = Math.floor(currentPopulation*0.3);
        const upperLimit = Math.floor(currentPopulation*0.7);

        tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));

        console.log(`New population: ${tribe.population()}`);
      },
      function () {
        // 50% chance for tribe to become curious,
        // 50% chance for tribe to become fearful.
        if (Random.chance(0.5)) {
          tribe.attitudes.monolith = Attitudes.Monolith.Curious;
        }
        else {
          tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
        }

        // Tribe population reduced by 30-70%.
        const currentPopulation : number = tribe.population();
        const lowerLimit = Math.floor(currentPopulation*0.3);
        const upperLimit = Math.floor(currentPopulation*0.7);

        tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));

        tribe.addCulture("cautious");

        console.log(`New population: ${tribe.population()}`);
      }
    ];
  }
}

class DroughtEvent {
  public static id : string = "DroughtEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    if (!tribe.hasTechnology("agriculture")) return false;
    
    // Chance dependent on water in region.
    // 0 chance if water > 2.
    switch (region.water()) {
      case 0: return Random.chance(0.0005);
      case 1: return Random.chance(0.0001);
      case 2: return Random.chance(0.00005);
      default: return false;
    }
  }

  static progress(tribe: Tribe, region: Region) : number {
    return 0;
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "They are being punished.",
      "They must leave this barren place.",
      "They must abandon their farms and hunt for food instead."
    ];
  }

  static choicePrompt(tribe: Tribe) : string {
    return `There have not been any rains in the region for some time, and the crops
    of ${tribe.title()} are suffering for it. It looks as though there will not be a harvest this year.`;
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    let outcomeMessages : string[] = []

    if (tribe.hasCulture("disastersArePunishment")) {
      outcomeMessages.push(
        `The tribe sees this as a sign of your displeasure.
        They begin praying in the hope that it will alleviate the drought,
        but it does not.`);
    }
    else {
      outcomeMessages.push(
        `The tribe sees this as some kind of punishment, but for what, they are not sure.`);
    }

    outcomeMessages.push(`The tribe moves on from the region, leaving their farms behind.`);
    outcomeMessages.push(`The tribe abandons agriculture, and transitions back to a hunter-gatherer society.`);

    return outcomeMessages;
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        // 20% chance for tribe to become superstitious,
        // 80% chance for tribe to become fearful.
        // Tribe gains the 'disasters are punishment' culture.
        if (Random.chance(0.2)) {
          tribe.attitudes.monolith = Attitudes.Monolith.Superstitious;
        }
        else {
          tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
        }

        tribe.addCulture("disastersArePunishment");

        // Tribe population reduced by 60-90%.
        const currentPopulation : number = tribe.population();
        const lowerLimit = Math.floor(currentPopulation*0.6);
        const upperLimit = Math.floor(currentPopulation*0.9);

        tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));

        console.log(`New population: ${tribe.population()}`);
      },
      function () {
        // Tribe migrates to another region.
        let otherRegions = region.nearby();

        let migrateRegion : Region = Random.choice(otherRegions);

        region.removeTribe(tribe);
        migrateRegion.addTribe(tribe);

        // Tribe population reduced by 60-90%.
        const currentPopulation : number = tribe.population();
        const lowerLimit = Math.floor(currentPopulation*0.6);
        const upperLimit = Math.floor(currentPopulation*0.9);

        tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));

        console.log(`New population: ${tribe.population()}`);
      },
      function () {
        // Tribe abandons agriculture.
        tribe.addCulture("abandonedAgriculture");
        tribe.removeTechnology("agriculture");

        // Tribe population reduced by 60-90%.
        const currentPopulation : number = tribe.population();
        const lowerLimit = Math.floor(currentPopulation*0.6);
        const upperLimit = Math.floor(currentPopulation*0.9);

        tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));

        console.log(`New population: ${tribe.population()}`);
      }
    ];
  }
}