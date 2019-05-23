/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/js/Pubsub/SubscriberList.js":
/*!************************************************!*\
  !*** ./client/src/js/Pubsub/SubscriberList.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_uid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/uid.js */ \"./client/src/js/utils/uid.js\");\n// NOTE: This class is used internally in pubsub and shouldn't be accessed directly\n\n\n\n// We are adding the ability to do prioritization\n// might make this TRUELY UNIVERSAAAAL\nlet _Uid = -1;\nconst newToken = () => {\n  return _utils_uid_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].nextId();\n};\n\n// A specific levels subscribers will always fire first, unless interrupted by a publishSync\n// which allows for interrupts / extensions into other systems that can finish first\n// even if needing to cross systems\n// priorityFn\n// (a,b)\n// <0 a comes before b\n// 0 a and b are equal\n// >0 a comes after b\nconst makeLink = (fn, priority, next = null) => {\n  return { id: newToken(), fn, priority, next };\n};\n\nclass SubscriberList {\n  constructor(disabled = false) {\n    this.root = null;\n    this.tail = null;\n    this.length = 0;\n    this.disabled = disabled;\n  }\n  disable() {\n    this.disabled = true;\n    return this;\n  }\n  enable() {\n    this.disabled = false;\n    return this;\n  }\n  // For now we just add priorities by number\n  // lower priority runs first\n  subscribe(fn, priority = 0) {\n    if (typeof fn !== \"function\") {\n      throw new Error(\"\");\n    }\n    // Case #1 Empty Subscriber List\n    if (this.length === 0) {\n      this.root = makeLink(fn, priority);\n      this.tail = this.root;\n      this.length++;\n      return this.root.id;\n    }\n    // Case #2 We already have some subscribers\n    // If subscribers have the same priority, it's first come first serve\n    else {\n        // let's check if we need to be first\n\n        let traveller = this.root;\n\n        // SPECIAL CASE, priority is lower than root\n        if (priority < traveller.priority) {\n          this.root = makeLink(fn, priority, this.root);\n          this.length++;\n          return this.root.id;\n        }\n\n        while (traveller && traveller.next && traveller.next.priority <= priority) {\n          traveller = traveller.next;\n        }\n\n        traveller.next = makeLink(fn, priority, traveller.next);\n        // move the tail if we are at the end\n        if (traveller === this.tail) {\n          this.tail = traveller.next;\n        }\n\n        this.length++;\n        return traveller.next.id;\n      }\n  }\n\n  subscribeOnce(fn, priority = 0) {\n    let id = this.subscribe((topic, message) => {\n      fn(topic, message);\n      this.unsubscribe(id);\n    }, priority);\n    return id;\n  }\n\n  unsubscribe(id) {\n    if (this.length === 0) {\n      return false;\n    }\n\n    // Case #1: We are removing the first element\n    if (this.root.id === id) {\n      this.root = this.root.next;\n      this.length--;\n      if (this.length <= 1) {\n        this.tail = this.root;\n      }\n      return true;\n    }\n\n    // Case #2, we are moving a subsequent element\n\n    // keep travelling until we hit an end condition\n    let traveller = this.root;\n    while (traveller && traveller.next && traveller.next.id !== id) {\n      traveller = traveller.next;\n    }\n\n    // Condition #1: We hit the end of the list\n    if (!traveller.next) {\n      return false;\n    }\n    // Condition #2 We found our item somewhere in the list\n    else {\n        // Condition #2a, we are removing the tail, make sure to update the tail\n        if (traveller.next === this.tail) {\n          this.tail = traveller;\n        }\n        // traveller.next is replace with the following entry\n        traveller.next = traveller.next.next;\n        this.length--;\n        return true;\n      }\n  }\n\n  notify(message, topic) {\n    if (this.disabled) {\n      return;\n    }\n    let traveller = this.root;\n    while (traveller != null) {\n      traveller.fn(message, topic); // potentially allow early cutoffs?\n      traveller = traveller.next;\n    }\n  }\n\n  // Don't know if this clears memory right, but I hope so\n  clear() {\n    this.root = null;\n    this.tail = null;\n    this.length = 0;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SubscriberList);\n\n//# sourceURL=webpack:///./client/src/js/Pubsub/SubscriberList.js?");

/***/ }),

/***/ "./client/src/js/Pubsub/pubsub.js":
/*!****************************************!*\
  !*** ./client/src/js/Pubsub/pubsub.js ***!
  \****************************************/
/*! exports provided: PubSub, PUBSUB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PubSub\", function() { return PubSub; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PUBSUB\", function() { return PUBSUB; });\n/* harmony import */ var _SubscriberList_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SubscriberList.js */ \"./client/src/js/Pubsub/SubscriberList.js\");\n// Inspired by https://github.com/mroderick/PubSubJS/blob/master/src/pubsub.js\n// you should use this one instead, I'm adapting their design for my own education\n\nclass PubSub {\n  constructor() {\n    this.topics = {};\n  }\n  publish(topic, message) {\n    // we will keep doing this synchronously until we can't anymore :P\n    // TODO: Add subtopics and specialized subscriptions\n    if (this.topics[topic]) {\n      this.topics[topic].notify(message, topic); // we flip this so that the handling is easier, for instance if we don't care about the topic\n    }\n  }\n  subscribe(topic, fn, priority = 0) {\n    // check if it exists already\n    if (!this.topics[topic]) {\n      // if this doesn't already exist\n      this.topics[topic] = new _SubscriberList_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    }\n    this.topics[topic].subscribe(fn, priority);\n  }\n  getSubscriberList(topic) {\n    if (!this.topics[topic]) {\n      // if this doesn't already exist\n      this.topics[topic] = new _SubscriberList_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    }\n    return this.topics[topic];\n  }\n  subscribeOnce(topic, fn) {\n    if (!this.topics[topic]) {\n      // if this doesn't already exist\n      this.topics[topic] = new _SubscriberList_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    }\n    this.topics[topic].subscribeOnce(topic, fn, priority);\n  }\n  unsubscribe(topic, id) {\n    // Currently no error\n    if (this.topics[topic]) {\n      this.topics[topic].unsubscribe(id);\n    }\n  }\n  clearSubscriptions(topic) {\n    if (this.topics[topic]) {\n      this.topics[topic].clear();\n    }\n  }\n}\n\nconst PUBSUB = new PubSub();\n\n//# sourceURL=webpack:///./client/src/js/Pubsub/pubsub.js?");

/***/ }),

/***/ "./client/src/js/Pubsub/topics.js":
/*!****************************************!*\
  !*** ./client/src/js/Pubsub/topics.js ***!
  \****************************************/
/*! exports provided: TOPICS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TOPICS\", function() { return TOPICS; });\nconst TOPICS = {\n  NEW_LEVEL: \"NEW_LEVEL\",\n  RERENDER: \"RERENDER\",\n  MOVE: \"MOVE\"\n};\n\n//# sourceURL=webpack:///./client/src/js/Pubsub/topics.js?");

/***/ }),

/***/ "./client/src/js/Shapes/Grid.js":
/*!**************************************!*\
  !*** ./client/src/js/Shapes/Grid.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// grids have no inherent positioning, they\n// are just a way to make 2d collections\n// doesn't support resizing by default\nconst _isBetween = (a, b, value) => {\n  // handle it no matter the direction\n  if (b < a) {\n    return isBetween(b, a, value);\n  }\n  return a <= value && value <= b;\n};\n\n// by default we fill this up with empty objects\nconst make = (width, height) => {\n  const grid = {\n    width,\n    height,\n    cells: [],\n    // this is not a safe function, is assumes you\n    // know what you are doing\n    getXY: function (x, y) {\n      if (inBoundsXY(this, x, y)) {\n        return this.cells[y * this.width + x];\n      } else {\n        return null;\n      }\n    },\n    // convenience function\n    getP: function (p) {\n      return this.getXY(p.x, p.y);\n    },\n    getIndex: function (i) {\n      return this.cells[i];\n    }\n    // we don't offer a setXY on purpose, you\n    // should be manipulating an individual cell\n    // this is not a \"sparse grid\"\n  };\n  grid.cells.length = width * height;\n  return grid;\n};\n\nconst SET_EACH_ERROR = `\nsetEach require a function as the second argument\nthe callback looks like function(x,y,i){}\nwhere x is the column, y is the row, and i is the index\n`.trim();\n\n// TODO, extend xy to map and forEach\nconst setEach = (grid, fn) => {\n  // a little bit of defensive programming\n  if (typeof fn != \"function\") {\n    throw new Error(SET_EACH_ERROR);\n  }\n  let x = 0;\n  let y = 0;\n  for (let i = 0; i < grid.cells.length; i++) {\n    x = i % grid.width;\n    y = (i - x) / grid.width;\n    grid.cells[i] = fn(x, y, i);\n  }\n  return grid;\n};\n\nconst forEach = (grid, fn) => {\n  for (let i = 0; i < grid.cells.length; i++) {\n    const x = i % grid.width;\n    const y = (i - x) / grid.width;\n    fn(grid.cells[i], x, y, i);\n  }\n};\n\nconst inBoundsXY = (grid, x, y) => {\n  return _isBetween(0, grid.width - 1, x) && _isBetween(0, grid.height - 1, y);\n};\n// axis aligned neighbors only, doesn't include diagonals\nconst getAxisAlignedNeighborsXY = (grid, x, y) => {\n  if (!inBoundsXY(grid, x, y)) {\n    return []; // return an empty array if no neighbors\n  } else {\n    const neighbors = [grid.getXY(x - 1, y), // LEFT\n    grid.getXY(x, y - 1), // TOP\n    grid.getXY(x + 1, y), // RIGHT\n    grid.getXY(x, y + 1) // BOTTOM\n    ];\n    // FILTER OUT ANY THAT DON'T EXIST\n    return neighbors.filter(n => n != undefined);\n  }\n};\nconst makeAxisAlignedGridTraverser = grid => {\n  return {\n    x: 0,\n    y: 0,\n    getCell: function () {\n      return grid.getXY(x, y);\n    },\n    getNeighbors: function () {\n      return getAxisAlignedNeighborsXY(this.x, this.y);\n    },\n    inBoundsXY: function (x, y) {\n      return Grid.inBoundsXY(grid, x, y);\n    },\n    getRelative: function (x, y) {\n      return grid.getXY(this.x + x, this.y + y);\n    },\n    move: function (x, y) {\n      this.x = x;\n      this.y = y;\n    },\n    moveRelative: function (x, y) {\n      this.x += x;\n      this.y += y;\n    }\n  };\n};\n\nconst print = (grid, transformFn, spacing = 1, verticalSpacing = 0) => {\n  let total = \"\";\n  let hzSpacing = \"\";\n  let vtSpacing = \"\";\n  for (let i = 0; i < spacing; i++) {\n    hzSpacing += \" \";\n  }\n  for (let i = 0; i < verticalSpacing; i++) {\n    vtSpacing += \"\\n\";\n  }\n  grid.cells.forEach((cell, index) => {\n    if (index % grid.width === 0 && index != 0) {\n      total = total.trim();\n      total += \"\\n\" + vtSpacing;\n    }\n    total += transformFn(cell, index) + hzSpacing;\n  });\n  return total;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  make,\n  print,\n  inBoundsXY,\n  forEach,\n  setEach,\n  getAxisAlignedNeighborsXY,\n  makeAxisAlignedGridTraverser\n});\n\n//# sourceURL=webpack:///./client/src/js/Shapes/Grid.js?");

/***/ }),

/***/ "./client/src/js/Shapes/Point.js":
/*!***************************************!*\
  !*** ./client/src/js/Shapes/Point.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst make = (x, y) => {\n  return { x, y };\n};\nconst set = (p, x, y) => {\n  p.x = x;\n  p.y = y;\n  return p;\n};\nconst offset = (p, x, y) => {\n  p.x += x;\n  p.y += y;\n  return p;\n};\nconst copy = p => {\n  return make(p.x, p.y);\n};\nconst copyTo = (p, p2) => {\n  p.x = p2.x;\n  p.y = p2.y;\n  return p;\n};\n\nconst add = (a, b) => {\n  return make(a.x + b.x, a.y + b.y);\n};\n\nconst addTo = (a, b) => {\n  a.x += b.x;\n  a.y += b.y;\n  return a;\n};\n\nconst scale = (p, size) => {\n  return make(p.x * size, p.y * size);\n};\nconst scaleTo = (p, size) => {\n  p.x *= size;\n  p.y *= size;\n  return p;\n};\n\nconst equal = (p1, p2) => {\n  return p1.x === p2.x && p1.y === p2.y;\n};\n\nconst ZERO = Object.freeze(make(0, 0));\n// TODO: add frozen directions\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  make,\n  set,\n  offset,\n  copy,\n  copyTo,\n  add,\n  addTo,\n  scale,\n  scaleTo,\n  equal\n});\n\n//# sourceURL=webpack:///./client/src/js/Shapes/Point.js?");

/***/ }),

/***/ "./client/src/js/Shapes/Rectangle.js":
/*!*******************************************!*\
  !*** ./client/src/js/Shapes/Rectangle.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst make = (x, y, width, height) => {\n  return { x, y, width, height };\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  make\n});\n\n//# sourceURL=webpack:///./client/src/js/Shapes/Rectangle.js?");

/***/ }),

/***/ "./client/src/js/Shapes/index.js":
/*!***************************************!*\
  !*** ./client/src/js/Shapes/index.js ***!
  \***************************************/
/*! exports provided: Point, Rectangle, Grid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Point */ \"./client/src/js/Shapes/Point.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Point\", function() { return _Point__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _Rectangle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Rectangle */ \"./client/src/js/Shapes/Rectangle.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Rectangle\", function() { return _Rectangle__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Grid */ \"./client/src/js/Shapes/Grid.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Grid\", function() { return _Grid__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n\n\n\n\n//# sourceURL=webpack:///./client/src/js/Shapes/index.js?");

/***/ }),

/***/ "./client/src/js/Systems/FovSystem.js":
/*!********************************************!*\
  !*** ./client/src/js/Systems/FovSystem.js ***!
  \********************************************/
/*! exports provided: FovSystem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FovSystem\", function() { return FovSystem; });\n/* harmony import */ var _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Pubsub/pubsub.js */ \"./client/src/js/Pubsub/pubsub.js\");\n/* harmony import */ var _Shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shapes */ \"./client/src/js/Shapes/index.js\");\n\n// so let's think about the grid\n//  . . . . . . .\n//  . . . . . . .\n//  . . . . . . .\n//  . . . @ . . .\n//  . . . . . . .\n//  . . . . . . .\n//  . . . . . . .\n\n\n// divide things right into octants\n//  9 8 7 6 . . .\n//  . 5 4 3 . . .\n//  . . 2 1 . . .   NNW\n//  . . . @ . . .\n//  . . . . . . .\n//  . . . . . . .\n//  . . . . . . .\n\n/*\n* Find a shadow and try to overtake it\n*/\n\n\n\nconst isBetweenInclusive = (a, b, t) => {\n  if (b < a) {\n    let temp = b;\n    b = a;\n    a = temp;\n  }\n  return t >= a && t <= b;\n};\n\nconst calculateOctant = (map, fovGrid, target, rowCount, horizontalNotVertical, xDirection, yDirection) => {\n  const shadowRanges = [];\n  for (let row = 1; row < rowCount; row++) {\n    const rowSize = row + 1;\n    for (let column = 0; column < rowSize; column++) {\n      const point = { x: target.x, y: target.y };\n      point.x += horizontalNotVertical ? xDirection * column : xDirection * row;\n      point.y += horizontalNotVertical ? yDirection * row : yDirection * column;\n\n      // bounds check and skip\n      if (!isBetweenInclusive(0, map.width - 1, point.x) || !isBetweenInclusive(0, map.height - 1, point.y)) {\n        continue;\n      }\n\n      const mapCell = map.getP(point);\n      const fovCell = fovGrid.getP(point);\n\n      const start = column / rowSize;\n      const end = (column + 1) / rowSize;\n      const middle = (start + end) / 2;\n\n      // test for visibility\n      let visibility = true;\n      let startClear = true;\n      let middleClear = true;\n      let endClear = true;\n\n      if (shadowRanges.length !== 0) {\n        // check for a shadow to invalidate us\n        // TODO, optimize and break off early if we are invalid\n        shadowRanges.forEach(sr => {\n          startClear = startClear && !isBetweenInclusive(sr.start, sr.end, start);\n          middleClear = middleClear && !isBetweenInclusive(sr.start, sr.end, middle);\n          endClear = endClear && !isBetweenInclusive(sr.start, sr.end, end);\n        });\n        if (mapCell.wall) {\n          visibility = startClear || endClear;\n        } else {\n          visibility = middleClear && (startClear || endClear);\n        }\n      }\n      // Mark our ranges invalid if we are a wall\n      if (mapCell.wall) {\n        // try and condense it more in the future\n        shadowRanges.push({ start, end });\n      }\n      //console.log(\"SHADOW RANGES\", shadowRanges);\n      //console.log(fovCell);\n      fovCell.visible = visibility;\n\n      // ancillary extra piece, since we are already visiting this section\n      if (fovCell.visible) {\n        mapCell.explored = true;\n      }\n    }\n  }\n};\n// TODO, update this, see if we can simplify or make any of this better\nconst FovSystem = {\n  calculateFov: ({ geometryData, fovData }, origin) => {\n    const map = geometryData.grid;\n    const fovGrid = fovData.grid;\n    const target = origin;\n    // NNW\n    calculateOctant(map, fovGrid, target, target.y + 1, true, -1, -1);\n    // WNW\n    calculateOctant(map, fovGrid, target, target.x + 1, false, -1, -1);\n    // WSW\n    calculateOctant(map, fovGrid, target, target.x + 1, false, -1, 1);\n    // SSW\n    calculateOctant(map, fovGrid, target, map.height - target.y + 1, true, -1, 1);\n    // SSE\n    calculateOctant(map, fovGrid, target, map.height - target.y + 1, true, 1, 1);\n    // ESE\n    calculateOctant(map, fovGrid, target, map.width - target.x + 1, false, 1, 1);\n    // ENE\n    calculateOctant(map, fovGrid, target, map.width - target.x + 1, false, 1, -1);\n    // NNE\n    calculateOctant(map, fovGrid, target, target.y + 1, true, 1, -1);\n    fovGrid.getP(target).visible = true;\n    map.getP(target).explored = true;\n  }\n};\n\n// Should write a test for this\n\n//# sourceURL=webpack:///./client/src/js/Systems/FovSystem.js?");

/***/ }),

/***/ "./client/src/js/Systems/MoveSystem.js":
/*!*********************************************!*\
  !*** ./client/src/js/Systems/MoveSystem.js ***!
  \*********************************************/
/*! exports provided: MoveSystem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MoveSystem\", function() { return MoveSystem; });\n/* harmony import */ var _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Pubsub/pubsub.js */ \"./client/src/js/Pubsub/pubsub.js\");\n/* harmony import */ var _Shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shapes */ \"./client/src/js/Shapes/index.js\");\n\n\n\nconst MoveSystem = {\n  processAction: ({ geometryData, actorData }, moveAction) => {\n    const mover = actorData.getActorById(moveAction.actorId);\n    // currently don't allow movement into walls or out of bounds\n    if (mover) {\n      // Check if we can move there\n      if (!_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].inBoundsXY(geometryData.grid, moveAction.destination.x, moveAction.destination.y)) {\n        console.log(\"cannot move out of bounds\");\n      } else if (geometryData.grid.getP(moveAction.destination).wall === true) {\n        console.log(\"cannot move into a wall\");\n      } else {\n        _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].copyTo(mover.position, moveAction.destination);\n      }\n    }\n    // currently allows us to move, no problem, we should prevent this from happening if we can't\n  }\n};\n\n//# sourceURL=webpack:///./client/src/js/Systems/MoveSystem.js?");

/***/ }),

/***/ "./client/src/js/Systems/RenderSystem.js":
/*!***********************************************!*\
  !*** ./client/src/js/Systems/RenderSystem.js ***!
  \***********************************************/
/*! exports provided: RenderSystem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RenderSystem\", function() { return RenderSystem; });\n/* harmony import */ var _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Pubsub/pubsub.js */ \"./client/src/js/Pubsub/pubsub.js\");\n/* harmony import */ var _Shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Shapes */ \"./client/src/js/Shapes/index.js\");\n/* harmony import */ var _colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../colors */ \"./client/src/js/colors.js\");\n\n\n\n\nconst makeColorSet = (cellHex, textHex, darkenAmount) => {\n  const cell = _colors__WEBPACK_IMPORTED_MODULE_2__[\"default\"].makeColorFromHexStr(cellHex);\n  const text = _colors__WEBPACK_IMPORTED_MODULE_2__[\"default\"].makeColorFromHexStr(textHex);\n  return {\n    CELL_DEFAULT: cell,\n    TEXT_DEFAULT: text,\n    CELL_DARK: _colors__WEBPACK_IMPORTED_MODULE_2__[\"default\"].darken(cell, darkenAmount),\n    TEXT_DARK: _colors__WEBPACK_IMPORTED_MODULE_2__[\"default\"].darken(text, darkenAmount)\n  };\n};\nconst COLORS = {\n  WALL: makeColorSet(\"#888\", \"#222\", 20),\n  FLOOR: makeColorSet(\"#4A6776\", \"#eee\", 20),\n  UNKNOWN: makeColorSet(\"#333\", \"#222\", 0)\n\n  // NEED TO DARKEN OR LIGHTEN THE COLOR\n\n};const RenderSystem = {\n  render: ({ geometryData, actorData, renderData, fovData }) => {\n    // Little bit extra here, but hey\n    const geoGrid = geometryData.grid;\n    const rendGrid = renderData.grid;\n    const fovGrid = fovData.grid;\n\n    // Draw all the geometry stuff\n    _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].forEach(geoGrid, (geoCell, x, y, index) => {\n      const renderCell = rendGrid.getIndex(index);\n      const fovCell = fovGrid.getIndex(index);\n      if (geoCell.explored) {\n        renderCell.character = geoCell.wall ? 'X' : '.';\n        const colorSet = geoCell.wall ? COLORS.WALL : COLORS.FLOOR;\n        if (fovCell.visible) {\n          renderCell.textColor = colorSet.TEXT_DEFAULT;\n          renderCell.cellColor = colorSet.CELL_DEFAULT;\n        } else {\n          renderCell.character = geoCell.wall ? 'X' : '.';\n          renderCell.textColor = colorSet.TEXT_DARK;\n          renderCell.cellColor = colorSet.CELL_DARK;\n        }\n      } else {\n        renderCell.character = '?';\n        renderCell.textColor = COLORS.UNKNOWN.TEXT_DEFAULT;\n        renderCell.cellColor = COLORS.UNKNOWN.CELL_DEFAULT;\n      }\n    });\n\n    // Override the specific pieces with monsters\n    actorData.actors.forEach(actor => {\n      // cameras are going to make this troublesome\n      const renderCell = rendGrid.getP(actor.position);\n      renderCell.character = actor.character;\n    });\n\n    // This is an extra debug helpful step, eventually we'll provide more data for the UI system to use\n  }\n};\n\n//# sourceURL=webpack:///./client/src/js/Systems/RenderSystem.js?");

/***/ }),

/***/ "./client/src/js/app.js":
/*!******************************!*\
  !*** ./client/src/js/app.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pubsub/pubsub.js */ \"./client/src/js/Pubsub/pubsub.js\");\n/* harmony import */ var _Shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Shapes */ \"./client/src/js/Shapes/index.js\");\n/* harmony import */ var _Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Pubsub/topics.js */ \"./client/src/js/Pubsub/topics.js\");\n/* harmony import */ var _Systems_RenderSystem_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Systems/RenderSystem.js */ \"./client/src/js/Systems/RenderSystem.js\");\n/* harmony import */ var _Systems_MoveSystem_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Systems/MoveSystem.js */ \"./client/src/js/Systems/MoveSystem.js\");\n/* harmony import */ var _Systems_FovSystem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Systems/FovSystem.js */ \"./client/src/js/Systems/FovSystem.js\");\n/* harmony import */ var _colors_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./colors.js */ \"./client/src/js/colors.js\");\n\n\n\n\n\n\n\n\nconst player = {\n  id: 1,\n  character: \"@\",\n  position: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(1, 1)\n};\nconst ActorData = {\n  actors: [player],\n  getActorById: function (id) {\n    return this.actors.find(actor => actor.id === id);\n  } // TODO: Eventually we'll add a reference for this\n};\nconst GeometryData = {};\nconst FovData = {};\nconst PathfindingData = {}; // Potential overlap I guess? If we could memoize this that'd be awesome I guess?\nconst RenderData = {};\nconst UIData = {};\n\nconst Actions = [];\n\n// Saver and Loader\n// All arrow functions, no state for any system\n\nconst SETTINGS = {\n  GRID_WIDTH: 11,\n  GRID_HEIGHT: 5\n};\n\nconst linearize = str => str.split('\\n').map(s => s.trim()).join('').trim();\nwindow.linearize = linearize;\nconst levelString = linearize(`\n  .....X.....\n  ...........\n  ...XXXXX...\n  .....X.....\n  .....X.....\n`);\n\n// Let's prototype out a system and then move it into the appropriate data\nGeometryData.grid = _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);\nRenderData.grid = _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);\nFovData.grid = _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);\n\n_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].setEach(FovData.grid, (x, y) => {\n  return {\n    x, y, visible: false\n  };\n});\n\n_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].setEach(RenderData.grid, (x, y) => {\n  return {\n    x, y,\n    character: '.',\n    textColor: _colors_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].makeColorFromHexStr(\"#eee\"),\n    cellColor: _colors_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].makeColorFromHexStr(\"#4A6776\")\n  };\n});\n\nconst GeometrySystem = {\n  save: () => {},\n  load: () => {},\n  simpleStringLoader: ({ geometry }, str) => {\n    _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].setEach(geometry.grid, (x, y, index) => {\n      return { x, y, wall: str[index] === \"X\", explored: false };\n    });\n  },\n  generate: () => {}\n};\n\nconst UISystem = {\n  displayRenderGrid: ({ renderData }) => {\n    const makeCell = cell => {\n      return (cell.x === 0 && cell.y !== 0 ? \"<br>\" : \"\") + `<div x=\"${cell.x}\" y=\"${cell.y}\" class=\"cell\" style=\"color:${_colors_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].toHexStr(cell.textColor)}; background:${_colors_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].toHexStr(cell.cellColor)}\">${cell.character}</div>`;\n    };\n    // Let's go ahead and put it on the screen\n    document.getElementById(\"display\").innerHTML = renderData.grid.cells.map(makeCell).join('');\n    console.log(_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].print(renderData.grid, cell => cell.character));\n  }\n};\n\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].subscribe(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].NEW_LEVEL, ({ levelString }) => {\n  GeometrySystem.simpleStringLoader({ geometry: GeometryData }, levelString);\n  _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].RERENDER, null);\n});\n\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].subscribe(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].RERENDER, () => {\n  // Eventually we will move this\n  console.log(_Systems_FovSystem_js__WEBPACK_IMPORTED_MODULE_5__[\"FovSystem\"]);\n  _Systems_FovSystem_js__WEBPACK_IMPORTED_MODULE_5__[\"FovSystem\"].calculateFov({ geometryData: GeometryData, fovData: FovData }, player.position);\n  console.log(\"FOV\");\n  console.log(_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].print(FovData.grid, cell => cell.visible ? '-' : 'X'));\n  _Systems_RenderSystem_js__WEBPACK_IMPORTED_MODULE_3__[\"RenderSystem\"].render({ geometryData: GeometryData, fovData: FovData, actorData: ActorData, renderData: RenderData });\n  UISystem.displayRenderGrid({ renderData: RenderData });\n});\n\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].subscribe(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].MOVE, move => {\n  _Systems_MoveSystem_js__WEBPACK_IMPORTED_MODULE_4__[\"MoveSystem\"].processAction({ geometryData: GeometryData, actorData: ActorData }, move);\n  _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].RERENDER, null);\n});\n\n// This would all be part of our UI app\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].NEW_LEVEL, { levelString });\n\nconst tryMoveDirection = (mover, direction) => {\n  _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(_Pubsub_topics_js__WEBPACK_IMPORTED_MODULE_2__[\"TOPICS\"].MOVE, { actorId: mover.id, destination: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].add(mover.position, direction) });\n};\nconst DIRECTIONS = {\n  UP: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(0, -1),\n  DOWN: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(0, 1),\n  LEFT: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(-1, 0),\n  RIGHT: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(1, 0)\n};\ndocument.addEventListener(\"keyup\", event => {\n  let defaultHappen = false;\n  switch (event.key) {\n    case \"ArrowDown\":\n      tryMoveDirection(player, DIRECTIONS.DOWN);\n      break;\n    case \"ArrowUp\":\n      tryMoveDirection(player, DIRECTIONS.UP);\n      break;\n    case \"ArrowLeft\":\n      tryMoveDirection(player, DIRECTIONS.LEFT);\n      break;\n    case \"ArrowRight\":\n      tryMoveDirection(player, DIRECTIONS.RIGHT);\n      break;\n    default:\n      defaultHappen = true;\n      break;\n  }\n  if (!defaultHappen) {\n    event.preventDefault();\n  }\n});\nwindow.PUBSUB = _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"];\n\n//# sourceURL=webpack:///./client/src/js/app.js?");

/***/ }),

/***/ "./client/src/js/colors.js":
/*!*********************************!*\
  !*** ./client/src/js/colors.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst makeColor = (r = 0, g = 0, b = 0, a = 255) => {\n  return Object.freeze({ r, g, b, a });\n};\nconst makeColorFromHexStr = str => {\n  // pull off the # if we need it\n  if (str[0] === \"#\") {\n    str = str.substr(1);\n  }\n  if (str.length === 3 || str.length === 4) {\n    const r = parseInt(str[0], 16) * 16;\n    const g = parseInt(str[1], 16) * 16;\n    const b = parseInt(str[2], 16) * 16;\n    if (str.length === 3) {\n      return makeColor(r, g, b);\n    } else {\n      const a = parseInt(str[3], 16) * 16;\n      return makeColor(r, g, b, a);\n    }\n  }\n  if (str.length === 6 || str.length === 8) {\n    const r = parseInt(str.substr(0, 2), 16);\n    const g = parseInt(str.substr(2, 4), 16);\n    const b = parseInt(str.substr(4, 6), 16);\n\n    if (str.length === 6) {\n      return makeColor(r, g, b);\n    } else {\n      const a = parseInt(str.substr(6, 8), 16);\n      return makeColor(r, g, b, a);\n    }\n  } else {\n    throw new Error(\"Invalid color reference\");\n  }\n};\nconst toHexStr = color => {\n  return `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`;\n};\n\nconst darken = (color, amount) => {\n  return makeColor(color.r - amount, color.g - amount, color.b - amount);\n};\nconst copy = origin => makeColor(origin.r, origin.g, origin.b, origin.a);\n// eventually we will probably shift the internal representation, but now for right now\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  BLACK: makeColor(0, 0, 0),\n  WHITE: makeColor(255, 255, 255),\n  makeColor,\n  darken,\n  makeColorFromHexStr,\n  toHexStr\n\n  // eventually we should write some tests around this\n\n  // #75653B\n  // #233344\n  // #131C21\n  // #ABB4B7\n  // #4A6776\n  // #849BA7\n  // #FFFFFF\n\n});\n\n//# sourceURL=webpack:///./client/src/js/colors.js?");

/***/ }),

/***/ "./client/src/js/utils/uid.js":
/*!************************************!*\
  !*** ./client/src/js/utils/uid.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet _Uid = -1;\nconst nextId = () => {\n  return 'uid_' + String(++_Uid);\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  nextId\n});\n\n//# sourceURL=webpack:///./client/src/js/utils/uid.js?");

/***/ })

/******/ });