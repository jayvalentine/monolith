parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"s9Dg":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(){}return e.triggers=function(t){return!e.done&&(!!t.hasMonolith&&(e.done=!0,!0))},e.outcomeMessage=function(e){return"Your temperature sensors flail wildly as you scream through the planet's atmosphere,\n    blazing a trail through the sky. You slam into the ground with an earth-shattering thud, coming to rest\n    in a "+e.typeDescription()+" region."},e.outcomeFunction=function(e){return function(){console.log("Landing event triggered in "+e.typeDescription()+" region.")}},e.done=!1,e}();exports.RegionEvents=[e];
},{}]},{},["s9Dg"], null)
//# sourceMappingURL=region_events.064ecc06.js.map