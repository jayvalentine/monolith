import { Random } from "./random";
import { Tribe } from "./tribe";

// A region is a part of the world that can be inhabited by tribes.
//
// Regions have three statistics:
// food: level of food available in the region.
// water: level of water available in the region.
// resources: level of resources available in the region.
export class Region {
  private _food: number;
  private _water: number;
  private _resources: number;

  private _type: Region.Type;

  private _tribes: Tribe[];

  private _nearbyRegions: Region[];

  private _structures: string[];

  public hasMonolith: boolean;

  // Given a level number, returns a string description.
  private levelString(level : number) : string {
    switch(level)
    {
      case 0: return "no";
      case 1: return "scarce";
      case 2: return "barely adequate";
      case 3: return "adequate";
      case 4: return "sufficient";
      case 5: return "plentiful";
      case 6: return "abundant";
    }

    return "INVALID";
  }

  constructor() {
    this.hasMonolith = false;
    this._tribes = [];
    this._nearbyRegions = [];
    this._structures = [];

    // Choose a random type for the region.
    let t = Random.interval(0, 6);
    this._type = Region.Type.Undefined;

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

  typeString() : string {
    return Region.Type[this._type];
  }

  typeStringLowercase() : string {
    switch(this._type) {
      case Region.Type.Desert: return "desert";
      case Region.Type.Grassland: return "grassland";
      case Region.Type.Hills: return "hills";
      case Region.Type.Mountains: return "mountains";
      case Region.Type.Tundra: return "tundra";
      case Region.Type.Valley: return "valley";
      case Region.Type.Rainforest: return "rainforest";
      case Region.Type.Undefined: return "UNDEFINED";
    }
  }

  // Returns the string description of the region's type.
  typeDescription() : string {
    switch(this._type) {
      case Region.Type.Desert: return "desert";
      case Region.Type.Grassland: return "grassland";
      case Region.Type.Hills: return "hilly";
      case Region.Type.Mountains: return "mountainous";
      case Region.Type.Tundra: return "tundra";
      case Region.Type.Valley: return "valley";
      case Region.Type.Rainforest: return "rainforest";
      case Region.Type.Undefined: return "UNDEFINED";
    }
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
      case Region.Type.Undefined: return 0;
    }
  }

  // Returns a string representation of the region's food level.
  foodString() : string {
    return this.levelString(this.food());
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
      case Region.Type.Undefined: return 0;
    }
  }

  // Returns a string representation of the region's water level.
  waterString() : string {
    return this.levelString(this.water());
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
      case Region.Type.Undefined: return 0;
    }
  }

  // Returns a string representation of the region's resources level.
  resourcesString() : string {
    return this.levelString(this.resources());
  }

  // Returns the number of tribes in this region.
  tribesCount() : number {
    return this._tribes.length;
  }

  // Returns a list of tribes in this region.
  tribes() : Tribe[] {
    return this._tribes;
  }

  // Returns the population of this region.
  population() : number {
    let sum : number = 0;

    for (let t of this._tribes) {
      sum += t.population();
    }

    return sum;
  }

  // Adds a tribe to this region.
  addTribe(tribe: Tribe) {
    this._tribes.push(tribe);
  }

  // Removes a tribe from this region.
  // Exits silently if the tribe isn't in the region.
  removeTribe(tribe: Tribe) {
    const index = this._tribes.indexOf(tribe);

    if (index >= 0) {
      this._tribes.splice(index, 1);
    }
  }

  addNearbyRegion(region: Region) {
    // Do nothing if we've already added this region.
    if (this._nearbyRegions.indexOf(region) > -1) return;

    // Add the other region.
    this._nearbyRegions.push(region);

    // Call addNearbyRegion for the other region, passing this.
    region.addNearbyRegion(this);
  }

  nearby() : Region[] {
    return this._nearbyRegions;
  }

  addStructure(structure: string) {
    if (this._structures.indexOf(structure) > -1) return;
    else this._structures.push(structure);
  }

  hasStructure(structure: string) : boolean {
    if (this._structures.indexOf(structure) > -1) return true;
    else return false;
  }
}

export namespace Region {
  export enum Type {
    Desert = "Desert",
    Grassland = "Grassland",
    Hills = "Hills",
    Mountains = "Mountains",
    Tundra = "Tundra",
    Valley = "Valley",
    Rainforest = "Rainforest",
    Undefined = "Undefined"
  }
}
