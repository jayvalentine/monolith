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
},{"./random":"random.ts","./idallocator":"idallocator.ts","./language":"language.ts"}],"tribe_events_disasters.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var random_1 = require("./random");

var tribe_1 = require("./tribe");

var FireSpreadsEvent =
/** @class */
function () {
  function FireSpreadsEvent() {}

  FireSpreadsEvent.triggers = function (tribe, region, progress) {
    if (!(tribe.hasTechnology("fire") && tribe.hasTechnology("construction"))) return false;
    if (tribe.hasCulture("cautious")) return random_1.Random.chance(0.000001);else return random_1.Random.chance(0.00003);
  };

  FireSpreadsEvent.progress = function (tribe, region) {
    return 0;
  };

  FireSpreadsEvent.isChoice = function () {
    return true;
  };

  FireSpreadsEvent.choices = function (tribe) {
    return ["They are being punished.", "This is a learning experience."];
  };

  FireSpreadsEvent.choicePrompt = function (tribe) {
    return "One day, while a member of " + tribe.title() + " is cooking with fire, the roof of their home\n    catches alight. Before long, multiple buildings are in flames. The tribespeople desperately try\n    to put out the fire, and succeed, but not before it has caused significant damage.";
  };

  FireSpreadsEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe sees this as a punishment, but for what, they are not sure.", "The tribe has suffered heavy losses, but finds the strength to continue, and learn how to control the fire better."];
  };

  FireSpreadsEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      // 20% chance for tribe to become superstitious,
      // 80% chance for tribe to become fearful.
      // Tribe gains the 'disasters are punishment' culture.
      if (random_1.Random.chance(0.2)) {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Superstitious;
      } else {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Fearful;
      }

      tribe.addCulture("disastersArePunishment"); // Tribe population reduced by 30-70%.

      var currentPopulation = tribe.population();
      var lowerLimit = Math.floor(currentPopulation * 0.3);
      var upperLimit = Math.floor(currentPopulation * 0.7);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      console.log("New population: " + tribe.population());
    }, function () {
      // 50% chance for tribe to become curious,
      // 50% chance for tribe to become fearful.
      if (random_1.Random.chance(0.5)) {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Curious;
      } else {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Fearful;
      } // Tribe population reduced by 30-70%.


      var currentPopulation = tribe.population();
      var lowerLimit = Math.floor(currentPopulation * 0.3);
      var upperLimit = Math.floor(currentPopulation * 0.7);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      tribe.addCulture("cautious");
      console.log("New population: " + tribe.population());
    }];
  };

  FireSpreadsEvent.id = "FireSpreadsEvent";
  return FireSpreadsEvent;
}();

exports.FireSpreadsEvent = FireSpreadsEvent;

var DroughtEvent =
/** @class */
function () {
  function DroughtEvent() {}

  DroughtEvent.triggers = function (tribe, region, progress) {
    if (!tribe.hasTechnology("agriculture")) return false; // Chance dependent on water in region.
    // 0 chance if water > 2.

    switch (region.water()) {
      case 0:
        return random_1.Random.chance(0.0005);

      case 1:
        return random_1.Random.chance(0.0001);

      case 2:
        return random_1.Random.chance(0.00005);

      default:
        return false;
    }
  };

  DroughtEvent.progress = function (tribe, region) {
    return 0;
  };

  DroughtEvent.isChoice = function () {
    return true;
  };

  DroughtEvent.choices = function (tribe) {
    return ["They are being punished.", "They must leave this barren place.", "They must abandon their farms and hunt for food instead."];
  };

  DroughtEvent.choicePrompt = function (tribe) {
    return "There have not been any rains in the region for some time, and the crops\n    of " + tribe.title() + " are suffering for it. It looks as though there will not be a harvest this year.";
  };

  DroughtEvent.outcomeMessages = function (tribe, region) {
    var outcomeMessages = [];

    if (tribe.hasCulture("disastersArePunishment")) {
      outcomeMessages.push("The tribe sees this as a sign of your displeasure.\n        They begin praying in the hope that it will alleviate the drought,\n        but it does not.");
    } else {
      outcomeMessages.push("The tribe sees this as some kind of punishment, but for what, they are not sure.");
    }

    outcomeMessages.push("The tribe moves on from the region, leaving their farms behind.");
    outcomeMessages.push("The tribe abandons agriculture, and transitions back to a hunter-gatherer society.");
    return outcomeMessages;
  };

  DroughtEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      // 20% chance for tribe to become superstitious,
      // 80% chance for tribe to become fearful.
      // Tribe gains the 'disasters are punishment' culture.
      if (random_1.Random.chance(0.2)) {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Superstitious;
      } else {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Fearful;
      }

      tribe.addCulture("disastersArePunishment"); // Tribe population reduced by 60-90%.

      var currentPopulation = tribe.population();
      var lowerLimit = Math.floor(currentPopulation * 0.6);
      var upperLimit = Math.floor(currentPopulation * 0.9);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      console.log("New population: " + tribe.population());
    }, function () {
      // Tribe migrates to another region.
      var otherRegions = region.nearby();
      var migrateRegion = random_1.Random.choice(otherRegions);
      region.removeTribe(tribe);
      migrateRegion.addTribe(tribe); // Tribe population reduced by 60-90%.

      var currentPopulation = tribe.population();
      var lowerLimit = Math.floor(currentPopulation * 0.6);
      var upperLimit = Math.floor(currentPopulation * 0.9);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      console.log("New population: " + tribe.population());
    }, function () {
      // Tribe abandons agriculture.
      tribe.addCulture("abandonedAgriculture");
      tribe.removeTechnology("agriculture"); // Tribe population reduced by 60-90%.

      var currentPopulation = tribe.population();
      var lowerLimit = Math.floor(currentPopulation * 0.6);
      var upperLimit = Math.floor(currentPopulation * 0.9);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      console.log("New population: " + tribe.population());
    }];
  };

  DroughtEvent.id = "DroughtEvent";
  return DroughtEvent;
}();

exports.DroughtEvent = DroughtEvent;

var PlagueEvent =
/** @class */
function () {
  function PlagueEvent() {}

  PlagueEvent.triggers = function (tribe, region, progress) {
    if (tribe.hasTechnology("vaccines")) return false;
    if (tribe.population() < 1000) return false;
    if (tribe.hasTechnology("medicine")) return random_1.Random.chance(0.001);else return random_1.Random.chance(0.005);
  };

  PlagueEvent.progress = function (tribe, region) {
    return 0;
  };

  PlagueEvent.isChoice = function () {
    return false;
  };

  PlagueEvent.choices = function (tribe) {
    return [];
  };

  PlagueEvent.choicePrompt = function (tribe) {
    return "";
  };

  PlagueEvent.outcomeMessages = function (tribe, region) {
    var message = "With the population of " + tribe.title() + " growing rapidly, disease is commonplace in their settlement.\n        Before long, a plague spreads among the tribespeople, killing a significant number of them.";

    if (tribe.hasCulture("disastersArePunishment")) {
      message += " Many in the tribe see this as a punishment for their sins, and pray to you for forgiveness.";
    } else if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Curious) {
      message += " Some of the tribespeople are committed to finding a way to avoid plagues like this in the future.";
    }

    return [message];
  };

  PlagueEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      // Tribe population reduced by 70-95%.
      var currentPopulation = tribe.population();
      var lowerLimit = Math.floor(currentPopulation * 0.7);
      var upperLimit = Math.floor(currentPopulation * 0.95);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      console.log("New population: " + tribe.population());

      if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Curious) {
        tribe.addCulture("earlyScientists");
      }
    }];
  };

  PlagueEvent.id = "PlagueEvent";
  return PlagueEvent;
}();

exports.PlagueEvent = PlagueEvent;
},{"./random":"random.ts","./tribe":"tribe.ts"}],"region.ts":[function(require,module,exports) {
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
},{"./random":"random.ts","./tribe":"tribe.ts","./region":"region.ts","./language":"language.ts"}],"tribe_events.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tribe_1 = require("./tribe");

var random_1 = require("./random");

var language_1 = require("./language");

var disasters = __importStar(require("./tribe_events_disasters"));

var discovery = __importStar(require("./tribe_events_discovery"));

var EncounterEvent =
/** @class */
function () {
  function EncounterEvent() {}

  EncounterEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Unencountered) return false;else if (region.hasMonolith) return true;
    return false;
  };

  EncounterEvent.progress = function (tribe, region) {
    return 0;
  };

  EncounterEvent.isChoice = function () {
    return false;
  };

  EncounterEvent.choices = function (tribe) {
    return [];
  };

  EncounterEvent.choicePrompt = function (tribe) {
    return "";
  };

  EncounterEvent.outcomeMessages = function (tribe, region) {
    var roll = random_1.Random.interval(0, 2);

    switch (roll) {
      case 0:
        EncounterEvent.newAttitude = tribe_1.Attitudes.Monolith.Curious;
        break;

      case 1:
        EncounterEvent.newAttitude = tribe_1.Attitudes.Monolith.Superstitious;
        break;

      case 2:
        EncounterEvent.newAttitude = tribe_1.Attitudes.Monolith.Fearful;
        break;
    }

    return ["You encounter a tribe of " + tribe.population() + " people.\n    They are " + tribe.attitudes.othersString() + ", " + tribe.attitudes.worldString() + ",\n    and " + tribe.attitudes.selfString() + ".\n    They seem " + tribe_1.Attitudes.MonolithString(EncounterEvent.newAttitude) + " towards you."];
  };

  EncounterEvent.outcomeFunctions = function (tribe, region) {
    var attitude = EncounterEvent.newAttitude;
    return [function () {
      tribe.attitudes.monolith = attitude;
      console.log("Direct encounter: set tribe attitude to " + tribe_1.Attitudes.MonolithString(attitude));
    }];
  };

  EncounterEvent.id = "EncounterEvent";
  return EncounterEvent;
}();

var IndirectEncounterEvent =
/** @class */
function () {
  function IndirectEncounterEvent() {}

  IndirectEncounterEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Unencountered) return false; // Get any other encountered tribes in the region.

    var otherTribes = region.tribes().filter(function (value, index, array) {
      return value != tribe && value.attitudes.monolith != tribe_1.Attitudes.Monolith.Unencountered;
    });
    if (otherTribes.length > 0) return true;else return false;
  };

  IndirectEncounterEvent.progress = function (tribe, region) {
    return 0;
  };

  IndirectEncounterEvent.isChoice = function () {
    return false;
  };

  IndirectEncounterEvent.choices = function (tribe) {
    return [];
  };

  IndirectEncounterEvent.choicePrompt = function (tribe) {
    return "";
  };

  IndirectEncounterEvent.outcomeMessages = function (tribe, region) {
    // Get any tribes in the region that have been encountered.
    var otherTribes = region.tribes().filter(function (value, index, array) {
      return value != tribe && value.attitudes.monolith != tribe_1.Attitudes.Monolith.Unencountered;
    }); // Choose one at random.

    IndirectEncounterEvent.otherTribe = random_1.Random.choice(otherTribes);
    var attitude = tribe_1.Attitudes.MonolithString(IndirectEncounterEvent.otherTribe.attitudes.monolith);
    return [tribe.titleCapitalized() + " has encountered a new tribe of " + tribe.population() + " people.\n    After hearing of you, they seem " + attitude + "."];
  };

  IndirectEncounterEvent.outcomeFunctions = function (tribe, region) {
    var attitude = IndirectEncounterEvent.otherTribe.attitudes.monolith;
    return [function () {
      tribe.attitudes.monolith = attitude;
      console.log("Indirect encounter: set " + tribe.title() + " attitude to " + tribe_1.Attitudes.MonolithString(attitude));
    }];
  };

  IndirectEncounterEvent.id = "IndirectEncounterEvent";
  return IndirectEncounterEvent;
}();

var TribeDestroyedEvent =
/** @class */
function () {
  function TribeDestroyedEvent() {}

  TribeDestroyedEvent.triggers = function (tribe, region, progress) {
    if (tribe.population() <= 0) return true;else return false;
  };

  TribeDestroyedEvent.progress = function (tribe, region) {
    return 0;
  };

  TribeDestroyedEvent.isChoice = function () {
    return false;
  };

  TribeDestroyedEvent.choices = function (tribe) {
    return [];
  };

  TribeDestroyedEvent.choicePrompt = function (tribe) {
    return "";
  };

  TribeDestroyedEvent.outcomeMessages = function (tribe, region) {
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) {
      return [""];
    } else {
      return ["You sense a great loss. " + tribe.titleCapitalized() + " is no more."];
    }
  };

  TribeDestroyedEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.dead = true;
      console.log(tribe.title() + " has died.");
    }];
  };

  TribeDestroyedEvent.id = "TribeDestroyedEvent";
  return TribeDestroyedEvent;
}();

var AttackEvent =
/** @class */
function () {
  function AttackEvent() {}

  AttackEvent.triggers = function (tribe, region, progress) {
    var c = 0.0001;
    if (tribe.attitudes.others == tribe_1.Attitudes.Others.Aggressive) c = 0.0002; // Are there any other tribes in this region?

    var otherTribes = region.tribes().filter(function (value, index, array) {
      return value != tribe;
    }); // Defensive tribes will attack if relationship is -1 or lower.
    // Any other non-aggressive tribe will attack if -2 or lower.

    if (tribe.attitudes.others == tribe_1.Attitudes.Others.Defensive) {
      otherTribes = otherTribes.filter(function (v, i, a) {
        return tribe.relationship(v) <= -1;
      });
    } else if (tribe.attitudes.others != tribe_1.Attitudes.Others.Aggressive) {
      otherTribes = otherTribes.filter(function (v, i, a) {
        return tribe.relationship(v) <= -2;
      });
    }

    if (otherTribes.length == 0) return false; // Triggers with chance 0.0001.

    if (random_1.Random.chance(c)) {
      AttackEvent.defender = random_1.Random.choice(otherTribes);
      return true;
    } else {
      return false;
    }
  };

  AttackEvent.progress = function (tribe, region) {
    return 0;
  };

  AttackEvent.isChoice = function () {
    return false;
  };

  AttackEvent.choices = function (tribe) {
    return [];
  };

  AttackEvent.choicePrompt = function (tribe) {
    return "";
  };

  AttackEvent.outcomeMessages = function (tribe, region) {
    var attacker = tribe;
    var attackerRoll = (random_1.Random.interval(1, 10) + attacker.attack()) * Math.floor(attacker.population() * 0.1);
    var defenderRoll = (random_1.Random.interval(1, 10) + AttackEvent.defender.defense()) * Math.floor(AttackEvent.defender.population() * 0.1);
    AttackEvent.outcome = attackerRoll - defenderRoll; // Silent message if none of the tribes involved have been encountered.

    if (attacker.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered && AttackEvent.defender.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) {
      return [""];
    }

    var outcomeMessage;
    var lossesMessage = "";

    if (AttackEvent.outcome > 0) {
      var defenderLosses = Math.min(AttackEvent.defender.population(), AttackEvent.outcome);
      outcomeMessage = "The attack was successful.";

      if (defenderLosses == AttackEvent.defender.population()) {
        lossesMessage = "The defenders have been wiped out.";
      } else {
        lossesMessage = "The defenders have lost " + defenderLosses + " people in the attack.";
      }
    } else if (AttackEvent.outcome < 0) {
      var attackerLosses = Math.min(attacker.population(), -AttackEvent.outcome);
      outcomeMessage = "The attack was repulsed.";

      if (attackerLosses == attacker.population()) {
        lossesMessage = "The attackers have been wiped out.";
      } else {
        lossesMessage = "The attackers have lost " + attackerLosses + " people in the attack.";
      }
    } else {
      outcomeMessage = "The attack ended in a stalemate.";
    }

    return [attacker.titleCapitalized() + " has attacked " + AttackEvent.defender.title() + ".\n    " + outcomeMessage + "\n    " + lossesMessage];
  };

  AttackEvent.outcomeFunctions = function (tribe, region) {
    var defender = AttackEvent.defender;
    var outcome = AttackEvent.outcome;

    if (outcome > 0) {
      return [function () {
        console.log("attack: success (" + outcome + ")");
        defender.decreasePopulation(outcome);
        tribe.increasePopulation(Math.floor(outcome / 2));
      }];
    } else if (outcome < 0) {
      return [function () {
        console.log("attack: failure (" + outcome + ")");
        tribe.decreasePopulation(-outcome);
      }];
    } else {
      return [function () {
        console.log("attack: stalemate");
      }];
    }
  };

  AttackEvent.id = "AttackEvent";
  return AttackEvent;
}();

var MigrationEvent =
/** @class */
function () {
  function MigrationEvent() {}

  MigrationEvent.triggers = function (tribe, region, progress) {
    return tribe.migrate();
  };

  MigrationEvent.progress = function (tribe, region) {
    return 0;
  };

  MigrationEvent.isChoice = function () {
    return false;
  };

  MigrationEvent.choices = function (tribe) {
    return [];
  };

  MigrationEvent.choicePrompt = function (tribe) {
    return "";
  };

  MigrationEvent.outcomeMessages = function (tribe, region) {
    var otherRegions = region.nearby();
    MigrationEvent.migrateRegion = random_1.Random.choice(otherRegions);

    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Unencountered) {
      return [tribe.titleCapitalized() + " has migrated from a " + region.typeDescription() + " region to\n        a " + MigrationEvent.migrateRegion.typeDescription() + " region."];
    } else return [""];
  };

  MigrationEvent.outcomeFunctions = function (tribe, region) {
    var migrateRegion = MigrationEvent.migrateRegion;
    return [function () {
      region.removeTribe(tribe);
      migrateRegion.addTribe(tribe);
      console.log(tribe.title() + " has migrated from " + region.typeString() + " to " + migrateRegion.typeString() + ".");
    }];
  };

  MigrationEvent.id = "MigrationEvent";
  return MigrationEvent;
}();

var TribeWorshipsMonolithEvent =
/** @class */
function () {
  function TribeWorshipsMonolithEvent() {}

  TribeWorshipsMonolithEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Superstitious) return false;
    if (!region.hasMonolith) return false; // This event does not trigger if the tribe already worships the monolith.

    if (tribe.hasCulture("worshipsMonolith")) {
      return false;
    }

    return random_1.Random.progressiveChance(0.0001, progress, 0.1);
  };

  TribeWorshipsMonolithEvent.progress = function (tribe, region) {
    return random_1.Random.interval(0, 2);
  };

  TribeWorshipsMonolithEvent.isChoice = function () {
    return true;
  };

  TribeWorshipsMonolithEvent.choices = function (tribe) {
    return ["I am not their god.", "I am their god, and I am good.", "I am their god, and they should fear me."];
  };

  TribeWorshipsMonolithEvent.choicePrompt = function (tribe) {
    return tribe.titleCapitalized() + " has taken a great interest in you. Tribe members regularly visit you, bringing\n    small offerings and prostrating themselves at your base. It becomes obvious that this is a form of primitive worship.";
  };

  TribeWorshipsMonolithEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe is confused, but seems to accept the fact that you are not a supernatural being.", "The tribe rejoices, pleased to have your approval. The visits become more frequent.", "The tribe is terrified of you, and while they begin bringing larger offerings, it is clear that the reasons\n      for their reverance have changed."];
  };

  TribeWorshipsMonolithEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      // 50% chance for tribe to become curious.
      // 50% chance for tribe to migrate.
      if (random_1.Random.chance(0.5)) {
        tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Curious;
      } else {
        var otherRegions = region.nearby();
        var migrateRegion = random_1.Random.choice(otherRegions);
        region.removeTribe(tribe);
        migrateRegion.addTribe(tribe);
      }
    }, function () {
      // Tribe stays superstitious and migration chance reduces to 0.
      tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Superstitious;
      tribe.addCulture("worshipsMonolith");
      tribe.setMigrationChance(0);
    }, function () {
      // Tribe becomes fearful.
      tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Fearful;
      tribe.addCulture("worshipsMonolith");
      tribe.addCulture("fearsMonolith");
    }];
  };

  TribeWorshipsMonolithEvent.id = "TribeWorshipsMonolithEvent";
  return TribeWorshipsMonolithEvent;
}();

var TribeCuriousOfMonolithEvent =
/** @class */
function () {
  function TribeCuriousOfMonolithEvent() {}

  TribeCuriousOfMonolithEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Curious) return false;
    if (!region.hasMonolith) return false; // This event does not trigger if the tribe already worships the monolith.

    if (tribe.hasCulture("curiousOfMonolith")) {
      return false;
    }

    return random_1.Random.progressiveChance(0.0001, progress, 0.1);
  };

  TribeCuriousOfMonolithEvent.progress = function (tribe, region) {
    return random_1.Random.interval(0, 2);
  };

  TribeCuriousOfMonolithEvent.isChoice = function () {
    return true;
  };

  TribeCuriousOfMonolithEvent.choices = function (tribe) {
    return ["I am merely a machine.", "They should not be so curious."];
  };

  TribeCuriousOfMonolithEvent.choicePrompt = function (tribe) {
    return "You notice that members of " + tribe.title() + " have been observing you cautiously since your landing.\n    Every now and then some of them visit you, studying your metal exterior. They are obviously wondering what\n    exactly you are.";
  };

  TribeCuriousOfMonolithEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe doesn't understand, but seems even more curious about you now.", "The tribe is afraid, and stops visiting you."];
  };

  TribeCuriousOfMonolithEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addCulture("curiousOfMonolith");
    }, function () {
      tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Fearful;
    }];
  };

  TribeCuriousOfMonolithEvent.id = "TribeCuriousOfMonolithEvent";
  return TribeCuriousOfMonolithEvent;
}();

var TribeFearsMonolithEvent =
/** @class */
function () {
  function TribeFearsMonolithEvent() {}

  TribeFearsMonolithEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Fearful) return false;
    if (!region.hasMonolith) return false; // This event does not trigger if the tribe already worships the monolith.

    if (tribe.hasCulture("fearsMonolith")) {
      return false;
    }

    return random_1.Random.progressiveChance(0.0001, progress, 0.1);
  };

  TribeFearsMonolithEvent.progress = function (tribe, region) {
    return random_1.Random.interval(0, 2);
  };

  TribeFearsMonolithEvent.isChoice = function () {
    return false;
  };

  TribeFearsMonolithEvent.choices = function (tribe) {
    return [];
  };

  TribeFearsMonolithEvent.choicePrompt = function (tribe) {
    return "";
  };

  TribeFearsMonolithEvent.outcomeMessages = function (tribe, region) {
    return ["Members of " + tribe.title() + " are taking turns observing you while the rest of the tribe\n      sleeps. They are very clearly afraid of you."];
  };

  TribeFearsMonolithEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addCulture("fearsMonolith");
    }];
  };

  TribeFearsMonolithEvent.id = "TribeFearsMonolithEvent";
  return TribeFearsMonolithEvent;
}();

var TribeAsksMonolithPurposeEvent =
/** @class */
function () {
  function TribeAsksMonolithPurposeEvent() {}

  TribeAsksMonolithPurposeEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Curious) return false;
    if (!region.hasMonolith) return false;
    if (!tribe.hasCulture("curiousOfMonolith")) return false;
    if (!tribe.hasTechnology("language")) return false;
    if (tribe.hasCulture("touchedByAliens")) return false;
    if (tribe.hasCulture("acceptsMonolith")) return false;
    return random_1.Random.progressiveChance(0.00001, progress, 0.05);
  };

  TribeAsksMonolithPurposeEvent.progress = function (tribe, region) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Curious) return 0;
    if (!region.hasMonolith) return 0;
    if (!tribe.hasCulture("curiousOfMonolith")) return 0;
    if (!tribe.hasTechnology("language")) return 0;
    if (tribe.hasCulture("touchedByAliens")) return 0;
    if (tribe.hasCulture("acceptsMonolith")) return 0;
    return 1;
  };

  TribeAsksMonolithPurposeEvent.isChoice = function () {
    return true;
  };

  TribeAsksMonolithPurposeEvent.choices = function (tribe) {
    return ["I came from another world.", "I am merely a machine.", "I am a part of this world."];
  };

  TribeAsksMonolithPurposeEvent.choicePrompt = function (tribe) {
    return "One day a strange thing happens. A single member of " + tribe.title() + " approaches\n    you, and kneels at your base. They place one hand on your metal exterior, and then ask you a question:\n    \"What are you, great stone?\"";
  };

  TribeAsksMonolithPurposeEvent.outcomeMessages = function (tribe, region) {
    return ["The tribesperson is confused, as they do not know that there are other worlds like this one.\n      However, your interaction seems to plant a seed in their mind, as they consider what you just told them.", "The tribesperson seems to understand - you are like their tools and buildings, only different.", "The tribesperson seems to understand - you are a natural formation, like the trees and stones around them."];
  };

  TribeAsksMonolithPurposeEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addCulture("touchedByAliens");
    }, function () {
      tribe.addCulture("acceptsMonolith");
    }, function () {
      tribe.addCulture("acceptsMonolith");
    }];
  };

  TribeAsksMonolithPurposeEvent.id = "TribeAsksMonolithPurposeEvent";
  return TribeAsksMonolithPurposeEvent;
}();

var TribeBuildsTempleEvent =
/** @class */
function () {
  function TribeBuildsTempleEvent() {}

  TribeBuildsTempleEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is not in same region as the monolith
    // Tribe does not have the 'worships monolith' culture
    // Tribe does not have construction
    if (!region.hasMonolith) return false;
    if (!tribe.hasCulture("worshipsMonolith")) return false;
    if (!tribe.hasTechnology("construction")) return false; // Only triggers once per game.

    if (TribeBuildsTempleEvent.triggered) return false;

    if (random_1.Random.progressiveChance(0.00001, progress, 0.05)) {
      TribeBuildsTempleEvent.triggered = true;
      return true;
    } else {
      return false;
    }
  };

  TribeBuildsTempleEvent.progress = function (tribe, region) {
    if (!region.hasMonolith) return 0;
    if (!tribe.hasCulture("worshipsMonolith")) return 0;
    if (!tribe.hasTechnology("construction")) return 0;
    if (TribeBuildsTempleEvent.triggered) return 0;
    return 1;
  };

  TribeBuildsTempleEvent.isChoice = function () {
    return true;
  };

  TribeBuildsTempleEvent.choices = function (tribe) {
    return ["I am not worthy of their worship.", "They are right to revere me."];
  };

  TribeBuildsTempleEvent.choicePrompt = function (tribe) {
    return "You notice that members of " + tribe.title() + " have begun bringing construction equipment and materials to you.\n    Before long a handful of standing stones, obviously fashioned in your image, surrounds the rim of the crater where you\n    have landed.";
  };

  TribeBuildsTempleEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe is confused, as you had told them you were their god.\n      They are worried that building the temple has disturbed you,\n      and leave your landing site in peace, with the temple only half-finished.", "The tribe continues constructing the temple, celebrating once it is finished."];
  };

  TribeBuildsTempleEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      region.addStructure("partialMonolithTemple");
      var otherRegions = region.nearby();
      var migrateRegion = random_1.Random.choice(otherRegions);
      region.removeTribe(tribe);
      migrateRegion.addTribe(tribe);
    }, function () {
      tribe.addCulture("celebratesMonolith");
      tribe.addCulture("templeBuilders");
      region.addStructure("monolithTemple");
    }];
  };

  TribeBuildsTempleEvent.id = "TribeBuildsTempleEvent";
  TribeBuildsTempleEvent.triggered = false;
  return TribeBuildsTempleEvent;
}();

var TribeAttacksMonolithEvent =
/** @class */
function () {
  function TribeAttacksMonolithEvent() {}

  TribeAttacksMonolithEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Fearful) return false;
    if (!region.hasMonolith) return false;
    if (!tribe.hasCulture("fearsMonolith")) return false;
    if (!tribe.hasTechnology("tools")) return false; // This event does not trigger if the monolith is already damaged.

    if (region.hasStructure("damagedMonolith")) {
      return false;
    } // This event only triggers once.


    if (TribeAttacksMonolithEvent.triggered) return false;

    if (random_1.Random.progressiveChance(0.00001, progress, 0.01)) {
      TribeAttacksMonolithEvent.triggered = true;
      return true;
    } else {
      return false;
    }
  };

  TribeAttacksMonolithEvent.progress = function (tribe, region) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Fearful) return 0;
    if (!region.hasMonolith) return 0;
    if (!tribe.hasCulture("fearsMonolith")) return 0;
    if (!tribe.hasTechnology("tools")) return 0; // This event does not trigger if the monolith is already damaged.

    if (region.hasStructure("damagedMonolith")) {
      return 0;
    } // This event only triggers once.


    if (TribeAttacksMonolithEvent.triggered) return 0;
    return 1;
  };

  TribeAttacksMonolithEvent.isChoice = function () {
    return true;
  };

  TribeAttacksMonolithEvent.choices = function (tribe) {
    return ["They will pay for this.", "I am not a threat to them."];
  };

  TribeAttacksMonolithEvent.choicePrompt = function (tribe) {
    return "A large group of people from " + tribe.title() + " have gathered around you.\n    Many of them are carrying large stone hammers, or even simply rocks. They begin to attack\n    your metal exterior with them. You are helpless to respond as they make dents in your surface.\n    Once the attack is over, you find that you are thankfully not seriously damaged.";
  };

  TribeAttacksMonolithEvent.outcomeMessages = function (tribe, region) {
    return ["Other tribes in the area seem angry at them for attacking you.", "The tribe realises that you are not here to harm them, as otherwise you would have responded to their attack.\n      They still seem afraid, but begin to wonder why you are here."];
  };

  TribeAttacksMonolithEvent.outcomeFunctions = function (tribe, region) {
    // Get list of all other non-fearful tribes in the region.
    var otherTribes = region.tribes().filter(function (v, i, a) {
      return v != tribe && v.attitudes.monolith != tribe_1.Attitudes.Monolith.Fearful;
    });
    return [function () {
      for (var _i = 0, otherTribes_1 = otherTribes; _i < otherTribes_1.length; _i++) {
        var t = otherTribes_1[_i];
        t.changeRelationship(tribe, -2);
      }

      region.addStructure("damagedMonolith");
    }, function () {
      tribe.attitudes.monolith = tribe_1.Attitudes.Monolith.Curious;
      region.addStructure("damagedMonolith");
    }];
  };

  TribeAttacksMonolithEvent.id = "TribeAttacksMonolithEvent";
  TribeAttacksMonolithEvent.triggered = false;
  return TribeAttacksMonolithEvent;
}();

var TribeRebuildsMonolithEvent =
/** @class */
function () {
  function TribeRebuildsMonolithEvent() {}

  TribeRebuildsMonolithEvent.triggers = function (tribe, region, progress) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Curious) return false;
    if (!region.hasMonolith) return false;
    if (!tribe.hasCulture("curiousOfMonolith")) return false;
    if (!tribe.hasTechnology("construction")) return false;
    if (!region.hasStructure("damagedMonolith")) return false; // This event does not trigger if the monolith is already damaged.

    if (region.hasStructure("rebuiltMonolith")) {
      return false;
    } // This event only triggers once.


    if (TribeRebuildsMonolithEvent.triggered) return false;

    if (random_1.Random.progressiveChance(0.00001, progress, 0.01)) {
      TribeRebuildsMonolithEvent.triggered = true;
      return true;
    } else {
      return false;
    }
  };

  TribeRebuildsMonolithEvent.progress = function (tribe, region) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Curious) return 0;
    if (!region.hasMonolith) return 0;
    if (!tribe.hasCulture("curiousOfMonolith")) return 0;
    if (!tribe.hasTechnology("construction")) return 0;
    if (!region.hasStructure("damagedMonolith")) return 0; // This event does not trigger if the monolith is already damaged.

    if (region.hasStructure("rebuiltMonolith")) {
      return 0;
    } // This event only triggers once.


    if (TribeRebuildsMonolithEvent.triggered) return 0;
    return 1;
  };

  TribeRebuildsMonolithEvent.isChoice = function () {
    return false;
  };

  TribeRebuildsMonolithEvent.choices = function (tribe) {
    return [];
  };

  TribeRebuildsMonolithEvent.choicePrompt = function (tribe) {
    return "";
  };

  TribeRebuildsMonolithEvent.outcomeMessages = function (tribe, region) {
    return [tribe.titleCapitalized() + " have begun bringing stone slabs and wooden planks to your\n    landing site. Before long a group of tribespeople are using stone tools to erect a shell\n    around the parts of your surface that were dented in the attack. They seem unhappy to have seen you\n    damaged."];
  };

  TribeRebuildsMonolithEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      region.addStructure("rebuiltMonolith");
    }];
  };

  TribeRebuildsMonolithEvent.id = "TribeRebuildsMonolithEvent";
  TribeRebuildsMonolithEvent.triggered = false;
  return TribeRebuildsMonolithEvent;
}();

var FirstStoriesEvent =
/** @class */
function () {
  function FirstStoriesEvent() {}

  FirstStoriesEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is unencountered.
    // Tribe does not have language.
    // Tribe does not have agriculture.
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (!tribe.hasTechnology("language")) return false;
    if (!tribe.hasTechnology("agriculture")) return false;
    if (tribe.hasCulture("stories")) return false;
    return random_1.Random.progressiveChance(0.00001, progress, 0.005);
  };

  FirstStoriesEvent.progress = function (tribe, region) {
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (!tribe.hasTechnology("language")) return 0;
    if (!tribe.hasTechnology("agriculture")) return 0;
    if (tribe.hasCulture("stories")) return 0;
    return random_1.Random.interval(0, 3);
  };

  FirstStoriesEvent.isChoice = function () {
    return false;
  };

  FirstStoriesEvent.choices = function (tribe) {
    return [];
  };

  FirstStoriesEvent.choicePrompt = function (tribe) {
    return "";
  };

  FirstStoriesEvent.outcomeMessages = function (tribe, region) {
    var othersTheme = "";

    switch (tribe.attitudes.others) {
      case tribe_1.Attitudes.Others.Aggressive:
        othersTheme = "heroes of war";
        break;

      case tribe_1.Attitudes.Others.Defensive:
        othersTheme = "defenders of their people";
        break;

      case tribe_1.Attitudes.Others.Diplomatic:
        othersTheme = "friendship with other tribes";
        break;

      case tribe_1.Attitudes.Others.Insular:
        othersTheme = "fear of other tribes";
        break;
    }

    var worldTheme = "";

    switch (tribe.attitudes.world) {
      case tribe_1.Attitudes.World.Exploit:
        worldTheme = "exploitation of their environment";
        break;

      case tribe_1.Attitudes.World.Explore:
        worldTheme = "exploration of the unknown";
        break;

      case tribe_1.Attitudes.World.Harmony:
        worldTheme = "living in harmony with nature";
        break;

      case tribe_1.Attitudes.World.Survival:
        worldTheme = "surviving in their dangerous environment";
        break;
    }

    var selfTheme = "";

    switch (tribe.attitudes.self) {
      case tribe_1.Attitudes.Self.Hierarchical:
        selfTheme = "their rightful rulers";
        break;

      case tribe_1.Attitudes.Self.Egalitarian:
        selfTheme = "their egalitarian society";
        break;
    } // We don't have to handle the unencountered attitude as we guard against that when
    // deciding if the event triggers.


    var monolithTheme = "";

    switch (tribe.attitudes.monolith) {
      case tribe_1.Attitudes.Monolith.Curious:
        monolithTheme = "their curiosity about the Great Stone";
        break;

      case tribe_1.Attitudes.Monolith.Superstitious:
        monolithTheme = "their reverance of the Great Stone";
        break;

      case tribe_1.Attitudes.Monolith.Fearful:
        monolithTheme = "their fear of the Great Stone";
        break;
    }

    return [tribe.titleCapitalized() + " has begun telling stories in the evenings once all their\n      work for the day is done. The major themes of their stories are " + othersTheme + ", " + worldTheme + ",\n      " + selfTheme + ", and " + monolithTheme + "."];
  };

  FirstStoriesEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addCulture("stories");
      console.log(tribe.title() + " has begun writing stories.");
    }];
  };

  FirstStoriesEvent.id = "FirstStoriesEvent";
  return FirstStoriesEvent;
}();

var OralHistoryEvent =
/** @class */
function () {
  function OralHistoryEvent() {}

  OralHistoryEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is unencountered.
    // Tribe does not have stories.
    // Tribe does not have > 400 population.
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (!tribe.hasCulture("stories")) return false;
    if (tribe.population() < 400) return false;
    if (tribe.hasCulture("oralHistory")) return false;
    if (tribe.hasCulture("noHistory")) return false;
    return random_1.Random.progressiveChance(0.00001, progress, 0.005);
  };

  OralHistoryEvent.progress = function (tribe, region) {
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (!tribe.hasCulture("stories")) return 0;
    if (tribe.population() < 400) return 0;
    if (tribe.hasCulture("oralHistory")) return 0;
    if (tribe.hasCulture("noHistory")) return 0;
    return random_1.Random.interval(0, 3);
  };

  OralHistoryEvent.isChoice = function () {
    return true;
  };

  OralHistoryEvent.choices = function (tribe) {
    return ["The past is not important.", "The past should be remembered."];
  };

  OralHistoryEvent.choicePrompt = function (tribe) {
    return "The simple stories of " + tribe.title() + " have evolved into more complex tales,\n    often depicting events that occurred in the tribe's past. These tales\n    form an oral history through which the tribe remembers its origins.";
  };

  OralHistoryEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe is not interested in the past, and the tales reflect this, no longer emphasising the\n      tribe's history.", "The tales become a central part of the tribe's culture, with all members gathering regularly\n      to hear about the events of the past."];
  };

  OralHistoryEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addCulture("noHistory");
      console.log(tribe.title() + " rejects oral history.");
    }, function () {
      tribe.addCulture("oralHistory");
      console.log(tribe.title() + " has begun oral history.");
    }];
  };

  OralHistoryEvent.id = "OralHistoryEvent";
  return OralHistoryEvent;
}();

var PriestClassEvent =
/** @class */
function () {
  function PriestClassEvent() {}

  PriestClassEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is unencountered.
    // Tribe has oral history (i.e. doesn't have the no-history culture).
    // Tribe is not supersitious or hierarchical.
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Superstitious) return false;
    if (!tribe.hasCulture("noHistory")) return false;
    if (!tribe.hasCulture("worshipsMonolith")) return false;
    if (tribe.hasCulture("priestsRule")) return false;
    return random_1.Random.progressiveChance(0.00001, progress, 0.005);
  };

  PriestClassEvent.progress = function (tribe, region) {
    if (tribe.attitudes.monolith != tribe_1.Attitudes.Monolith.Superstitious) return 0;
    if (!tribe.hasCulture("noHistory")) return 0;
    if (!tribe.hasCulture("worshipsMonolith")) return 0;
    if (tribe.hasCulture("priestsRule")) return 0;
    return random_1.Random.interval(0, 3);
  };

  PriestClassEvent.isChoice = function () {
    return true;
  };

  PriestClassEvent.choices = function (tribe) {
    return ["The priests do not speak for me.", "The priests are my messengers."];
  };

  PriestClassEvent.choicePrompt = function (tribe) {
    return "A priestly class has developed in " + tribe.title() + ", with a select group of priests\n    claiming to be your messengers and acting in accordance with your will. The priests use stories\n    and myths to influence the other tribespeople, who, without any understanding of their history,\n    have no reason not to believe them.";
  };

  PriestClassEvent.outcomeMessages = function (tribe, region) {
    return ["The priests convince the rest of the tribe that your displeasure is the result of some\n      wrongdoing on their part. Before long, the tribespeople are desperate for the guidance of their\n      religious leaders, who are all too happy to oblige.", "With your blessing, the priests continue their rule over the other tribespeople."];
  };

  PriestClassEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      tribe.addCulture("priestsRule");
      tribe.attitudes.self = tribe_1.Attitudes.Self.Hierarchical;
    }, function () {
      tribe.addCulture("priestsRule");
      tribe.attitudes.self = tribe_1.Attitudes.Self.Hierarchical;
    }];
  };

  PriestClassEvent.id = "PriestClassEvent";
  return PriestClassEvent;
}();

var GroupBreaksAwayFromInsularTribeEvent =
/** @class */
function () {
  function GroupBreaksAwayFromInsularTribeEvent() {}

  GroupBreaksAwayFromInsularTribeEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is not insular.
    // Tribe is explorative.
    // Tribe has not been encountered.
    // Tribe has the 'no outside contact' culture.
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.attitudes.others != tribe_1.Attitudes.Others.Insular) return false;
    if (tribe.attitudes.world == tribe_1.Attitudes.World.Explore) return false;
    if (tribe.hasCulture("noOutsideContact")) return false;
    return random_1.Random.chance(0.0005);
  };

  GroupBreaksAwayFromInsularTribeEvent.progress = function (tribe, region) {
    return 0;
  };

  GroupBreaksAwayFromInsularTribeEvent.isChoice = function () {
    return true;
  };

  GroupBreaksAwayFromInsularTribeEvent.choices = function (tribe) {
    return ["They should not be allowed to leave.", "They can explore the world if they wish."];
  };

  GroupBreaksAwayFromInsularTribeEvent.choicePrompt = function (tribe) {
    return "A small group from " + tribe.title() + " are unhappy with the tribe's insular nature,\n    and have decided they want to break away and form their own tribe. Many of the other tribe members\n    are unhappy with the group's choice, fearing that they will come to harm if they leave.";
  };

  GroupBreaksAwayFromInsularTribeEvent.outcomeMessages = function (tribe, region) {
    var newName = []; // Set name of new tribe if the old tribe has one.

    if (tribe.name().length > 0) {
      // Get descriptor for tribe.
      var roll = random_1.Random.interval(0, 4);
      var descriptor = "";

      switch (roll) {
        case 0:
          descriptor = "exile";
          break;

        case 1:
          descriptor = "fugitive";
          break;

        case 2:
          descriptor = "displaced";
          break;

        case 3:
          descriptor = "rejected";
          break;

        case 4:
          descriptor = "outcast";
          break;
      } // Build up the new name.


      var first = true;

      for (var _i = 0, _a = tribe.name(); _i < _a.length; _i++) {
        var n = _a[_i];

        if (first) {
          newName.push(new language_1.Noun(n.base, n.plural, true, n.adjectives));
        } else {
          newName.push(new language_1.Noun(n.base, n.plural, n.genitive, n.adjectives));
        }
      }

      newName = [new language_1.Noun(descriptor, true, false, [])].concat(newName);
    }

    GroupBreaksAwayFromInsularTribeEvent.newTribeName = newName;

    if (newName.length > 0) {
      return ["The small group is forced to stay against their will. Knowing that there is no way to overpower the\n        will of the others, they resign themselves to life in the tribe. The tribe avoids contact with the outside world,\n        fearing that otherwise this will happen again.", "The rest of the tribe is unhappy, but ultimately willing to let the group forge their own path.\n        The new tribe calls themselves " + language_1.Language.toTitle(tribe.language().translate(newName)) + "."];
    } else {
      return ["The small group is forced to stay against their will. Knowing that there is no way to overpower the\n        will of the others, they resign themselves to life in the tribe. The tribe avoids contact with the outside world,\n        fearing that otherwise this will happen again.", "The rest of the tribe is unhappy, but ultimately willing to let the group forge their own path."];
    }
  };

  GroupBreaksAwayFromInsularTribeEvent.outcomeFunctions = function (tribe, region) {
    var newName = GroupBreaksAwayFromInsularTribeEvent.newTribeName;
    return [function () {
      tribe.addCulture("noOutsideContact");
    }, function () {
      var newTribe = tribe.split([0.8, 0.2])[0]; // Set the new tribe's name if it has one.

      if (newName.length > 0) {
        newTribe.setName(newName);
      } // New tribe is diplomatic and explorative.


      newTribe.attitudes.others = tribe_1.Attitudes.Others.Diplomatic;
      newTribe.attitudes.world = tribe_1.Attitudes.World.Explore; // Set new tribe's migration chance.

      newTribe.setMigrationChance(0.00001); // New tribe migrates to another region.

      var otherRegions = region.nearby();
      var migrateRegion = random_1.Random.choice(otherRegions);
      migrateRegion.addTribe(newTribe);
    }];
  };

  GroupBreaksAwayFromInsularTribeEvent.id = "GroupBreaksAwayFromInsularTribeEvent";
  return GroupBreaksAwayFromInsularTribeEvent;
}();

var DiplomaticEnvoyEvent =
/** @class */
function () {
  function DiplomaticEnvoyEvent() {}

  DiplomaticEnvoyEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is not diplomatic.
    // Tribe has not been encountered.
    // Tribe doesn't have language.
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.attitudes.others != tribe_1.Attitudes.Others.Diplomatic) return false;
    if (!tribe.hasTechnology("language")) return false; // Only triggers if there is another tribe in the region with language.

    var otherTribes = region.tribes().filter(function (v, i, a) {
      return v != tribe && v.hasTechnology("language") && tribe.relationship(v) == 0;
    });
    if (otherTribes.length == 0) return false; // Select the other tribe to be the target of the envoy.

    if (random_1.Random.chance(0.0005)) {
      DiplomaticEnvoyEvent.otherTribe = random_1.Random.choice(otherTribes);
      return true;
    } else return false;
  };

  DiplomaticEnvoyEvent.progress = function (tribe, region) {
    return 0;
  };

  DiplomaticEnvoyEvent.isChoice = function () {
    return true;
  };

  DiplomaticEnvoyEvent.choices = function (tribe) {
    var other = DiplomaticEnvoyEvent.otherTribe; // If other tribe is aggressive, they attack the envoy.
    // If other tribe is defensive, increase in relationship.
    // If other tribe is diplomatic, large increase in relationship.
    // If other tribe is insular, nothing happens.

    if (other.attitudes.others == tribe_1.Attitudes.Others.Aggressive) {
      return ["The dead must be avenged.", "The aggressors should be avoided."];
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Defensive) {
      return ["They would make valuable allies.", "They should be left in peace."];
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Diplomatic) {
      return ["They would make valuable friends.", "Their kindness is appreciated."];
    } else {
      return ["How dare they reject the envoys?", "Their isolation should be respected."];
    }
  };

  DiplomaticEnvoyEvent.choicePrompt = function (tribe) {
    var other = DiplomaticEnvoyEvent.otherTribe;
    var message = tribe.titleCapitalized() + " has decided to send a small group of envoys to a nearby tribe,\n    " + other.title() + ", in the hopes of getting to know them better. A group of tribespeople leave one morning,\n    bearing gifts for their neighbours.";

    if (other.attitudes.others == tribe_1.Attitudes.Others.Aggressive) {
      message += " " + other.titleCapitalized() + " are aggressive toward the envoys. Shortly after arriving in their camp,\n      they are all brutally killed.";
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Defensive) {
      message += " " + other.titleCapitalized() + " seem suspicious of the envoys. They are allowed to enter the camp,\n      and after a short while the tribe realizes that they mean no harm. The gifts seem appreciated, and the envoys\n      return to their home.";
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Diplomatic) {
      message += " " + other.titleCapitalized() + " are welcoming of the envoys, and seem pleased to have met another tribe.\n      The gifts are greatly appreciated, and the envoys return to their home. A few days later, a group of envoys from\n      " + other.title() + " arrive at the camp of " + tribe.title() + ", bearing gifts in return.";
    } else {
      message += " " + other.titleCapitalized() + " are deeply suspicious of the envoys, refusing to allow them anywhere near\n      the camp. The envoys are disappointed, but decide it is better to leave in peace than risk provoking anyone.";
    }

    return message;
  };

  DiplomaticEnvoyEvent.outcomeMessages = function (tribe, region) {
    var other = DiplomaticEnvoyEvent.otherTribe;

    if (other.attitudes.others == tribe_1.Attitudes.Others.Aggressive) {
      return [tribe.titleCapitalized() + " are angry at the loss of their envoys, and the tribespeople swear\n        that their deaths shall be avenged.", tribe.titleCapitalized() + " are angry at the loss of their envoys, but realise that to escalate\n        the conflict would only result in further deaths."];
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Defensive) {
      return [tribe.titleCapitalized() + " are pleased to have made contact with " + other.title() + ",\n        and decide that it would be good to further improve their relations.", tribe.titleCapitalized() + " are pleased to have made contact with " + other.title() + ",\n        but decide it would be better if they were left in peace."];
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Diplomatic) {
      return [tribe.titleCapitalized() + " are pleased to have made contact with " + other.title() + ",\n        and both tribes decide that they would like to improve their relations.", tribe.titleCapitalized() + " appreciate the kindness of " + other.title() + ", and are\n        glad to know of other tribes that have the same views as them."];
    } else {
      return [tribe.titleCapitalized() + " are offended at their envoys being rejected.", tribe.titleCapitalized() + " are disappointed at their envoys being rejected, but\n        decide that it is better to leave " + other.title() + " in peace."];
    }
  };

  DiplomaticEnvoyEvent.outcomeFunctions = function (tribe, region) {
    var other = DiplomaticEnvoyEvent.otherTribe;

    if (other.attitudes.others == tribe_1.Attitudes.Others.Aggressive) {
      return [function () {
        tribe.changeRelationship(other, -2);
        other.changeRelationship(tribe, -2);
      }, function () {
        tribe.changeRelationship(other, -1);
        other.changeRelationship(tribe, -1);
      }];
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Defensive) {
      return [function () {
        tribe.changeRelationship(other, 2);
        other.changeRelationship(tribe, 2);
      }, function () {
        tribe.changeRelationship(other, 1);
        other.changeRelationship(tribe, 1);
      }];
    } else if (other.attitudes.others == tribe_1.Attitudes.Others.Diplomatic) {
      return [function () {
        tribe.changeRelationship(other, 3);
        other.changeRelationship(tribe, 3);
      }, function () {
        tribe.changeRelationship(other, 2);
        other.changeRelationship(tribe, 2);
      }];
    } else {
      return [function () {
        tribe.changeRelationship(other, -2);
        other.changeRelationship(tribe, -2);
      }, function () {
        tribe.changeRelationship(other, -1);
        other.changeRelationship(tribe, -1);
      }];
    }
  };

  DiplomaticEnvoyEvent.id = "DiplomaticEnvoyEvent";
  return DiplomaticEnvoyEvent;
}();

var TribeCelebratesMonolithEvent =
/** @class */
function () {
  function TribeCelebratesMonolithEvent() {}

  TribeCelebratesMonolithEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is not in same region as the monolith
    // Tribe does not have the 'celebrates monolith' culture
    // Tribe does not have language
    // There is no temple.
    if (!region.hasMonolith) return false;
    if (!tribe.hasCulture("celebratesMonolith")) return false;
    if (!tribe.hasTechnology("language")) return false;
    if (!region.hasStructure("monolithTemple")) return false; // Triggers semi-regularly.

    if (progress > 400) {
      return random_1.Random.chance(0.05);
    } else return false;
  };

  TribeCelebratesMonolithEvent.progress = function (tribe, region) {
    // Does not trigger if:
    // Tribe is not in same region as the monolith
    // Tribe does not have the 'celebrates monolith' culture
    // Tribe does not have language
    // There is no temple.
    if (!region.hasMonolith) return 0;
    if (!tribe.hasCulture("celebratesMonolith")) return 0;
    if (!tribe.hasTechnology("language")) return 0;
    if (!region.hasStructure("monolithTemple")) return 0;
    return 1;
  };

  TribeCelebratesMonolithEvent.isChoice = function () {
    return true;
  };

  TribeCelebratesMonolithEvent.choices = function (tribe) {
    if (tribe.hasCulture("humanSacrifice")) {
      return ["This is horrible.", "This is a worthy sacrifice."];
    } else {
      return ["Their songs and offerings please me.", "Their songs and offerings are not enough."];
    }
  };

  TribeCelebratesMonolithEvent.choicePrompt = function (tribe) {
    if (tribe.hasCulture("humanSacrifice")) {
      if (tribe.hasCulture("templeBuilders")) {
        return tribe.titleCapitalized() + " have gathered at the temple they built in your name.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.\n        After the songs are complete, two of the tribe's priests bring a young man to you.\n        \"We offer this sacrifice in the hope that it pleases you, great stone,\" they say, as they slit the man's throat.";
      } else {
        return tribe.titleCapitalized() + " has made a pilgramage to your temple.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.\n        After the songs are complete, two of the tribe's priests bring a young man to you.\n        \"We offer this sacrifice in the hope that it pleases you, great stone,\" they say, as they slit the man's throat.";
      }
    } else {
      if (tribe.hasCulture("templeBuilders")) {
        return tribe.titleCapitalized() + " have gathered at the temple they built in your name.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.";
      } else {
        return tribe.titleCapitalized() + " has made a pilgramage to your temple.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.";
      }
    }
  };

  TribeCelebratesMonolithEvent.outcomeMessages = function (tribe, region) {
    if (tribe.hasCulture("humanSacrifice")) {
      return ["The tribe is confused as to what they must do to please you.", "The tribe is glad that this sacrifice pleases you."];
    } else {
      return ["The tribe is glad to have earned your favour.", "The tribe is scared that they have displeased you.\n        As they leave the temple, their priests discuss what must be done to earn\n        your favour."];
    }
  };

  TribeCelebratesMonolithEvent.outcomeFunctions = function (tribe, region) {
    if (tribe.hasCulture("humanSacrifice")) {
      return [function () {
        tribe.decreasePopulation(1);
        if (random_1.Random.chance(0.2)) tribe.removeCulture("humanSacrifice");
      }, function () {
        tribe.decreasePopulation(1);
      }];
    } else {
      return [function () {}, function () {
        tribe.addCulture("humanSacrifice");
      }];
    }
  };

  TribeCelebratesMonolithEvent.id = "TribeCelebratesMonolithEvent";
  return TribeCelebratesMonolithEvent;
}();

var WarlordsTakePowerEvent =
/** @class */
function () {
  function WarlordsTakePowerEvent() {}

  WarlordsTakePowerEvent.triggers = function (tribe, region, progress) {
    // Does not trigger if:
    // Tribe is not aggressive
    // Tribe is not hierarchical
    // Tribe has < 150 population
    // Tribe has not been encountered
    if (tribe.attitudes.others != tribe_1.Attitudes.Others.Aggressive) return false;
    if (tribe.attitudes.self != tribe_1.Attitudes.Self.Hierarchical) return false;
    if (tribe.population() < 150) return false;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return false;
    if (tribe.hasCulture("warlordsRule")) return false;
    return random_1.Random.progressiveChance(0.00001, progress, 0.005);
  };

  WarlordsTakePowerEvent.progress = function (tribe, region) {
    // Does not trigger if:
    // Tribe is not aggressive
    // Tribe is not hierarchical
    // Tribe has < 150 population
    // Tribe has not been encountered
    if (tribe.attitudes.others != tribe_1.Attitudes.Others.Aggressive) return 0;
    if (tribe.attitudes.self != tribe_1.Attitudes.Self.Hierarchical) return 0;
    if (tribe.population() < 150) return 0;
    if (tribe.attitudes.monolith == tribe_1.Attitudes.Monolith.Unencountered) return 0;
    if (tribe.hasCulture("warlordsRule")) return 0;
    return 1;
  };

  WarlordsTakePowerEvent.isChoice = function () {
    return true;
  };

  WarlordsTakePowerEvent.choices = function (tribe) {
    return ["The warlords have no right to rule.", "The warlords are the rightful rulers."];
  };

  WarlordsTakePowerEvent.choicePrompt = function (tribe) {
    return "A small group of warlords from " + tribe.title() + " have decided that they are the tribe's\n    rightful rulers. They have proven themselves on the battlefield and feel that they are most capable of\n    leading the tribe.";
  };

  WarlordsTakePowerEvent.outcomeMessages = function (tribe, region) {
    return ["The tribe attempts to force the warlords out of their settlement, but they refuse, preferring to fight.\n      In the ensuing battle, a number of tribespeople are killed, as are all of the warlords.", "The warlords take their place as the rightful rulers of the tribe."];
  };

  WarlordsTakePowerEvent.outcomeFunctions = function (tribe, region) {
    return [function () {
      var upperLimit = Math.floor(tribe.population() * 0.3);
      var lowerLimit = Math.floor(tribe.population() * 0.1);
      tribe.decreasePopulation(random_1.Random.interval(lowerLimit, upperLimit));
      tribe.attitudes.self = tribe_1.Attitudes.Self.Egalitarian;
    }, function () {
      tribe.addCulture("warlordsRule");
    }];
  };

  WarlordsTakePowerEvent.id = "WarlordsTakePowerEvent";
  return WarlordsTakePowerEvent;
}();

exports.TribeEvents = [TribeDestroyedEvent, EncounterEvent, IndirectEncounterEvent, TribeWorshipsMonolithEvent, TribeCuriousOfMonolithEvent, TribeFearsMonolithEvent, TribeBuildsTempleEvent, TribeAsksMonolithPurposeEvent, TribeAttacksMonolithEvent, TribeRebuildsMonolithEvent, GroupBreaksAwayFromInsularTribeEvent, TribeCelebratesMonolithEvent, DiplomaticEnvoyEvent, FirstStoriesEvent, OralHistoryEvent, PriestClassEvent, WarlordsTakePowerEvent, AttackEvent, MigrationEvent, disasters.FireSpreadsEvent, disasters.DroughtEvent, disasters.PlagueEvent, discovery.DiscoverFireEvent, discovery.DiscoverToolsEvent, discovery.DiscoverConstructionEvent, discovery.DiscoverLanguageEvent, discovery.DiscoverAgricultureEvent];
},{"./tribe":"tribe.ts","./random":"random.ts","./language":"language.ts","./tribe_events_disasters":"tribe_events_disasters.ts","./tribe_events_discovery":"tribe_events_discovery.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","tribe_events.ts"], null)
//# sourceMappingURL=/tribe_events.7130d346.js.map