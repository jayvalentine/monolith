// A tribe is a group of people with common traits.
class Tribe {
  private _population : number;

  constructor(population: number) {
    this._population = population;
  }

  population() : number {
    return this._population;
  }
}