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
},{"./random":"random.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39627" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","language.ts"], null)
//# sourceMappingURL=/language.f4e6d0fb.js.map