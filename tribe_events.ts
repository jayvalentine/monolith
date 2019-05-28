/// <reference path="./tribe.ts">
/// <reference path="./random.ts">
/// <reference path="./tribe_events_discovery.ts">

interface TribeEvent {
  readonly id : string;

  triggers(tribe: Tribe, region: Region, progress: number) : boolean;
  progress(tribe: Tribe, region: Region) : number;

  isChoice() : boolean;
  choicePrompt(tribe: Tribe) : string;
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

  static choicePrompt(tribe: Tribe) : string {
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
    They are ${tribe.attitudes.othersString()}, ${tribe.attitudes.worldString()},
    and ${tribe.attitudes.selfString()}.
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

  static choicePrompt(tribe: Tribe) : string {
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

    return [`${tribe.titleCapitalized()} has encountered a new tribe of ${tribe.population()} people.
    After hearing of you, they seem ${attitude}.`];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    const attitude : Attitudes.Monolith = IndirectEncounterEvent.otherTribe.attitudes.monolith;

    return [function () {
      tribe.attitudes.monolith = attitude;
      console.log(`Indirect encounter: set ${tribe.title()} attitude to ${Attitudes.MonolithString(attitude)}`);
    }];
  }
}

class TribeDestroyedEvent {
  public static readonly id : string = "TribeDestroyedEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) : boolean {
    if (tribe.population() <= 0) return true;
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

  static choicePrompt(tribe: Tribe) : string {
    return "";
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) {
      return [""];
    }
    else {
      return [`You sense a great loss. ${tribe.titleCapitalized()} is no more.`];
    }
  }

  static outcomeFunctions(tribe: Tribe, region: Region) {
    return [function () {tribe.dead = true; console.log(`${tribe.title()} has died.`);}];
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

  static choicePrompt(tribe: Tribe) : string {
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
    if ((attacker.attitudes.monolith == Attitudes.Monolith.Unencountered)
        && (AttackEvent.defender.attitudes.monolith == Attitudes.Monolith.Unencountered)) {
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

    return [`${tribe.titleCapitalized()} has attacked ${tribe.title()}.
    ${outcomeMessage}
    ${lossesMessage}`];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) {
    const defender : Tribe = AttackEvent.defender;
    const outcome : number = AttackEvent.outcome;

    if (outcome > 0) {
      return [function () {
        console.log(`attack: success (${outcome})`);
        defender.decreasePopulation(outcome)
        tribe.increasePopulation(Math.floor(outcome/2));
      }];
    }
    else if (outcome < 0) {
      return [function () {
        console.log(`attack: failure (${outcome})`);
        tribe.decreasePopulation(-outcome)
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

  static choicePrompt(tribe: Tribe) : string {
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

      console.log(`${tribe.title()} has migrated from ${region.typeString()} to ${migrateRegion.typeString()}.`)
    }];
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

    return Random.progressiveChance(0.0001, progress, 0.1);
  }

  static progress(tribe: Tribe, region: Region) : number {
    return Random.interval(0, 2);
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

  static choicePrompt(tribe: Tribe) : string {
    return `${tribe.titleCapitalized()} has taken a great interest in you. Tribe members regularly visit you, bringing
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

class TribeBuildsTempleEvent {
  public static id : string = "TribeBuildsTempleEvent";

  private static triggered : boolean = false;

  static triggers(tribe: Tribe, region: Region, progress: number) {
    // Does not trigger if:
    // Tribe is not in same region as the monolith
    // Tribe does not have the 'worships monolith' culture
    // Tribe does not have construction
    if (!region.hasMonolith) return false;
    if (!tribe.hasCulture("worshipsMonolith")) return false;
    if (!tribe.hasTechnology("construction")) return false;

    // Only triggers once per game.
    if (TribeBuildsTempleEvent.triggered) return false;

    if (Random.progressiveChance(0.00001, progress, 0.05)) {
      TribeBuildsTempleEvent.triggered = true;
      return true;
    }
    else {
      return false;
    }
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (!region.hasMonolith) return 0;
    if (!tribe.hasCulture("worshipsMonolith")) return 0;
    if (!tribe.hasTechnology("construction")) return 0;

    if (TribeBuildsTempleEvent.triggered) return 0;

    return 1;
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "I am not worthy of their worship.",
      "They are right to revere me."
    ];
  }

  static choicePrompt(tribe: Tribe) : string {
    return `You notice that members of ${tribe.title()} have begun bringing construction equipment and materials to you.
    Before long a handful of standing stones, obviously fashioned in your image, surrounds the rim of the crater where you
    have landed.`;
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [
      `The tribe is confused, as you had told them you were their god.
      They are worried that building the temple has disturbed you,
      and leave your landing site in peace, with the temple only half-finished.`,
      `The tribe continues constructing the temple, celebrating once it is finished.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        region.addStructure("partialMonolithTemple");
        let otherRegions = region.nearby();

        let migrateRegion : Region = Random.choice(otherRegions);

        region.removeTribe(tribe);
        migrateRegion.addTribe(tribe);
      },
      function () {
        tribe.addCulture("celebratesMonolith");
        region.addStructure("monolithTemple");
      }
    ];
  }
}

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

class FirstStoriesEvent {
  public static id : string = "FirstStoriesEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    // Does not trigger if:
    // Tribe is unencountered.
    // Tribe does not have language.
    // Tribe does not have agriculture.
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) return false;
    if (!tribe.hasTechnology("language")) return false;
    if (!tribe.hasTechnology("agriculture")) return false;

    if (tribe.hasCulture("stories")) return false;

    return Random.progressiveChance(0.00001, progress, 0.005);
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) return 0;
    if (!tribe.hasTechnology("language")) return 0;
    if (!tribe.hasTechnology("agriculture")) return 0;

    if (tribe.hasCulture("stories")) return 0;

    return Random.interval(0, 3);
  }

  static isChoice() : boolean {
    return false;
  }

  static choices() : string[] {
    return [];
  }

  static choicePrompt(tribe: Tribe) : string {
    return "";
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    let othersTheme : string = "";
    switch (tribe.attitudes.others) {
      case Attitudes.Others.Aggressive: othersTheme = "heroes of war"; break;
      case Attitudes.Others.Defensive: othersTheme = "defenders of their people"; break;
      case Attitudes.Others.Diplomatic: othersTheme = "friendship with other tribes"; break;
      case Attitudes.Others.Insular: othersTheme = "fear of other tribes"; break;
    }

    let worldTheme : string = "";
    switch (tribe.attitudes.world) {
      case Attitudes.World.Exploit: worldTheme = "exploitation of their environment"; break;
      case Attitudes.World.Explore: worldTheme = "exploration of the unknown"; break;
      case Attitudes.World.Harmony: worldTheme = "living in harmony with nature"; break;
      case Attitudes.World.Survival: worldTheme = "surviving in their dangerous environment"; break;
    }

    let selfTheme : string = "";
    switch (tribe.attitudes.self) {
      case Attitudes.Self.Hierarchical: selfTheme = "their rightful rulers"; break;
      case Attitudes.Self.Egalitarian: selfTheme = "their egalitarian society"; break;
    }

    // We don't have to handle the unencountered attitude as we guard against that when
    // deciding if the event triggers.
    let monolithTheme : string = "";
    switch (tribe.attitudes.monolith) {
      case Attitudes.Monolith.Curious: monolithTheme = "their curiosity about the Great Stone"; break;
      case Attitudes.Monolith.Superstitious: monolithTheme = "their reverance of the Great Stone"; break;
      case Attitudes.Monolith.Fearful: monolithTheme = "their fear of the Great Stone"; break;
    }

    return [
      `${tribe.titleCapitalized()} has begun telling stories in the evenings once all their
      work for the day is done. The major themes of their stories are ${othersTheme}, ${worldTheme},
      ${selfTheme}, and ${monolithTheme}.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        tribe.addCulture("stories");
        console.log(`${tribe.title()} has begun writing stories.`);
      }
    ];
  }
}

class OralHistoryEvent {
  public static id : string = "OralHistoryEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    // Does not trigger if:
    // Tribe is unencountered.
    // Tribe does not have stories.
    // Tribe does not have > 400 population.
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) return false;
    if (!tribe.hasCulture("stories")) return false;
    if (tribe.population() < 400) return false;

    if (tribe.hasCulture("oralHistory")) return false;
    if (tribe.hasCulture("noHistory")) return false;

    return Random.progressiveChance(0.00001, progress, 0.005);
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) return 0;
    if (!tribe.hasCulture("stories")) return 0;
    if (tribe.population() < 400) return 0;

    if (tribe.hasCulture("oralHistory")) return 0;
    if (tribe.hasCulture("noHistory")) return 0;

    return Random.interval(0, 3);
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "The past is not important.",
      "The past should be remembered."
    ];
  }

  static choicePrompt(tribe: Tribe) : string {
    return `The simple stories of ${tribe.title()} have evolved into more complex tales,
    often depicting events that occurred in the tribe's past. These tales
    form an oral history through which the tribe remembers its origins.`;
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [
      `The tribe is not interested in the past, and the tales reflect this, no longer emphasising the
      tribe's history.`,
      `The tales become a central part of the tribe's culture, with all members gathering regularly
      to hear about the events of the past.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        tribe.addCulture("noHistory");
        console.log(`${tribe.title()} rejects oral history.`)
      },
      function () {
        tribe.addCulture("oralHistory");
        console.log(`${tribe.title()} has begun oral history.`);
      }
    ];
  }
}

class PriestClassEvent {
  public static id : string = "PriestClassEvent";

  static triggers(tribe: Tribe, region: Region, progress: number) {
    // Does not trigger if:
    // Tribe is unencountered.
    // Tribe has oral history (i.e. doesn't have the no-history culture).
    // Tribe is not supersitious or hierarchical.
    if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious) return false;
    if (!tribe.hasCulture("noHistory")) return false;
    if (!tribe.hasCulture("worshipsMonolith")) return false;

    if (tribe.hasCulture("priestsRule")) return false;

    return Random.progressiveChance(0.00001, progress, 0.005);
  }

  static progress(tribe: Tribe, region: Region) : number {
    if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious) return 0;
    if (!tribe.hasCulture("noHistory")) return 0;
    if (!tribe.hasCulture("worshipsMonolith")) return 0;

    if (tribe.hasCulture("priestsRule")) return 0;

    return Random.interval(0, 3);
  }

  static isChoice() : boolean {
    return true;
  }

  static choices() : string[] {
    return [
      "The priests do not speak for me.",
      "The priests are my messengers."
    ];
  }

  static choicePrompt(tribe: Tribe) : string {
    return `A priestly class has developed in ${tribe.title()}, with a select group of priests
    claiming to be your messengers and acting in accordance with your will. The priests use stories
    and myths to influence the other tribespeople, who, without any understanding of their history,
    have no reason not to believe them.`;
  }

  static outcomeMessages(tribe: Tribe, region: Region) : string[] {
    return [
      `The priests convince the rest of the tribe that your displeasure is the result of some
      wrongdoing on their part. Before long, the tribespeople are desperate for the guidance of their
      religious leaders, who are all too happy to oblige.`,
      `With your blessing, the priests continue their rule over the other tribespeople.`
    ];
  }

  static outcomeFunctions(tribe: Tribe, region: Region) : (() => void)[] {
    return [
      function () {
        tribe.addCulture("priestsRule");
        tribe.attitudes.self = Attitudes.Self.Hierarchical;
      },
      function () {
        tribe.addCulture("priestsRule");
        tribe.attitudes.self = Attitudes.Self.Hierarchical;
      }
    ];
  }
}

let TribeEvents : TribeEvent[] = [
  TribeDestroyedEvent,
  EncounterEvent,
  IndirectEncounterEvent,
  TribeWorshipsMonolithEvent,
  TribeBuildsTempleEvent,
  FireSpreadsEvent,
  FirstStoriesEvent,
  OralHistoryEvent,
  PriestClassEvent,
  AttackEvent,
  MigrationEvent,
  DiscoverFireEvent,
  DiscoverToolsEvent,
  DiscoverConstructionEvent,
  DiscoverLanguageEvent,
  DiscoverAgricultureEvent,
]