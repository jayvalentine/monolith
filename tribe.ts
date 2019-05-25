// A tribe is a group of people with common traits.
class Tribe {
  private _population : number;

  public attitudes: Attitudes;

  constructor(population: number) {
    this._population = population;

    this.attitudes = new Attitudes();

    this.attitudes.monolith = Attitudes.Monolith.Untouched;
  }

  population() : number {
    return this._population;
  }
}

class Attitudes {
  public monolith: Attitudes.Monolith;

  static MonolithString(monolith: Attitudes.Monolith) : string {
    switch(monolith) {
      case Attitudes.Monolith.Untouched: return "untouched";
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
    Untouched = "untouched",
    Curious = "curious",
    Superstitious = "superstitious",
    Fearful = "fearful",
  }
}