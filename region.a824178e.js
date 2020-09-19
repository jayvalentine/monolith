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
},{}],"region.ts":[function(require,module,exports) {
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","region.ts"], null)
//# sourceMappingURL=/region.a824178e.js.map