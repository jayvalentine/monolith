/// <reference path="./random.ts">
/// <reference path="./tribe_events.ts">

// A tribe is a group of people with common traits.
class Tribe {
  private _population : number;

  private _migrationChance : number;

  private _eventProgress : Object;

  private _technology : string[];
  private _culture : string[];

  public attitudes: Attitudes;

  constructor(population: number) {
    this._population = population;
    this._migrationChance = 0.000001;
    this._eventProgress = {};

    this._technology = [];
    this._culture = [];

    this.attitudes = new Attitudes();

    this.attitudes.monolith = Attitudes.Monolith.Unencountered;

    const othersRoll = Random.interval(0, 3);
    switch (othersRoll) {
      case 0: this.attitudes.others = Attitudes.Others.Aggressive; break;
      case 1: this.attitudes.others = Attitudes.Others.Defensive; break;
      case 2: this.attitudes.others = Attitudes.Others.Diplomatic; break;
      case 3: this.attitudes.others = Attitudes.Others.Insular; break;
    }
  }

  population() : number {
    return this._population;
  }

  reducePopulation(value: number) {
    this._population -= value;
  }

  attack() : number {
    let attack : number = 0;

    if (this.attitudes.others == Attitudes.Others.Aggressive) attack += 1;

    return attack;
  }

  defense() : number {
    let defense : number = 0;

    if (this.attitudes.others == Attitudes.Others.Defensive) defense += 1;

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
}

class Attitudes {
  public monolith: Attitudes.Monolith;
  public others: Attitudes.Others;

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

  constructor() {

  }

  monolithString() : string {
    return Attitudes.MonolithString(this.monolith);
  }

  othersString() : string {
    return Attitudes.OthersString(this.others);
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
}