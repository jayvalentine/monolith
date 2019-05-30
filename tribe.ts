/// <reference path="./random.ts">
/// <reference path="./tribe_events.ts">
/// <reference path="./language.ts">

// A tribe is a group of people with common traits.
class Tribe {
  private _population : number;

  private _migrationChance : number;

  private _eventProgress : Object;

  private _technology : string[];
  private _culture : string[];

  private _name : Noun[];
  private _language : Language;

  public attitudes: Attitudes;

  public dead : boolean;

  constructor(population: number) {
    this._population = population;
    this._migrationChance = 0.000001;
    this._eventProgress = {};

    this._technology = [];
    this._culture = [];

    this._name = [];

    this.attitudes = new Attitudes();

    this.attitudes.monolith = Attitudes.Monolith.Unencountered;

    this.dead = false;

    this.attitudes.others = Random.choice([
      Attitudes.Others.Aggressive,
      Attitudes.Others.Defensive,
      Attitudes.Others.Diplomatic,
      Attitudes.Others.Insular
    ]);

    this.attitudes.world = Random.choice([
      Attitudes.World.Exploit,
      Attitudes.World.Explore,
      Attitudes.World.Harmony,
      Attitudes.World.Survival
    ])

    this.attitudes.self = Random.choice([
      Attitudes.Self.Hierarchical,
      Attitudes.Self.Egalitarian
    ])
  }

  population() : number {
    return this._population;
  }

  decreasePopulation(value: number) {
    this._population -= value;
  }

  increasePopulation(value: number) {
    this._population += value;
  }

  // Determines change in tribe's population.
  grow() {
    const oldPopulation = this.population();

    let growthCount : number = 0;
    let deathCount : number = 0;

    const growthRate = this.growthRate();
    const deathRate = this.deathRate();

    for (let i = 0; i < 20; i++) {
      if (Random.chance(growthRate)) growthCount += (Math.floor(this.population()*0.05));
      if (Random.chance(deathRate)) deathCount += (Math.floor(this.population()*0.05));
    }

    // Increase population by growth count and decrease by death count.
    this.increasePopulation(growthCount);
    this.decreasePopulation(deathCount);
  }

  // Splits the tribe into multiple groups according to the proportions given.
  // Returns a list of the new tribes (excluding the original).
  split(proportions: number[]) : Tribe[] {
    let populations : number[] = [];
    let newTribes : Tribe[] = [];

    for (let p of proportions) {
      populations.push(Math.floor(this._population*p));
    }

    for (let p of populations.slice(1)) {
      let t : Tribe = new Tribe(p);

      // Set attitudes of the new tribe to the same as this one.
      t.attitudes.monolith = this.attitudes.monolith;
      t.attitudes.others = this.attitudes.others;
      t.attitudes.world = this.attitudes.world;
      t.attitudes.self = this.attitudes.self;

      // Set technology and culture of new tribe.
      for (let tech of this._technology) {
        t.addTechnology(tech);
      }

      for (let cult of this._culture) {
        t.addCulture(cult);
      }

      // Set migration chance of new tribe.
      t.setMigrationChance(this._migrationChance);

      newTribes.push(t);
    }

    // Reduce this tribe's population to the first proportion.
    this._population = Math.floor(proportions[0] * this._population);

    // Return the new tribes.
    return newTribes;
  }

  attack() : number {
    let attack : number = 0;

    if (this.attitudes.others == Attitudes.Others.Aggressive) attack += 1;
    if (this.hasTechnology("tools")) attack += 1;

    return attack;
  }

  defense() : number {
    let defense : number = 0;

    if (this.attitudes.others == Attitudes.Others.Defensive) defense += 1;
    if (this.hasTechnology("construction")) defense += 1;

    return defense;
  }

  migrate() : boolean {
    return Random.chance(this._migrationChance);
  }

  setMigrationChance(c: number) {
    this._migrationChance = c;
  }

  progress(e: TribeEvent) : number {
    return this._eventProgress[e.id];
  }

  increaseProgress(e: TribeEvent, progress: number) {
    // Default to starting from 0 if no progress is stored.
    let currentProgress : number = 0;

    // Get the progress from the map if it exists.
    if (this._eventProgress.hasOwnProperty(e.id)) currentProgress = this._eventProgress[e.id];

    // Set the new progress.
    this._eventProgress[e.id] = currentProgress+progress;
  }

  resetProgress(e: TribeEvent) {
    this._eventProgress[e.id] = 0;
  }

  addTechnology(technology: string) {
    if (this._technology.indexOf(technology) > -1) return;
    this._technology.push(technology);
  }

  removeTechnology(technology: string) {
    // Return silently if tribe doesn't have technology.
    const i = this._technology.indexOf(technology);
    if (i == -1) return;

    this._technology.splice(i, 1);
  }

  hasTechnology(technology: string) : boolean {
    if (this._technology.indexOf(technology) > -1) return true;
    else return false;
  }

  addCulture(culture: string) {
    if (this._culture.indexOf(culture) > -1) return;
    this._culture.push(culture);
  }

  hasCulture(culture: string) : boolean {
    if (this._culture.indexOf(culture) > -1) return true;
    else return false;
  }

  title() : string {
    if (this._name.length == 0) return "a tribe";
    else return "the " + Language.toTitle(this._language.translate(this._name));
  }

  titleCapitalized() : string {
    if (this._name.length == 0) return "A tribe";
    else return "The " + Language.toTitle(this._language.translate(this._name));
  }

  setName(name: Noun[]) {
    this._name = name;
  }

  name() : Noun[] {
    return this._name;
  }

  setLanguage(language: Language) {
    this._language = language;
  }

  language() : Language {
    return this._language;
  }

  private growthRate() : number {
    let g : number = 0.0001;

    if (this.hasTechnology("fire")) g = 4 * g;

    if (this.hasTechnology("agriculture")) g = 4 * g;

    return g;
  }

  private deathRate() : number {
    let d : number = 0.0001;

    return d;
  }
}

class Attitudes {
  public monolith: Attitudes.Monolith;
  public others: Attitudes.Others;
  public world: Attitudes.World;
  public self: Attitudes.Self;

  static MonolithString(monolith: Attitudes.Monolith) : string {
    switch(monolith) {
      case Attitudes.Monolith.Unencountered: return "unencountered";
      case Attitudes.Monolith.Curious: return "curious";
      case Attitudes.Monolith.Superstitious: return "superstitious";
      case Attitudes.Monolith.Fearful: return "fearful";
    }
  }

  static OthersString(others: Attitudes.Others) : string {
    switch(others) {
      case Attitudes.Others.Aggressive: return "aggressive";
      case Attitudes.Others.Defensive: return "defensive";
      case Attitudes.Others.Diplomatic: return "diplomatic";
      case Attitudes.Others.Insular: return "insular";
    }
  }

  static WorldString(world: Attitudes.World) : string {
    switch(world) {
      case Attitudes.World.Exploit: return "exploitative";
      case Attitudes.World.Explore: return "explorative";
      case Attitudes.World.Harmony: return "harmonious";
      case Attitudes.World.Survival: return "survivalists";
    }
  }

  static SelfString(self: Attitudes.Self) : string {
    switch(self) {
      case Attitudes.Self.Hierarchical: return "hierarchical";
      case Attitudes.Self.Egalitarian: return "egalitarian";
    }
  }

  constructor() {

  }

  monolithString() : string {
    return Attitudes.MonolithString(this.monolith);
  }

  othersString() : string {
    return Attitudes.OthersString(this.others);
  }

  worldString() : string {
    return Attitudes.WorldString(this.world);
  }

  selfString() : string {
    return Attitudes.SelfString(this.self);
  }
}

namespace Attitudes {
  export enum Monolith {
    Unencountered = "unencountered",
    Curious = "curious",
    Superstitious = "superstitious",
    Fearful = "fearful",
  }

  export enum Others {
    Aggressive = "aggressive",
    Defensive = "defensive",
    Diplomatic = "diplomatic",
    Insular = "insular",
  }

  export enum World {
    Exploit = "exploit",
    Explore = "explore",
    Harmony = "harmony",
    Survival = "survival",
  }

  export enum Self {
    Hierarchical = "hierarchical",
    Egalitarian = "egalitarian",
  }
}