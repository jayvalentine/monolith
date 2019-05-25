/// <reference path="./random.ts">

// A tribe is a group of people with common traits.
class Tribe {
  private _population : number;

  private _migrationChance : number;

  public attitudes: Attitudes;

  constructor(population: number) {
    this._population = population;
    this._migrationChance = 0.000001;

    this.attitudes = new Attitudes();

    this.attitudes.monolith = Attitudes.Monolith.Unencountered;
  }

  population() : number {
    return this._population;
  }

  migrate() : boolean {
    return Random.chance(this._migrationChance);
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