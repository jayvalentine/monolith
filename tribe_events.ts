/// <reference path="./tribe.ts">
/// <reference path="./random.ts">

interface TribeEvent {
  readonly id : string;

  triggers(tribe: Tribe, region: Region, progress: number) : boolean;
  progress(tribe: Tribe, region: Region) : number;

  isChoice() : boolean;
  choicePrompt() : string;
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

  static choicePrompt() : string {
    return "";
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

  static choicePrompt() : string {
    return "";
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
    if (tribe.hasTechnology("fire")) return false;

    let c : number = 0.00001;
    if (tribe.attitudes.monolith = Attitudes.Monolith.Curious) c = 0.00002;

    return Random.progressiveChance(c, progress, 1000000);
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (tribe.hasTechnology("fire")) return 0;

    if (region.type() == Region.Type.Desert) return 0.002;
    else return 0.001;
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "Fire is useful.",
      "Fire is dangerous."
    ];
  }

  static choicePrompt() : string {
    return `While wandering on a hot, dry day, a tribe member notices food left in the wake of a wildfire.
    Noticing that the food seems firmer and smells different, the tribesperson brings it back to show the others.`;
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
      function () {
        tribe.addTechnology("fire");
        tribe.attitudes.monolith = Attitudes.Monolith.Curious;
      },
      function () {
        tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
      }
    ];
  }
}

class TribeWorshipsMonolithEvent {
  public static id : string = "TribeWorshipsMonolithEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious) return false;
    if (!region.hasMonolith) return false;

    return Random.progressiveChance(0.001, progress, 1000);
  }

  static progress(tribe: Tribe, region: Region) : number {
    return 0.1;
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "I am not their god.",
      "I am their god, and I am good.",
      "I am their god, and they should fear me."
    ];
  }

  static choicePrompt() : string {
    return `One of the nearby tribes has taken a great interest in you. Tribe members regularly visit you, bringing
    small offerings and prostrating themselves at your base. It becomes obvious that this is a form of primitive worship.`;
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [
      `The tribe is confused, but seems to accept the fact that you are not a supernatural being.`,
      `The tribe rejoices, pleased to have your approval. The visits become more frequent.`,
      `The tribe is terrified of you, and while they begin bringing larger offerings, it is clear that the reasons
      for their reverance have changed.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        // 50% chance for tribe to become curious.
        // 50% chance for tribe to migrate.
        if (Random.chance(0.5)) {
          tribe.attitudes.monolith = Attitudes.Monolith.Curious;
        }
        else {
          let otherRegions = region.nearby();

          let migrateRegion : Region = Random.choice(otherRegions);

          region.removeTribe(tribe);
          migrateRegion.addTribe(tribe);
        }
      },
      function () {
        // Tribe stays superstitious and migration chance reduces to 0.
        tribe.attitudes.monolith = Attitudes.Monolith.Superstitious;
        tribe.setMigrationChance(0);
      },
      function () {
        // Tribe becomes fearful and migrates.
        tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
        let otherRegions = region.nearby();

        let migrateRegion : Region = Random.choice(otherRegions);

        region.removeTribe(tribe);
        migrateRegion.addTribe(tribe);
      }
    ];
  }
}

let TribeEvents : TribeEvent[] = [
  EncounterEvent,
  MigrationEvent,
  DiscoverFireEvent,
  TribeWorshipsMonolithEvent
]