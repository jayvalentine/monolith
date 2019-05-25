/// <reference path="./tribe.ts">
/// <reference path="./random.ts">

interface TribeEvent {
  triggers(tribe: Tribe, region: Region) : boolean;

  isChoice() : boolean;
  choices() : string[];

  outcomeMessages(tribe: Tribe, region: Region) : string[];
  outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[];
}

class EncounterEvent {
  static newAttitude : Attitudes.Monolith;

  static triggers(tribe: Tribe, region: Region) : boolean {
    if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered) return false;

    else if (region.hasMonolith) return true;
    return false;
  }

  static isChoice() : boolean {
    return false;
  }

  static choices() : string[] {
    return [];
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    const roll = Random.interval(0, 2);
    switch (roll) {
      case 0: EncounterEvent.newAttitude = Attitudes.Monolith.Curious; break;
      case 1: EncounterEvent.newAttitude = Attitudes.Monolith.Superstitious; break;
      case 2: EncounterEvent.newAttitude = Attitudes.Monolith.Fearful; break;
    }

    return [`You encounter a tribe of ${tribe.population()} people. They seem ${Attitudes.MonolithString(EncounterEvent.newAttitude)}
    towards you.`];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    const attitude : Attitudes.Monolith = EncounterEvent.newAttitude;

    return [function () {
      tribe.attitudes.monolith = attitude;
      console.log(`Set tribe attitude to ${Attitudes.MonolithString(attitude)}`);
    }];
  }
}

class MigrationEvent {
  static triggers(tribe: Tribe, region: Region) {
    return tribe.migrate();
  }

  static isChoice() : boolean {
    return false;
  }

  static choices() : string[] {
    return [];
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [""];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) {
    return [function () {
      let otherRegions = region.nearby();

      let migrateRegion : Region = Random.choice(otherRegions);

      region.removeTribe(tribe);
      migrateRegion.addTribe(tribe);
    }];
  }
}

let TribeEvents : TribeEvent[] = [
  EncounterEvent,
  MigrationEvent,
]