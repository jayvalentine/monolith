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

  private static newAttitude : Attitudes.Monolith;

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

    return [`You encounter a tribe of ${tribe.population()} people.
    They are ${tribe.attitudes.othersString()}.
    They seem ${Attitudes.MonolithString(EncounterEvent.newAttitude)} towards you.`];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    const attitude : Attitudes.Monolith = EncounterEvent.newAttitude;

    return [function () {
      tribe.attitudes.monolith = attitude;
      console.log(`Direct encounter: set tribe attitude to ${Attitudes.MonolithString(attitude)}`);
    }];
  }
}

class IndirectEncounterEvent {
  public static readonly id : string = "IndirectEncounterEvent";

  private static otherTribe : Tribe;

  static triggers(tribe: Tribe, region: Region, progress: number) : boolean {
    if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered) return false;

    // Get any other encountered tribes in the region.
    let otherTribes : Tribe[] = region.tribes().filter(
      function (value, index, array) {
        return (value != tribe) && (value.attitudes.monolith != Attitudes.Monolith.Unencountered);
      });

    if (otherTribes.length > 0) return true;
    else return false;
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
    // Get any tribes in the region that have been encountered.
    let otherTribes : Tribe[] = region.tribes().filter(
      function (value, index, array) {
        return (value != tribe) && (value.attitudes.monolith != Attitudes.Monolith.Unencountered);
      }
    );

    // Choose one at random.
    IndirectEncounterEvent.otherTribe = Random.choice(otherTribes);

    let attitude : string = Attitudes.MonolithString(IndirectEncounterEvent.otherTribe.attitudes.monolith);

    return [`A tribe you are familiar with has encountered a new tribe of ${tribe.population()} people.
    After hearing of you, they seem ${attitude}.`];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    const attitude : Attitudes.Monolith = IndirectEncounterEvent.otherTribe.attitudes.monolith;

    return [function () {
      tribe.attitudes.monolith = attitude;
      console.log(`Indirect encounter: set tribe attitude to ${Attitudes.MonolithString(attitude)}`);
    }];
  }
}

class AttackEvent {
  public static readonly id : string = "AttackEvent";

  private static outcome : number;
  private static defender : Tribe;

  static triggers(tribe: Tribe, region: Region, progress: number) : boolean {
    if (tribe.attitudes.others != Attitudes.Others.Aggressive) return false;

    // Are there any other tribes in this region?
    let otherTribes : Tribe[] = region.tribes().filter(function (value, index, array) {return value != tribe});
    if (otherTribes.length == 0) return false;

    // Triggers with chance 0.0001.
    return Random.chance(0.0001);
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
    let attacker : Tribe = tribe;

    // Randomly select a defender.
    let otherTribes = region.tribes().filter(function (value, index, array) {return value != tribe});
    AttackEvent.defender = Random.choice(otherTribes);

    const attackerRoll : number = Random.interval(1, 10) + attacker.attack();
    const defenderRoll : number = Random.interval(1, 10) + AttackEvent.defender.defense();

    AttackEvent.outcome = ((attackerRoll - defenderRoll) * 10) + Random.interval(-5, 5);
  
    // Silent message if none of the tribes involved have been encountered.
    if ((attacker.attitudes.monolith != Attitudes.Monolith.Unencountered)
        && (AttackEvent.defender.attitudes.monolith != Attitudes.Monolith.Unencountered)) {
      return [""];
    }

    let outcomeMessage : string;
    let lossesMessage: string = "";

    if (AttackEvent.outcome > 0) {
      let defenderLosses = Math.min(AttackEvent.defender.population(), AttackEvent.outcome);

      outcomeMessage = `The attack was successful.`;

      if (defenderLosses == AttackEvent.defender.population()) {
        lossesMessage = `The defenders have been wiped out.`;
      }
      else {
        lossesMessage = `The defenders have lost ${defenderLosses} people in the attack.`;
      }
    }
    else if (AttackEvent.outcome < 0) {
      let attackerLosses = Math.min(attacker.population(), -AttackEvent.outcome);

      outcomeMessage = `The attack was repulsed.`;

      if (attackerLosses == attacker.population()) {
        lossesMessage = `The attackers have been wiped out.`;
      }
      else {
        lossesMessage = `The attackers have lost ${attackerLosses} people in the attack.`;
      }
    }
    else {
      outcomeMessage = `The attack ended in a stalemate.`
    }

    return [`A tribe has attacked a neighbouring tribe.
    ${outcomeMessage}
    ${lossesMessage}`];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) {
    const defender : Tribe = AttackEvent.defender;
    const outcome : number = AttackEvent.outcome;

    if (outcome > 0) {
      return [function () {
        console.log(`attack: success (${outcome})`);
        defender.reducePopulation(outcome)
      }];
    }
    else if (outcome < 0) {
      return [function () {
        console.log(`attack: failure (${outcome})`);
        tribe.reducePopulation(-outcome)
      }];
    }
    else {
      return [function () {
        console.log("attack: stalemate");
      }];
    }
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

      let attitude : string = Attitudes.MonolithString(tribe.attitudes.monolith);

      console.log(`A ${attitude} tribe has migrated from ${region.typeString()} to ${migrateRegion.typeString()}.`)
    }];
  }
}

class DiscoverFireEvent {
  public static readonly id : string = "DiscoverFireEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) : boolean {
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) return false;
    if (tribe.hasTechnology("fire")) return false;

    let c : number = 0.000001;
    if (tribe.attitudes.monolith == Attitudes.Monolith.Curious) c = 0.000002;

    return Random.progressiveChance(c, progress);
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (tribe.hasTechnology("fire")) return 0;
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) return 0;

    if (region.type() == Region.Type.Desert) return 2;
    else return 1;
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
        console.log(`A tribe has discovered fire.`);
      },
      function () {
        tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
        console.log(`A tribe has shunned fire.`);
      }
    ];
  }
}

class TribeWorshipsMonolithEvent {
  public static id : string = "TribeWorshipsMonolithEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious) return false;
    if (!region.hasMonolith) return false;

    // This event does not trigger if the tribe already worships the monolith.
    if (tribe.hasCulture("worshipsMonolith")) {
      console.log("Not triggered because tribe already worships monolith.");
      return false;
    }

    return Random.progressiveChance(0.00001, progress);
  }

  static progress(tribe: Tribe, region: Region) : number {
    return 1;
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
        tribe.addCulture("worshipsMonolith");
        tribe.setMigrationChance(0);
      },
      function () {
        // Tribe becomes fearful.
        tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
        tribe.addCulture("worshipsMonolith");
        tribe.addCulture("fearsMonolith");
      }
    ];
  }
}

let TribeEvents : TribeEvent[] = [
  EncounterEvent,
  IndirectEncounterEvent,
  TribeWorshipsMonolithEvent,
  AttackEvent,
  MigrationEvent,
  DiscoverFireEvent,
]