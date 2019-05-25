/// <reference path="./tribe.ts">
/// <reference path="./random.ts">

interface TribeEvent {
  readonly id : string;

  triggers(tribe: Tribe, region: Region, progress: number) : boolean;
  progress(tribe: Tribe, region: Region) : number;

  isChoice() : boolean;
  choices() : string[];

  outcomeMessages(tribe: Tribe, region: Region) : string[];
  outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[];
}

class EncounterEvent {
  public static readonly id : string = "EncounterEvent";

  static newAttitude : Attitudes.Monolith;

  static triggers(tribe: Tribe, region: Region, progress: number) : boolean {
    if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered) return false;

    else if (region.hasMonolith) return true;
    return false;
  }

  static progress(tribe: Tribe, region: Region) : number {
    return 0;
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
  public static readonly id : string = "MigrationEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    return tribe.migrate();
  }

  static progress(tribe: Tribe, region: Region) : number {
    return 0;
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

class DiscoverFireEvent {
  public static readonly id : string = "DiscoverFireEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) : boolean {
    let c : number = 0.00001;
    if (tribe.attitudes.monolith = Attitudes.Monolith.Curious) c = 0.00002;

    return Random.progressiveChance(c, progress, 1000000);
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (region.type() == Region.Type.Desert) return 2;
    else return 1;
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "It is useful.",
      "It is dangerous."
    ];
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [
      `The tribe is curious about the possible uses of this phenomenon. Some begin using it to cook their food,
      while others use it to provide light at night.`,
      `The tribe is afraid of this phenomenon. They avoid it, not understanding the benefits it could bring.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {console.log("A tribe has discovered fire, and become curious.")},
      function () {console.log("A tribe has shunned fire, and become fearful.")}
    ];
  }
}

let TribeEvents : TribeEvent[] = [
  EncounterEvent,
  MigrationEvent,
  DiscoverFireEvent
]