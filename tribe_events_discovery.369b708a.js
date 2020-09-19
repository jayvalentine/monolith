// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"random.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Random =
/** @class */
function () {
  function Random() {}

  Random.interval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Random.choice = function (array) {
    var index = Random.interval(0, array.length - 1);
    return array[index];
  };

  Random.chance = function (c) {
    if (Math.random() < c) return true;else return false;
  };

  Random.progressiveChance = function (c, progress, upperBound) {
    var limit = Math.min(progress * c, upperBound);
    if (Math.random() < limit) return true;else return false;
  };

  return Random;
}();

exports.Random = Random;
},{}],"idallocator.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IDAllocator =
/** @class */
function () {
  function IDAllocator() {}

  IDAllocator.allocate = function (base) {
    if (!IDAllocator.ids.hasOwnProperty(base)) {
      IDAllocator.ids[base] = 0;
    }

    var id = base + "-" + IDAllocator.ids[base];
    IDAllocator.ids[base]++;
    return id;
  };

  IDAllocator.ids = {};
  return IDAllocator;
}();

exports.IDAllocator = IDAllocator;
},{}],"language.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var random_1 = require("./random");

var Alphabet = [];

for (var i = 0; i < 26; i++) {
  Alphabet[i] = String.fromCharCode(97 + i);
}

var Vowel = ["a", "e", "i", "o", "u"];
var Consonant = Alphabet.filter(function (v, i, a) {
  return Vowel.indexOf(v) == -1;
});

var Suffix =
/** @class */
function () {
  function Suffix(suffix, optional) {
    this.suffix = suffix;
    this.optional = optional;
  }

  return Suffix;
}();

var Noun =
/** @class */
function () {
  function Noun(base, plural, genitive, adjectives) {
    this.base = base;
    this.plural = plural;
    this.genitive = genitive;
    this.adjectives = adjectives;
  }

  return Noun;
}();

exports.Noun = Noun;

var Language =
/** @class */
function () {
  function Language() {
    this.plural = Language.getSuffix();
    this.genitive = Language.getSuffix();
    this.adjective = Language.getSuffix();

    if (random_1.Random.chance(0.5)) {
      this.adjectivePolicy = Language.Position.Before;
    } else {
      this.adjectivePolicy = Language.Position.After;
    }

    this.translations = {};
  }

  Language.capitalize = function (word) {
    var restOfWord = word.slice(1);
    return word.charAt(0).toUpperCase() + restOfWord;
  };

  Language.toTitle = function (sentence) {
    return sentence.split(' ').map(Language.capitalize).join(' ');
  };

  Language.getSuffix = function () {
    var optional = random_1.Random.choice(Vowel);
    var suffix = random_1.Random.choice(Consonant) + random_1.Random.choice(Vowel);
    return new Suffix(suffix, optional);
  };

  Language.addSuffix = function (word, suffix) {
    if (Consonant.indexOf(word[word.length - 1]) > -1) {
      word += suffix.optional;
    }

    word += suffix.suffix;
    return word;
  };

  Language.prototype.translate = function (sentence) {
    var sentenceTranslated = [];

    for (var _i = 0, sentence_1 = sentence; _i < sentence_1.length; _i++) {
      var word = sentence_1[_i];
      var wordTranslated = this.translateWord(word.base);
      if (word.plural) wordTranslated = Language.addSuffix(wordTranslated, this.plural);
      if (word.genitive) wordTranslated = Language.addSuffix(wordTranslated, this.genitive);
      var adjectives = [];

      for (var _a = 0, _b = word.adjectives; _a < _b.length; _a++) {
        var adj = _b[_a];
        var adjTranslated = this.translateWord(adj);
        adjTranslated = Language.addSuffix(adjTranslated, this.adjective);
        adjectives.push(adjTranslated);
      }

      if (this.adjectivePolicy == Language.Position.Before) {
        sentenceTranslated = sentenceTranslated.concat(adjectives);
      }

      sentenceTranslated.push(wordTranslated);

      if (this.adjectivePolicy == Language.Position.After) {
        sentenceTranslated = sentenceTranslated.concat(adjectives);
      }
    }

    return sentenceTranslated.join(" ");
  };

  Language.prototype.translateWord = function (word) {
    // First split word into phonemes.
    var phonemes = [];
    var currentPhoneme = "";

    for (var _i = 0, _a = word.split(''); _i < _a.length; _i++) {
      var letter = _a[_i];

      if (currentPhoneme.length > 0) {
        var lastLetter = currentPhoneme[currentPhoneme.length - 1];

        if (Vowel.indexOf(lastLetter) > -1) {
          phonemes.push(currentPhoneme);
          currentPhoneme = "";
        } else if (Consonant.indexOf(lastLetter) > -1 && Consonant.indexOf(letter) > -1) {
          if (lastLetter != letter) {
            phonemes.push(currentPhoneme);
            currentPhoneme = "";
          }
        }
      }

      currentPhoneme += letter;
    }

    if (currentPhoneme.length > 0) phonemes.push(currentPhoneme); // Translate each phoneme.

    var wordTranslated = "";

    for (var _b = 0, phonemes_1 = phonemes; _b < phonemes_1.length; _b++) {
      var p = phonemes_1[_b];
      wordTranslated += this.translatePhoneme(p);
    }

    return wordTranslated;
  };

  Language.prototype.translatePhoneme = function (phoneme) {
    if (!this.translations.hasOwnProperty(phoneme)) {
      var t = "";

      for (var _i = 0, _a = phoneme.split(''); _i < _a.length; _i++) {
        var letter = _a[_i];
        if (Consonant.indexOf(letter) > -1) t += random_1.Random.choice(Consonant);else t += random_1.Random.choice(Vowel);
      }

      this.translations[phoneme] = t;
    }

    return this.translations[phoneme];
  };

  return Language;
}();

exports.Language = Language;

(function (Language) {
  var Position;

  (function (Position) {
    Position["Before"] = "Before";
    Position["After"] = "After";
  })(Position = Language.Position || (Language.Position = {}));
})(Language = exports.Language || (exports.Language = {}));

exports.Language = Language;
},{"./random":"random.ts"}],"tribe.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var random_1 = require("./random");

var idallocator_1 = require("./idallocator");

var language_1 = require("./language"); // A tribe is a group of people with common traits.


var Tribe =
/** @class */
function () {
  function Tribe(population) {
    this.id = idallocator_1.IDAllocator.allocate("tribe");
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
    this.attitudes.others = random_1.Random.choice([Attitudes.Others.Aggressive, Attitudes.Others.Defensive, Attitudes.Others.Diplomatic, Attitudes.Others.Insular]);
    this.attitudes.world = random_1.Random.choice([Attitudes.World.Exploit, Attitudes.World.Explore, Attitudes.World.Harmony, Attitudes.World.Survival]);
    this.attitudes.self = random_1.Random.choice([Attitudes.Self.Hierarchical, Attitudes.Self.Egalitarian]);
    this._language = new language_1.Language();
  }

  Tribe.prototype.population = function () {
    return this._population;
  };

  Tribe.prototype.decreasePopulation = function (value) {
    this._population -= value;
  };

  Tribe.prototype.increasePopulation = function (value) {
    this._population += value;
  }; // Determines change in tribe's population.


  Tribe.prototype.grow = function () {
    var oldPopulation = this.population();
    var growthCount = 0;
    var deathCount = 0;
    var growthRate = this.growthRate();
    var deathRate = this.deathRate();

    for (var i = 0; i < 20; i++) {
      if (random_1.Random.chance(growthRate)) growthCount += Math.floor(this.population() * 0.05);
      if (random_1.Random.chance(deathRate)) deathCount += Math.floor(this.population() * 0.05);
    } // Increase population by growth count and decrease by death count.


    this.increasePopulation(growthCount);
    this.decreasePopulation(deathCount);
  }; // Splits the tribe into multiple groups according to the proportions given.
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
      var t = new Tribe(p); // Set attitudes of the new tribe to the same as this one.

      t.attitudes.monolith = this.attitudes.monolith;
      t.attitudes.others = this.attitudes.others;
      t.attitudes.world = this.attitudes.world;
      t.attitudes.self = this.attitudes.self; // Set technology and culture of new tribe.

      for (var _c = 0, _d = this._technology; _c < _d.length; _c++) {
        var tech = _d[_c];
        t.addTechnology(tech);
      }

      for (var _e = 0, _f = this._culture; _e < _f.length; _e++) {
        var cult = _f[_e];
        t.addCulture(cult);
      } // Set migration chance of new tribe.


      t.setMigrationChance(this._migrationChance);
      newTribes.push(t);
    } // Reduce this tribe's population to the first proportion.


    this._population = Math.floor(proportions[0] * this._population); // Return the new tribes.

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
    if (this.attitudes.others == Attitudes.Others.Aggressive) attack += 1;
    if (this.hasTechnology("tools")) attack += 1;
    return attack;
  };

  Tribe.prototype.defense = function () {
    var defense = 0;
    if (this.attitudes.others == Attitudes.Others.Defensive) defense += 1;
    if (this.hasTechnology("construction")) defense += 1;
    return defense;
  };

  Tribe.prototype.migrate = function () {
    return random_1.Random.chance(this._migrationChance);
  };

  Tribe.prototype.setMigrationChance = function (c) {
    this._migrationChance = c;
  };

  Tribe.prototype.progress = function (e) {
    return this._eventProgress[e.id];
  };

  Tribe.prototype.increaseProgress = function (e, progress) {
    // Default to starting from 0 if no progress is stored.
    var currentProgress = 0; // Get the progress from the map if it exists.

    if (this._eventProgress.hasOwnProperty(e.id)) currentProgress = this._eventProgress[e.id]; // Set the new progress.

    this._eventProgress[e.id] = currentProgress + progress;
  };

  Tribe.prototype.resetProgress = function (e) {
    this._eventProgress[e.id] = 0;
  };

  Tribe.prototype.addTechnology = function (technology) {
    if (this._technology.indexOf(technology) > -1) return;

    this._technology.push(technology);
  };

  Tribe.prototype.removeTechnology = function (technology) {
    // Return silently if tribe doesn't have technology.
    var i = this._technology.indexOf(technology);

    if (i == -1) return;

    this._technology.splice(i, 1);
  };

  Tribe.prototype.hasTechnology = function (technology) {
    if (this._technology.indexOf(technology) > -1) return true;else return false;
  };

  Tribe.prototype.addCulture = function (culture) {
    if (this._culture.indexOf(culture) > -1) return;

    this._culture.push(culture);
  };

  Tribe.prototype.removeCulture = function (culture) {
    // Return silently if tribe doesn't have culture.
    var i = this._culture.indexOf(culture);

    if (i == -1) return;

    this._culture.splice(i, 1);
  };

  Tribe.prototype.hasCulture = function (culture) {
    if (this._culture.indexOf(culture) > -1) return true;else return false;
  };

  Tribe.prototype.title = function () {
    if (this._name.length == 0) return "a tribe";else return "the " + language_1.Language.toTitle(this._language.translate(this._name));
  };

  Tribe.prototype.titleCapitalized = function () {
    if (this._name.length == 0) return "A tribe";else return "The " + language_1.Language.toTitle(this._language.translate(this._name));
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
    if (this.hasTechnology("fire")) g = 4 * g;
    if (this.hasTechnology("agriculture")) g = 4 * g;
    return g;
  };

  Tribe.prototype.deathRate = function () {
    var d = 0.0001;
    return d;
  };

  return Tribe;
}();

exports.Tribe = Tribe;

var Attitudes =
/** @class */
function () {
  function Attitudes() {}

  Attitudes.MonolithString = function (monolith) {
    switch (monolith) {
      case Attitudes.Monolith.Unencountered:
        return "unencountered";

      case Attitudes.Monolith.Curious:
        return "curious";

      case Attitudes.Monolith.Superstitious:
        return "superstitious";

      case Attitudes.Monolith.Fearful:
        return "fearful";
    }
  };

  Attitudes.OthersString = function (others) {
    switch (others) {
      case Attitudes.Others.Aggressive:
        return "aggressive";

      case Attitudes.Others.Defensive:
        return "defensive";

      case Attitudes.Others.Diplomatic:
        return "diplomatic";

      case Attitudes.Others.Insular:
        return "insular";
    }
  };

  Attitudes.WorldString = function (world) {
    switch (world) {
      case Attitudes.World.Exploit:
        return "exploitative";

      case Attitudes.World.Explore:
        return "explorative";

      case Attitudes.World.Harmony:
        return "harmonious";

      case Attitudes.World.Survival:
        return "survivalists";
    }
  };

  Attitudes.SelfString = function (self) {
    switch (self) {
      case Attitudes.Self.Hierarchical:
        return "hierarchical";

      case Attitudes.Self.Egalitarian:
        return "egalitarian";
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
}();

exports.Attitudes = Attitudes;

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
})(Attitudes = exports.Attitudes || (exports.Attitudes = {}));

exports.Attitudes = Attitudes;
},{"./random":"random.ts","./idallocator":"idallocator.ts","./language":"language.ts"}],"region.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var random_1 = require("./random"); // A region is a part of the world that can be inhabited by tribes.
//
// Regions have three statistics:
// food: level of food available in the region.
// water: level of water available in the region.
// resources: level of resources available in the region.


var Region =
/** @class */
function () {
  function Region() {
    this.hasMonolith = false;
    this._tribes = [];
    this._nearbyRegions = [];
    this._structures = []; // Choose a random type for the region.

    var t = random_1.Random.interval(0, 6);
    this._type = Region.Type.Undefined;

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
    } // Determine food, water, resource levels.
    // We generate a number between 2 and 4, which is then augmented by the type.


    this._food = random_1.Random.interval(2, 4);
    this._water = random_1.Random.interval(2, 4);
    this._resources = random_1.Random.interval(2, 4);
  } // Given a level number, returns a string description.


  Region.prototype.levelString = function (level) {
    switch (level) {
      case 0:
        return "no";

      case 1:
        return "scarce";

      case 2:
        return "barely adequate";

      case 3:
        return "adequate";

      case 4:
        return "sufficient";

      case 5:
        return "plentiful";

      case 6:
        return "abundant";
    }

    return "INVALID";
  }; // Returns the type of the region.


  Region.prototype.type = function () {
    return this._type;
  };

  Region.prototype.typeString = function () {
    return Region.Type[this._type];
  };

  Region.prototype.typeStringLowercase = function () {
    switch (this._type) {
      case Region.Type.Desert:
        return "desert";

      case Region.Type.Grassland:
        return "grassland";

      case Region.Type.Hills:
        return "hills";

      case Region.Type.Mountains:
        return "mountains";

      case Region.Type.Tundra:
        return "tundra";

      case Region.Type.Valley:
        return "valley";

      case Region.Type.Rainforest:
        return "rainforest";

      case Region.Type.Undefined:
        return "UNDEFINED";
    }
  }; // Returns the string description of the region's type.


  Region.prototype.typeDescription = function () {
    switch (this._type) {
      case Region.Type.Desert:
        return "desert";

      case Region.Type.Grassland:
        return "grassland";

      case Region.Type.Hills:
        return "hilly";

      case Region.Type.Mountains:
        return "mountainous";

      case Region.Type.Tundra:
        return "tundra";

      case Region.Type.Valley:
        return "valley";

      case Region.Type.Rainforest:
        return "rainforest";

      case Region.Type.Undefined:
        return "UNDEFINED";
    }
  }; // Returns the food level of the region, with the type modifier.


  Region.prototype.food = function () {
    switch (this._type) {
      case Region.Type.Desert:
        return this._food - 1;

      case Region.Type.Grassland:
        return this._food + 1;

      case Region.Type.Hills:
        return this._food;

      case Region.Type.Mountains:
        return this._food - 2;

      case Region.Type.Tundra:
        return this._food - 1;

      case Region.Type.Valley:
        return this._food + 1;

      case Region.Type.Rainforest:
        return this._food + 2;

      case Region.Type.Undefined:
        return 0;
    }
  }; // Returns a string representation of the region's food level.


  Region.prototype.foodString = function () {
    return this.levelString(this.food());
  }; // Returns the water level of the region, with the type modifier.


  Region.prototype.water = function () {
    switch (this._type) {
      case Region.Type.Desert:
        return this._water - 2;

      case Region.Type.Grassland:
        return this._water;

      case Region.Type.Hills:
        return this._water + 1;

      case Region.Type.Mountains:
        return this._water - 1;

      case Region.Type.Tundra:
        return this._water - 1;

      case Region.Type.Valley:
        return this._water + 2;

      case Region.Type.Rainforest:
        return this._water;

      case Region.Type.Undefined:
        return 0;
    }
  }; // Returns a string representation of the region's water level.


  Region.prototype.waterString = function () {
    return this.levelString(this.water());
  }; // Returns the resource level of the region, with the type modifier.


  Region.prototype.resources = function () {
    switch (this._type) {
      case Region.Type.Desert:
        return this._resources + 1;

      case Region.Type.Grassland:
        return this._resources - 2;

      case Region.Type.Hills:
        return this._resources + 1;

      case Region.Type.Mountains:
        return this._resources + 2;

      case Region.Type.Tundra:
        return this._resources;

      case Region.Type.Valley:
        return this._resources - 1;

      case Region.Type.Rainforest:
        return this._resources;

      case Region.Type.Undefined:
        return 0;
    }
  }; // Returns a string representation of the region's resources level.


  Region.prototype.resourcesString = function () {
    return this.levelString(this.resources());
  }; // Returns the number of tribes in this region.


  Region.prototype.tribesCount = function () {
    return this._tribes.length;
  }; // Returns a list of tribes in this region.


  Region.prototype.tribes = function () {
    return this._tribes;
  }; // Returns the population of this region.


  Region.prototype.population = function () {
    var sum = 0;

    for (var _i = 0, _a = this._tribes; _i < _a.length; _i++) {
      var t = _a[_i];
      sum += t.population();
    }

    return sum;
  }; // Adds a tribe to this region.


  Region.prototype.addTribe = function (tribe) {
    this._tribes.push(tribe);
  }; // Removes a tribe from this region.
  // Exits silently if the tribe isn't in the region.


  Region.prototype.removeTribe = function (tribe) {
    var index = this._tribes.indexOf(tribe);

    if (index >= 0) {
      this._tribes.splice(index, 1);
    }
  };

  Region.prototype.addNearbyRegion = function (region) {
    // Do nothing if we've already added this region.
    if (this._nearbyRegions.indexOf(region) > -1) return; // Add the other region.

    this._nearbyRegions.push(region); // Call addNearbyRegion for the other region, passing this.


    region.addNearbyRegion(this);
  };

  Region.prototype.nearby = function () {
    return this._nearbyRegions;
  };

  Region.prototype.addStructure = function (structure) {
    if (this._structures.indexOf(structure) > -1) return;else this._structures.push(structure);
  };

  Region.prototype.hasStructure = function (structure) {
    if (this._structures.indexOf(structure) > -1) return true;else return false;
  };

  return Region;
}();

exports.Region = Region;

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
    Type["Undefined"] = "Undefined";
  })(Type = Region.Type || (Region.Type = {}));
})(Region = exports.Region || (exports.Region = {}));

exports.Region = Region;
},{"./random":"random.ts"}],"tribe_events_discovery.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var random_1 = require("./random");

var tribe_1 = require("./tribe");

var region_1 = require("./region");

var language_1 = require("./language");

var DiscoverFireEvent =
/** @class */
function () {
  function DiscoverFireEvent() {}

  DiscoverFireEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.hasTechnology("fire")) return false;
    if (tribe.hasCulture("afraidOfFire")) return false;
    var c = 0.000001;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Curious) c = 0.000002;
    return random_1.Random.progressiveChance(c, progress, 0.005);
  };

  DiscoverFireEvent.progress = function (tribe, region) {
    if (tribe.hasTechnology("fire")) return 0;
    if (tribe.hasCulture("afraidOfFire")) return 0;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (region.type() == region_1.Region.Type.Desert) return random_1.Random.interval(0, 3);else return random_1.Random.interval(-1, 2);
  };

  DiscoverFireEvent.isChoice = function () {
    return true;
  };

  DiscoverFireEvent.choices = function (tribe) {
    return ["Fire is useful.", "Fire is dangerous."];
  };

  DiscoverFireEvent.choicePrompt = function (tribe) {
    return "While wandering on a hot, dry day, a member of " + tribe.title() + " notices food left in the wake of a wildfire.\n        Noticing that the food seems firmer and smells different, the tribesperson brings it back to show the others.";
  };

  DiscoverFireEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe is curious about the possible uses of this phenomenon. Some begin using it to cook their food,\n            while others use it to provide light at night.", "The tribe is afraid of this phenomenon. They avoid it, not understanding the benefits it could bring."];
  };

  DiscoverFireEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addTechnology("fire");
      if (random_1.Random.chance(0.1)) tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Curious;
      console.log(tribe.title() + " has discovered fire.");
    }, function () {
      tribe.addCulture("afraidOfFire");
      if (random_1.Random.chance(0.1)) tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Fearful;
      console.log(tribe.title() + " has shunned fire.");
    }];
  };

  DiscoverFireEvent.id = "DiscoverFireEvent";
  return DiscoverFireEvent;
}();

exports.DiscoverFireEvent = DiscoverFireEvent;

var DiscoverToolsEvent =
/** @class */
function () {
  function DiscoverToolsEvent() {}

  DiscoverToolsEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.hasTechnology("tools")) return false;
    var c = 0.000001;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Curious) c = 0.000002;
    return random_1.Random.progressiveChance(c, progress, 0.005);
  };

  DiscoverToolsEvent.progress = function (tribe, region) {
    if (tribe.hasTechnology("tools")) return 0;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (region.resources() > 2) return random_1.Random.interval(0, 3);else return random_1.Random.interval(-1, 2);
  };

  DiscoverToolsEvent.isChoice = function () {
    return false;
  };

  DiscoverToolsEvent.choices = function (tribe) {
    return [];
  };

  DiscoverToolsEvent.choicePrompt = function (tribe) {
    return "";
  };

  DiscoverToolsEvent.outcomeMessages = function (tribe, region) {
    return ["A small group from " + tribe.title() + " have developed simple stone tools to aid them in their daily lives.\n            They show the rest of their tribe, and the tools quickly catch on, with the tribe using them to enhance\n            their abilities."];
  };

  DiscoverToolsEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addTechnology("tools");
      console.log(tribe.title() + " has discovered tools.");
    }];
  };

  DiscoverToolsEvent.id = "DiscoverToolsEvent";
  return DiscoverToolsEvent;
}();

exports.DiscoverToolsEvent = DiscoverToolsEvent;

var DiscoverConstructionEvent =
/** @class */
function () {
  function DiscoverConstructionEvent() {}

  DiscoverConstructionEvent.triggers = function (tribe, region, progress) {
    // Can't trigger if:
    // Tribe is unencountered
    // Tribe doesn't have tools
    // Tribe already has construction.
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (!tribe.hasTechnology("tools")) return false;
    if (tribe.hasTechnology("construction")) return false;
    var c = 0.000001;
    if (tribe.attitudes.others == tribe_1.Attitudes.Others.Defensive) c = 0.000002;
    return random_1.Random.progressiveChance(c, progress, 0.005);
  };

  DiscoverConstructionEvent.progress = function (tribe, region) {
    // Can't progress if:
    // Tribe is unencountered
    // Tribe doesn't have tools
    // Tribe already has construction.
    if (!tribe.hasTechnology("tools")) return 0;
    if (tribe.hasTechnology("construction")) return 0;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (region.resources() > 0) return random_1.Random.interval(0, 1);else return 0;
  };

  DiscoverConstructionEvent.isChoice = function () {
    return false;
  };

  DiscoverConstructionEvent.choices = function (tribe) {
    return [];
  };

  DiscoverConstructionEvent.choicePrompt = function (tribe) {
    return "";
  };

  DiscoverConstructionEvent.outcomeMessages = function (tribe, region) {
    return [tribe.titleCapitalized() + " has begun using stone and wood, along with their tools, to construct\n            simple buildings in which to live and store food."];
  };

  DiscoverConstructionEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addTechnology("construction");
      tribe.setMigrationChance(0);
      console.log(tribe.title() + " has discovered construction.");
    }];
  };

  DiscoverConstructionEvent.id = "DiscoverConstructionEvent";
  return DiscoverConstructionEvent;
}();

exports.DiscoverConstructionEvent = DiscoverConstructionEvent;

var DiscoverLanguageEvent =
/** @class */
function () {
  function DiscoverLanguageEvent() {}

  DiscoverLanguageEvent.triggers = function (tribe, region, progress) {
    // Can't trigger if:
    // Tribe is unencountered
    // Tribe population is < 80
    // Tribe already has language
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.hasTechnology("language")) return false;
    if (tribe.population() < 80) return false;
    var c = 0.000001;
    if (tribe.attitudes.others == tribe_1.Attitudes.Others.Diplomatic) c = 0.000002;
    return random_1.Random.progressiveChance(c, progress, 0.01);
  };

  DiscoverLanguageEvent.progress = function (tribe, region) {
    // Can't progress if:
    // Tribe is unencountered
    // Tribe population is < 80
    if (tribe.hasTechnology("language")) return 0;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (tribe.population() < 80) return 0;
    return random_1.Random.interval(0, 3);
  };

  DiscoverLanguageEvent.isChoice = function () {
    return false;
  };

  DiscoverLanguageEvent.choices = function (tribe) {
    return [];
  };

  DiscoverLanguageEvent.choicePrompt = function (tribe) {
    return "";
  };

  DiscoverLanguageEvent.outcomeMessages = function (tribe, region) {
    DiscoverLanguageEvent.tribeName = DiscoverLanguageEvent.generateTribeName(tribe, region);
    return ["You notice that a tribe seems to be using a more advanced form of communication.\n            As your language coprocessor engages, you discover that they now call themselves the\n            " + language_1.Language.toTitle(tribe.language().translate(DiscoverLanguageEvent.tribeName)) + "."];
  };

  DiscoverLanguageEvent.outcomeFunctions = function (tribe, region) {
    var tribeName = DiscoverLanguageEvent.tribeName;
    return [function () {
      tribe.addTechnology("language");
      tribe.setName(tribeName);
      console.log("A tribe has discovered language.");
    }];
  };

  DiscoverLanguageEvent.generateTribeName = function (tribe, region) {
    // Determine what to call the tribe.
    var tribeDescription = [];
    var adjective = "";

    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Superstitious) {
      adjective = "devout";
    } else if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Curious) {
      adjective = "curious";
    } else if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Fearful) {
      adjective = "fearful";
    }

    if (tribe.attitudes.others == tribe_1.Attitudes.Others.Aggressive) {
      tribeDescription.push(new language_1.Noun("warrior", true, false, [adjective]));
    } else if (tribe.attitudes.world == tribe_1.Attitudes.World.Explore) {
      tribeDescription.push(new language_1.Noun("explorer", true, false, [adjective]));
    } else if (tribe.attitudes.self == tribe_1.Attitudes.Self.Egalitarian) {
      tribeDescription.push(new language_1.Noun("community", false, false, [adjective]));
    } else {
      tribeDescription.push(new language_1.Noun("person", true, false, [adjective]));
    }

    return tribeDescription;
  };

  DiscoverLanguageEvent.id = "DiscoverLanguageEvent";
  return DiscoverLanguageEvent;
}();

exports.DiscoverLanguageEvent = DiscoverLanguageEvent;

var DiscoverAgricultureEvent =
/** @class */
function () {
  function DiscoverAgricultureEvent() {}

  DiscoverAgricultureEvent.triggers = function (tribe, region, progress) {
    // Can't trigger if:
    // Tribe is unencountered
    // Tribe population is < 200
    // Tribe doesn't have tools
    // Tribe already has agriculture
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.hasTechnology("agriculture")) return false;
    if (tribe.population() < 200) return false;
    if (!tribe.hasTechnology("tools")) return false; // If the tribe has already abandoned agriculture in the past, this event cannot trigger.

    if (tribe.hasCulture("abandonedAgriculture")) return false;
    var c = 0.000001; // Increase chance in regions with high food.

    if (region.food() > 4) c = 0.000005;else if (region.food() > 2) c = 0.000002;
    return random_1.Random.progressiveChance(c, progress, 0.01);
  };

  DiscoverAgricultureEvent.progress = function (tribe, region) {
    // Can't progress if:
    // Tribe is unencountered
    // Tribe population is < 200
    // Tribe doesn't have tools.
    if (tribe.hasTechnology("agriculture")) return 0;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (tribe.population() < 200) return 0;
    if (!tribe.hasTechnology("tools")) return 0;
    if (tribe.hasCulture("abandonedAgriculture")) return 0;
    if (region.food() > 4) return random_1.Random.interval(1, 5);else if (region.food() > 2) return random_1.Random.interval(-1, 4);else return random_1.Random.interval(-2, 3);
  };

  DiscoverAgricultureEvent.isChoice = function () {
    return false;
  };

  DiscoverAgricultureEvent.choices = function (tribe) {
    return [];
  };

  DiscoverAgricultureEvent.choicePrompt = function (tribe) {
    return "";
  };

  DiscoverAgricultureEvent.outcomeMessages = function (tribe, region) {
    return ["A handful of members of " + tribe.title() + " seem to have stopped hunting or gathering,\n            and instead have begun collecting wild seeds and planting them. After the first harvest,\n            this new method of producing food is adopted by the whole tribe."];
  };

  DiscoverAgricultureEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addTechnology("agriculture");
      console.log("A tribe has discovered agriculture.");
    }];
  };

  DiscoverAgricultureEvent.id = "DiscoverAgricultureEvent";
  return DiscoverAgricultureEvent;
}();

exports.DiscoverAgricultureEvent = DiscoverAgricultureEvent;
},{"./random":"random.ts","./tribe":"tribe.ts","./region":"region.ts","./language":"language.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34385" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","tribe_events_discovery.ts"], null)
//# sourceMappingURL=/tribe_events_discovery.369b708a.js.map