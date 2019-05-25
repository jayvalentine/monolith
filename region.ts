/// <reference path="./random.ts">

// A region is a part of the world that can be inhabited by tribes.
//
// Regions have three statistics:
// food: level of food available in the region.
// water: level of water available in the region.
// resources: level of resources available in the region.
class Region {
  private _food: number;
  private _water: number;
  private _resources: number;

  private _type: Region.Type;

  constructor() {
    // Choose a random type for the region.
    let t = Random.interval(0, 6);
    switch(t) {
      case 0: this._type = Region.Type.Desert; break;
      case 1: this._type = Region.Type.Grassland; break;
      case 2: this._type = Region.Type.Hills; break;
      case 3: this._type = Region.Type.Mountains; break;
      case 4: this._type = Region.Type.Tundra; break;
      case 5: this._type = Region.Type.Valley; break;
      case 6: this._type = Region.Type.Rainforest; break;
    }

    // Determine food, water, resource levels.
    // We generate a number between 2 and 4, which is then augmented by the type.
    this._food = Random.interval(2, 4);
    this._water = Random.interval(2, 4);
    this._resources = Random.interval(2, 4);
  }

  // Returns the type of the region.
  type() : Region.Type {
    return this._type;
  }

  // Returns the string representation of the region's type.
  typeString() : string {
    return Region.Type[this._type];
  }

  // Returns the food level of the region, with the type modifier.
  food() : number {
    switch(this._type) {
      case Region.Type.Desert: return this._food - 1;
      case Region.Type.Grassland: return this._food + 1;
      case Region.Type.Hills: return this._food;
      case Region.Type.Mountains: return this._food - 2;
      case Region.Type.Tundra: return this._food - 1;
      case Region.Type.Valley: return this._food + 1;
      case Region.Type.Rainforest: return this._food + 2;
    }
  }

  // Returns the water level of the region, with the type modifier.
  water() : number {
    switch(this._type) {
      case Region.Type.Desert: return this._water - 2;
      case Region.Type.Grassland: return this._water;
      case Region.Type.Hills: return this._water + 1;
      case Region.Type.Mountains: return this._water - 1;
      case Region.Type.Tundra: return this._water - 1;
      case Region.Type.Valley: return this._water + 2;
      case Region.Type.Rainforest: return this._water;
    }
  }

  // Returns the resource level of the region, with the type modifier.
  resources() : number {
    switch(this._type) {
      case Region.Type.Desert: return this._resources + 1;
      case Region.Type.Grassland: return this._resources - 2;
      case Region.Type.Hills: return this._resources + 1;
      case Region.Type.Mountains: return this._resources + 2;
      case Region.Type.Tundra: return this._resources;
      case Region.Type.Valley: return this._resources - 1;
      case Region.Type.Rainforest: return this._resources;
    }
  }
}

namespace Region {
  export enum Type {
    Desert = "Desert",
    Grassland = "Grassland",
    Hills = "Hills",
    Mountains = "Mountains",
    Tundra = "Tundra",
    Valley = "Valley",
    Rainforest = "Rainforest",
  }
}
