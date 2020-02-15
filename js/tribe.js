/// <reference path="./random.ts">
/// <reference path="./tribe_events.ts">
/// <reference path="./language.ts">
/// <reference path="./idallocator.ts">
// A tribe is a group of people with common traits.
var Tribe = /** @class */ (function () {
    function Tribe(population) {
        this.id = IDAllocator.allocate("tribe");
        this._population = population;
        this._migrationChance = 0.000001;
        this._eventProgress = {};
        this._relations = {};
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
        ]);
        this.attitudes.self = Random.choice([
            Attitudes.Self.Hierarchical,
            Attitudes.Self.Egalitarian
        ]);
        this._language = new Language();
    }
    Tribe.prototype.population = function () {
        return this._population;
    };
    Tribe.prototype.decreasePopulation = function (value) {
        this._population -= value;
    };
    Tribe.prototype.increasePopulation = function (value) {
        this._population += value;
    };
    // Determines change in tribe's population.
    Tribe.prototype.grow = function () {
        var oldPopulation = this.population();
        var growthCount = 0;
        var deathCount = 0;
        var growthRate = this.growthRate();
        var deathRate = this.deathRate();
        for (var i = 0; i < 20; i++) {
            if (Random.chance(growthRate))
                growthCount += (Math.floor(this.population() * 0.05));
            if (Random.chance(deathRate))
                deathCount += (Math.floor(this.population() * 0.05));
        }
        // Increase population by growth count and decrease by death count.
        this.increasePopulation(growthCount);
        this.decreasePopulation(deathCount);
    };
    // Splits the tribe into multiple groups according to the proportions given.
    // Returns a list of the new tribes (excluding the original).
    Tribe.prototype.split = function (proportions) {
        var populations = [];
        var newTribes = [];
        for (var _i = 0, proportions_1 = proportions; _i < proportions_1.length; _i++) {
            var p = proportions_1[_i];
            populations.push(Math.floor(this._population * p));
        }
        for (var _a = 0, _b = populations.slice(1); _a < _b.length; _a++) {
            var p = _b[_a];
            var t = new Tribe(p);
            // Set attitudes of the new tribe to the same as this one.
            t.attitudes.monolith = this.attitudes.monolith;
            t.attitudes.others = this.attitudes.others;
            t.attitudes.world = this.attitudes.world;
            t.attitudes.self = this.attitudes.self;
            // Set technology and culture of new tribe.
            for (var _c = 0, _d = this._technology; _c < _d.length; _c++) {
                var tech = _d[_c];
                t.addTechnology(tech);
            }
            for (var _e = 0, _f = this._culture; _e < _f.length; _e++) {
                var cult = _f[_e];
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
    };
    Tribe.prototype.relationship = function (tribe) {
        if (!this._relations.hasOwnProperty(tribe.id)) {
            return 0;
        }
        return this._relations[tribe.id];
    };
    Tribe.prototype.changeRelationship = function (tribe, value) {
        if (!this._relations.hasOwnProperty(tribe.id)) {
            this._relations[tribe.id] = 0;
        }
        this._relations[tribe.id] += value;
        console.log("Set relationship of " + this.id + " for " + tribe.id + " to " + this._relations[tribe.id] + ".");
    };
    Tribe.prototype.attack = function () {
        var attack = 0;
        if (this.attitudes.others == Attitudes.Others.Aggressive)
            attack += 1;
        if (this.hasTechnology("tools"))
            attack += 1;
        return attack;
    };
    Tribe.prototype.defense = function () {
        var defense = 0;
        if (this.attitudes.others == Attitudes.Others.Defensive)
            defense += 1;
        if (this.hasTechnology("construction"))
            defense += 1;
        return defense;
    };
    Tribe.prototype.migrate = function () {
        return Random.chance(this._migrationChance);
    };
    Tribe.prototype.setMigrationChance = function (c) {
        this._migrationChance = c;
    };
    Tribe.prototype.progress = function (e) {
        return this._eventProgress[e.id];
    };
    Tribe.prototype.increaseProgress = function (e, progress) {
        // Default to starting from 0 if no progress is stored.
        var currentProgress = 0;
        // Get the progress from the map if it exists.
        if (this._eventProgress.hasOwnProperty(e.id))
            currentProgress = this._eventProgress[e.id];
        // Set the new progress.
        this._eventProgress[e.id] = currentProgress + progress;
    };
    Tribe.prototype.resetProgress = function (e) {
        this._eventProgress[e.id] = 0;
    };
    Tribe.prototype.addTechnology = function (technology) {
        if (this._technology.indexOf(technology) > -1)
            return;
        this._technology.push(technology);
    };
    Tribe.prototype.removeTechnology = function (technology) {
        // Return silently if tribe doesn't have technology.
        var i = this._technology.indexOf(technology);
        if (i == -1)
            return;
        this._technology.splice(i, 1);
    };
    Tribe.prototype.hasTechnology = function (technology) {
        if (this._technology.indexOf(technology) > -1)
            return true;
        else
            return false;
    };
    Tribe.prototype.addCulture = function (culture) {
        if (this._culture.indexOf(culture) > -1)
            return;
        this._culture.push(culture);
    };
    Tribe.prototype.removeCulture = function (culture) {
        // Return silently if tribe doesn't have culture.
        var i = this._culture.indexOf(culture);
        if (i == -1)
            return;
        this._culture.splice(i, 1);
    };
    Tribe.prototype.hasCulture = function (culture) {
        if (this._culture.indexOf(culture) > -1)
            return true;
        else
            return false;
    };
    Tribe.prototype.title = function () {
        if (this._name.length == 0)
            return "a tribe";
        else
            return "the " + Language.toTitle(this._language.translate(this._name));
    };
    Tribe.prototype.titleCapitalized = function () {
        if (this._name.length == 0)
            return "A tribe";
        else
            return "The " + Language.toTitle(this._language.translate(this._name));
    };
    Tribe.prototype.setName = function (name) {
        this._name = name;
    };
    Tribe.prototype.name = function () {
        return this._name;
    };
    Tribe.prototype.language = function () {
        return this._language;
    };
    Tribe.prototype.growthRate = function () {
        var g = 0.0001;
        if (this.hasTechnology("fire"))
            g = 4 * g;
        if (this.hasTechnology("agriculture"))
            g = 4 * g;
        return g;
    };
    Tribe.prototype.deathRate = function () {
        var d = 0.0001;
        return d;
    };
    return Tribe;
}());
var Attitudes = /** @class */ (function () {
    function Attitudes() {
    }
    Attitudes.MonolithString = function (monolith) {
        switch (monolith) {
            case Attitudes.Monolith.Unencountered: return "unencountered";
            case Attitudes.Monolith.Curious: return "curious";
            case Attitudes.Monolith.Superstitious: return "superstitious";
            case Attitudes.Monolith.Fearful: return "fearful";
        }
    };
    Attitudes.OthersString = function (others) {
        switch (others) {
            case Attitudes.Others.Aggressive: return "aggressive";
            case Attitudes.Others.Defensive: return "defensive";
            case Attitudes.Others.Diplomatic: return "diplomatic";
            case Attitudes.Others.Insular: return "insular";
        }
    };
    Attitudes.WorldString = function (world) {
        switch (world) {
            case Attitudes.World.Exploit: return "exploitative";
            case Attitudes.World.Explore: return "explorative";
            case Attitudes.World.Harmony: return "harmonious";
            case Attitudes.World.Survival: return "survivalists";
        }
    };
    Attitudes.SelfString = function (self) {
        switch (self) {
            case Attitudes.Self.Hierarchical: return "hierarchical";
            case Attitudes.Self.Egalitarian: return "egalitarian";
        }
    };
    Attitudes.prototype.monolithString = function () {
        return Attitudes.MonolithString(this.monolith);
    };
    Attitudes.prototype.othersString = function () {
        return Attitudes.OthersString(this.others);
    };
    Attitudes.prototype.worldString = function () {
        return Attitudes.WorldString(this.world);
    };
    Attitudes.prototype.selfString = function () {
        return Attitudes.SelfString(this.self);
    };
    return Attitudes;
}());
(function (Attitudes) {
    var Monolith;
    (function (Monolith) {
        Monolith["Unencountered"] = "unencountered";
        Monolith["Curious"] = "curious";
        Monolith["Superstitious"] = "superstitious";
        Monolith["Fearful"] = "fearful";
    })(Monolith = Attitudes.Monolith || (Attitudes.Monolith = {}));
    var Others;
    (function (Others) {
        Others["Aggressive"] = "aggressive";
        Others["Defensive"] = "defensive";
        Others["Diplomatic"] = "diplomatic";
        Others["Insular"] = "insular";
    })(Others = Attitudes.Others || (Attitudes.Others = {}));
    var World;
    (function (World) {
        World["Exploit"] = "exploit";
        World["Explore"] = "explore";
        World["Harmony"] = "harmony";
        World["Survival"] = "survival";
    })(World = Attitudes.World || (Attitudes.World = {}));
    var Self;
    (function (Self) {
        Self["Hierarchical"] = "hierarchical";
        Self["Egalitarian"] = "egalitarian";
    })(Self = Attitudes.Self || (Attitudes.Self = {}));
})(Attitudes || (Attitudes = {}));
