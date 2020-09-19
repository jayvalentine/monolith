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
},{"./random":"random.ts","./tribe":"tribe.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38323" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","tribe_events_disasters.ts"], null)
//# sourceMappingURL=/tribe_events_disasters.5885d7dd.js.map