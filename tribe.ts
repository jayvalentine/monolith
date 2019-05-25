/// <reference path="./random.ts">
/// <reference path="./tribe_events.ts">

// A tribe is a group of people with common traits.
class Tribe {
  private _population : number;

  private _migrationChance : number;

  private _eventProgress : Object;

  public attitudes: Attitudes;

  constructor(population: number) {
    this._population = population;
    this._migrationChance = 0.000001;
    this._eventProgress = {};

    this.attitudes = new Attitudes();

    this.attitudes.monolith = Attitudes.Monolith.Unencountered;
  }

  population() : number {
    return this._population;
  }

  migrate() : boolean {
    return Random.chance(this._migrationChance);
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
}

class Attitudes {
  public monolith: Attitudes.Monolith;

  static MonolithString(monolith: Attitudes.Monolith) : string {
    switch(monolith) {
      case Attitudes.Monolith.Unencountered: return "unencountered";
      case Attitudes.Monolith.Curious: return "curious";
      case Attitudes.Monolith.Superstitious: return "superstitious";
      case Attitudes.Monolith.Fearful: return "fearful";
    }
  }

  constructor() {

  }

  monolithString() : string {
    return Attitudes.MonolithString(this.monolith);
  }
}

namespace Attitudes {
  export enum Monolith {
    Unencountered = "unencountered",
    Curious = "curious",
    Superstitious = "superstitious",
    Fearful = "fearful",
  }
}