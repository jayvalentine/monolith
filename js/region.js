/// <reference path="./random.ts">
/// <reference path="./tribe.ts">
// A region is a part of the world that can be inhabited by tribes.
//
// Regions have three statistics:
// food: level of food available in the region.
// water: level of water available in the region.
// resources: level of resources available in the region.
var Region = /** @class */ (function () {
    function Region() {
        this._tribes = [];
        this._nearbyRegions = [];
        this._structures = [];
        // Choose a random type for the region.
        var t = Random.interval(0, 6);
        switch (t) {
            case 0:
                this._type = Region.Type.Desert;
                break;
            case 1:
                this._type = Region.Type.Grassland;
                break;
            case 2:
                this._type = Region.Type.Hills;
                break;
            case 3:
                this._type = Region.Type.Mountains;
                break;
            case 4:
                this._type = Region.Type.Tundra;
                break;
            case 5:
                this._type = Region.Type.Valley;
                break;
            case 6:
                this._type = Region.Type.Rainforest;
                break;
        }
        // Determine food, water, resource levels.
        // We generate a number between 2 and 4, which is then augmented by the type.
        this._food = Random.interval(2, 4);
        this._water = Random.interval(2, 4);
        this._resources = Random.interval(2, 4);
    }
    // Given a level number, returns a string description.
    Region.prototype.levelString = function (level) {
        switch (level) {
            case 0: return "no";
            case 1: return "scarce";
            case 2: return "barely adequate";
            case 3: return "adequate";
            case 4: return "sufficient";
            case 5: return "plentiful";
            case 6: return "abundant";
        }
    };
    // Returns the type of the region.
    Region.prototype.type = function () {
        return this._type;
    };
    Region.prototype.typeString = function () {
        return Region.Type[this._type];
    };
    Region.prototype.typeStringLowercase = function () {
        switch (this._type) {
            case Region.Type.Desert: return "desert";
            case Region.Type.Grassland: return "grassland";
            case Region.Type.Hills: return "hills";
            case Region.Type.Mountains: return "mountains";
            case Region.Type.Tundra: return "tundra";
            case Region.Type.Valley: return "valley";
            case Region.Type.Rainforest: return "rainforest";
        }
    };
    // Returns the string description of the region's type.
    Region.prototype.typeDescription = function () {
        switch (this._type) {
            case Region.Type.Desert: return "desert";
            case Region.Type.Grassland: return "grassland";
            case Region.Type.Hills: return "hilly";
            case Region.Type.Mountains: return "mountainous";
            case Region.Type.Tundra: return "tundra";
            case Region.Type.Valley: return "valley";
            case Region.Type.Rainforest: return "rainforest";
        }
    };
    // Returns the food level of the region, with the type modifier.
    Region.prototype.food = function () {
        switch (this._type) {
            case Region.Type.Desert: return this._food - 1;
            case Region.Type.Grassland: return this._food + 1;
            case Region.Type.Hills: return this._food;
            case Region.Type.Mountains: return this._food - 2;
            case Region.Type.Tundra: return this._food - 1;
            case Region.Type.Valley: return this._food + 1;
            case Region.Type.Rainforest: return this._food + 2;
        }
    };
    // Returns a string representation of the region's food level.
    Region.prototype.foodString = function () {
        return this.levelString(this.food());
    };
    // Returns the water level of the region, with the type modifier.
    Region.prototype.water = function () {
        switch (this._type) {
            case Region.Type.Desert: return this._water - 2;
            case Region.Type.Grassland: return this._water;
            case Region.Type.Hills: return this._water + 1;
            case Region.Type.Mountains: return this._water - 1;
            case Region.Type.Tundra: return this._water - 1;
            case Region.Type.Valley: return this._water + 2;
            case Region.Type.Rainforest: return this._water;
        }
    };
    // Returns a string representation of the region's water level.
    Region.prototype.waterString = function () {
        return this.levelString(this.water());
    };
    // Returns the resource level of the region, with the type modifier.
    Region.prototype.resources = function () {
        switch (this._type) {
            case Region.Type.Desert: return this._resources + 1;
            case Region.Type.Grassland: return this._resources - 2;
            case Region.Type.Hills: return this._resources + 1;
            case Region.Type.Mountains: return this._resources + 2;
            case Region.Type.Tundra: return this._resources;
            case Region.Type.Valley: return this._resources - 1;
            case Region.Type.Rainforest: return this._resources;
        }
    };
    // Returns a string representation of the region's resources level.
    Region.prototype.resourcesString = function () {
        return this.levelString(this.resources());
    };
    // Returns the number of tribes in this region.
    Region.prototype.tribesCount = function () {
        return this._tribes.length;
    };
    // Returns a list of tribes in this region.
    Region.prototype.tribes = function () {
        return this._tribes;
    };
    // Returns the population of this region.
    Region.prototype.population = function () {
        var sum = 0;
        for (var _i = 0, _a = this._tribes; _i < _a.length; _i++) {
            var t = _a[_i];
            sum += t.population();
        }
        return sum;
    };
    // Adds a tribe to this region.
    Region.prototype.addTribe = function (tribe) {
        this._tribes.push(tribe);
    };
    // Removes a tribe from this region.
    // Exits silently if the tribe isn't in the region.
    Region.prototype.removeTribe = function (tribe) {
        var index = this._tribes.indexOf(tribe);
        if (index >= 0) {
            this._tribes.splice(index, 1);
        }
    };
    Region.prototype.addNearbyRegion = function (region) {
        // Do nothing if we've already added this region.
        if (this._nearbyRegions.indexOf(region) > -1)
            return;
        // Add the other region.
        this._nearbyRegions.push(region);
        // Call addNearbyRegion for the other region, passing this.
        region.addNearbyRegion(this);
    };
    Region.prototype.nearby = function () {
        return this._nearbyRegions;
    };
    Region.prototype.addStructure = function (structure) {
        if (this._structures.indexOf(structure) > -1)
            return;
        else
            this._structures.push(structure);
    };
    Region.prototype.hasStructure = function (structure) {
        if (this._structures.indexOf(structure) > -1)
            return true;
        else
            return false;
    };
    return Region;
}());
(function (Region) {
    var Type;
    (function (Type) {
        Type["Desert"] = "Desert";
        Type["Grassland"] = "Grassland";
        Type["Hills"] = "Hills";
        Type["Mountains"] = "Mountains";
        Type["Tundra"] = "Tundra";
        Type["Valley"] = "Valley";
        Type["Rainforest"] = "Rainforest";
    })(Type = Region.Type || (Region.Type = {}));
})(Region || (Region = {}));
