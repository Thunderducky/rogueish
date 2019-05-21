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
eval("__webpack_require__.r(__webpack_exports__);\nconst make = (x, y) => {\n  return { x, y };\n};\nconst set = (p, x, y) => {\n  p.x = x;\n  p.y = y;\n  return p;\n};\nconst offset = (p, x, y) => {\n  p.x += x;\n  p.y += y;\n  return p;\n};\nconst copy = p => {\n  return make(p.x, p.y);\n};\nconst copyTo = (p, p2) => {\n  p.x = p2.x;\n  p.y = p2.y;\n  return p;\n};\n\nconst add = (a, b) => {\n  return make(a.x + b.x, a.y + b.y);\n};\n\nconst addTo = (a, b) => {\n  a.x += b.x;\n  a.y += b.y;\n  return a;\n};\n\nconst scale = (p, size) => {\n  return make(p.x * size, p.y * size);\n};\nconst scaleTo = (p, size) => {\n  p.x *= size;\n  p.y *= size;\n  return p;\n};\n\nconst equal = (p1, p2) => {\n  return p1.x === p2.x && p1.y === p2.y;\n};\n\nconst ZERO = Object.freeze(make(0, 0));\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  make,\n  set,\n  offset,\n  copy,\n  copyTo,\n  add,\n  addTo,\n  scale,\n  scaleTo,\n  equal\n});\n\n//# sourceURL=webpack:///./client/src/js/Shapes/Point.js?");

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

/***/ "./client/src/js/app.js":
/*!******************************!*\
  !*** ./client/src/js/app.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pubsub/pubsub.js */ \"./client/src/js/Pubsub/pubsub.js\");\n/* harmony import */ var _Shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Shapes */ \"./client/src/js/Shapes/index.js\");\n// import GameStateManager from './GameState/GameStateManager';\n// import makeInputState from './GameState/makeInputState';\n// import makeWorldState from './GameState/makeWorldState';\n// const gsm = new GameStateManager();\n\n// Game states mostly enable and disable certain event listeners?\n// that seems like it'd get out of control really quick\n// okay let's go through making each one of the parts\n\n\n\nconst player = {\n  id: 1,\n  character: \"@\",\n  position: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(1, 1)\n};\nconst ActorData = {\n  actors: [player],\n  getActorById: function (id) {\n    return this.actors.find(actor => actor.id === id);\n  } // TODO: Eventually we'll add a reference for this\n};\nconst GeometryData = {};\nconst FovData = {};\nconst PathfindingData = {}; // Potential overlap I guess? If we could memoize this that'd be awesome I guess?\nconst RenderData = {};\nconst UIData = {};\n\nconst Actions = [];\n\n// Saver and Loader\n// All arrow functions, no state for any system\n\nconst SETTINGS = {\n  GRID_WIDTH: 11,\n  GRID_HEIGHT: 5\n};\nconsole.log(\"test\");\nconst linearize = str => str.split('\\n').map(s => s.trim()).join('').trim();\nwindow.linearize = linearize;\nconst levelString = linearize(`\n  .....X.....\n  ...........\n  ...XXXXX...\n  .....X.....\n  .....X.....\n`);\n\n// Let's prototype out a system and then move it into the appropriate data\nGeometryData.grid = _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);\nRenderData.grid = _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);\n_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].setEach(RenderData.grid, (x, y) => {\n  return {\n    character: '.'\n  };\n});\n\nconst GeometrySystem = {\n  save: () => {},\n  load: () => {},\n  simpleStringLoader: ({ geometry }, str) => {\n    _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].setEach(geometry.grid, (x, y, index) => {\n      return { x, y, wall: str[index] === \"X\" };\n    });\n  },\n  generate: () => {}\n};\n\n// we might do this with closures\nconst RenderSystem = {\n  render: ({ geometryData, actorData, renderData }) => {\n    // Little bit extra here, but hey\n    const geoGrid = geometryData.grid;\n    const rendGrid = renderData.grid;\n\n    // Draw all the geometry stuff\n    _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].forEach(geoGrid, (geoCell, x, y, index) => {\n      const renderCell = rendGrid.getIndex(index);\n      renderCell.character = geoCell.wall ? 'X' : '.';\n    });\n\n    // Override the specific pieces with monsters\n    actorData.actors.forEach(actor => {\n      // cameras are going to make this troublesome\n      const renderCell = rendGrid.getP(actor.position);\n      renderCell.character = actor.character;\n    });\n\n    // This is an extra debug helpful step, eventually we'll provide more data for the UI system to use\n    console.log(_Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"].print(renderData.grid, cell => cell.character));\n  }\n};\n\nconst MoveSystem = {\n  processAction: ({ geometryData, actorData }, moveAction) => {\n    console.log(\"test\");\n    const mover = actorData.getActorById(moveAction.actorId);\n    if (mover) {\n      _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].copyTo(mover.position, moveAction.destination);\n    }\n  }\n};\n\nconst TOPICS = {\n  NEW_LEVEL: \"NEW_LEVEL\",\n  RERENDER: \"RERENDER\",\n  MOVE: \"MOVE\"\n};\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].subscribe(TOPICS.NEW_LEVEL, ({ levelString }) => {\n  GeometrySystem.simpleStringLoader({ geometry: GeometryData }, levelString);\n  _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(TOPICS.RERENDER, null);\n});\n\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].subscribe(TOPICS.RERENDER, () => {\n  RenderSystem.render({ geometryData: GeometryData, actorData: ActorData, renderData: RenderData });\n});\n\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].subscribe(TOPICS.MOVE, move => {\n  MoveSystem.processAction({ geometryData: GeometryData, actorData: ActorData }, move);\n  _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(TOPICS.RERENDER, null);\n});\n\n// We might want to also consider doing a message pump\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(TOPICS.NEW_LEVEL, { levelString });\nMoveSystem.processAction({ geometryData: GeometryData, actorData: ActorData }, { actorId: 1, destination: _Shapes__WEBPACK_IMPORTED_MODULE_1__[\"Point\"].make(1, 3) });\n_Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"].publish(TOPICS.RERENDER, null);\n\nwindow.PUBSUB = _Pubsub_pubsub_js__WEBPACK_IMPORTED_MODULE_0__[\"PUBSUB\"];\n\n// // import test from './exportExample';\n// import '../style/main.scss';\n// import Shapes from './Shapes';\n// import RenderGrid from './RenderGrid'\n// import {calculateFOV} from './fov';\n// const {Point, Grid} = Shapes;\n// import { calculatePathSequence } from './pathfinding';\n// //console.log(test); // eslint-disable-line no-console\n// const $ = q => document.querySelector(q);\n// const $$ = q => document.querySelectorAll(q);\n//\n// const white = RenderGrid.makeColor(192, 192, 192);\n// const lightgray = RenderGrid.makeColor(128, 128, 128);\n// const darkgray = RenderGrid.makeColor(64, 64, 64);\n// const black = RenderGrid.makeColor(0, 0, 0);\n//\n// const blue = RenderGrid.makeColor(0, 0, 255);\n//\n//\n// const GRID_WIDTH = 21;\n// const GRID_HEIGHT = 21;\n// const randomInt = (maxExclusive) => { return Math.floor(Math.random() * maxExclusive)}\n// const player = Point.make(randomInt(GRID_WIDTH), randomInt(GRID_HEIGHT));\n// const renderGrid = RenderGrid.make(GRID_WIDTH, GRID_HEIGHT);\n//\n// const makeMapCell = (x,y) => {\n//   return { x,y,\n//     data: {\n//       wall: false\n//     }\n//   }\n// }\n// // let's make a visibility grid\n//\n//\n// const mapGrid = Grid.setEach(Grid.make(GRID_WIDTH, GRID_HEIGHT), (x,y) => makeMapCell(x,y));\n// // let's build a grid traverser\n// // WORST MAP GENERATION EVER!!!111!!\n// // We should do a way of freezing or unfreezing things\n// mapGrid.cells.forEach(c => c.data.wall = (Math.random() < 0.3));\n// mapGrid.getP(player).data.wall = false;\n// const goal = Point.make(randomInt(GRID_WIDTH),randomInt(GRID_HEIGHT));\n// console.log(goal);\n// mapGrid.getP(goal).data.wall = false;\n//\n// const playerPath = calculatePathSequence(mapGrid, player, goal);\n// console.log(playerPath);\n//\n// const renderCell = (mapCell, renderCell, fovCell) => {\n//   if(mapCell.data.wall){\n//     renderCell.cellColor = fovCell.visible ? darkgray : black;\n//   } else {\n//     renderCell.cellColor = fovCell.visible ? white : lightgray\n//   }\n//   renderCell.character = ' ';\n// }\n// // let's hardcode some VALUES\n//\n// // this will need to eventually take into account a \"camera\" concept\n// const renderMapToGrid = (map, renderGrid) => {\n//     // eventually we'll move this out of here\n//     const fovGrid = Grid.setEach(Grid.make(GRID_WIDTH, GRID_HEIGHT), (x,y) => {\n//       return { visible: true };\n//     });\n//     calculateFOV(map, fovGrid, player);\n//     map.cells.forEach((cell, index) => {\n//       renderCell(cell, renderGrid.cells[index], fovGrid.cells[index]);\n//     });\n// };\n// renderGrid.getP(player).character = \"@\";\n//\n//\n// //console.log(RenderGrid.printStr(renderGrid));\n// const container = $(\"#container\")\n// container.innerHTML = RenderGrid.renderHTML(renderGrid);\n//\n// const squareListener = (eventName, fn) => {\n//   container.addEventListener(eventName, function(e){\n//     // if we are exiting to a child, mark it as so\n//     //console.log(\"container out\", e);\n//     if(e.target.className === \"square\"){\n//       // retain original function binding I guess\n//       return fn.bind(e.target)(e);\n//     }\n//   });\n// }\n//\n// const renderPathToGrid = (path, renderGrid) => {\n//   const RED = {r:255,g: 0,b: 0,a: 255};\n//   const DARK_RED = {r:128,g: 0,b: 0,a: 255};\n//   renderGrid.getP(path.start).cellColor = RED;\n//   const traverser = Point.copy(path.start);\n//   path.path.forEach(move => {\n//     const cell = renderGrid.getP(move);\n//     cell.cellColor = DARK_RED;\n//   })\n// }\n//\n// const rerender = () => {\n//   renderMapToGrid(mapGrid, renderGrid);\n//   renderPathToGrid(playerPath, renderGrid);\n//   const playerCell = renderGrid.getP(player);\n//   playerCell.character = \"@\";\n//   playerCell.textColor = blue;\n//   const goalCell = renderGrid.getP(goal);\n//   console.log(goalCell);\n//   goalCell.cellColor = {r:0,g:220,b:0, a:255};\n//   container.innerHTML = RenderGrid.renderHTML(renderGrid);\n// }\n//\n//\n// const getCellFromHTML = (element) => {\n//   return mapGrid.getXY(+element.getAttribute('x'),+element.getAttribute('y'))\n// }\n// // TODO: build this from map cells\n//\n//\n// rerender();\n//\n// const SQUARE_EXIT_EVENT = \"mouseout\";\n// const SQUARE_ENTER_EVENT = \"mouseover\";\n// const SQUARE_MOVE_EVENT = \"mousemove\";\n// const SQUARE_LEFT_CLICK_EVENT = \"click\";\n// const SQUARE_RIGHT_CLICK_EVENT = \"contextmenu\";\n// squareListener(SQUARE_LEFT_CLICK_EVENT, function(e){\n//   const cell = getCellFromHTML(this);\n//   console.log(cell);\n//   cell.data.wall = false;\n//   rerender();\n//   return false;\n// })\n//\n// squareListener(SQUARE_RIGHT_CLICK_EVENT, function(e){\n//   e.preventDefault();\n//   const cell = getCellFromHTML(this);\n//   cell.data.wall = true;\n//   rerender();\n//   return false;\n// })\n//\n// const preventEvents = [\"ArrowLeft\", \"ArrowRight\", \"ArrowUp\", \"ArrowDown\"]\n//\n// console.log(playerPath);\n// window.setTimeout(() => {\n//   window.setInterval(() => {\n//     if(playerPath.path.length <= 0){\n//       window.location.reload();\n//     } else {\n//       Point.copyTo(player, playerPath.path.pop());\n//       rerender();\n//     }\n//   }, 400)\n// }, 2000)\n// document.onkeydown = function(e){\n//   const key = e.key;\n//\n//   if(key === \"ArrowLeft\"){\n//     player.x--;\n//     if(mapGrid.getP(player).data.wall){\n//       player.x++;\n//     }\n//   }\n//   else if(key === \"ArrowRight\"){\n//     player.x++;\n//     if(mapGrid.getP(player).data.wall){\n//       player.x--;\n//     }\n//   }\n//   else if(key === \"ArrowUp\"){\n//     player.y--;\n//     if(mapGrid.getP(player).data.wall){\n//       player.y++;\n//     }\n//   }\n//   else if(key === \"ArrowDown\"){\n//     player.y++;\n//     if(mapGrid.getP(player).data.wall){\n//       player.y--;\n//     }\n//   }\n//   rerender();\n//   //console.log(e.key);\n//   if(preventEvents.indexOf(key) >= 0){\n//     e.preventDefault();\n//     return false;\n//   }\n//   return true;\n// }\n//\n// rerender();\n// window.player = player;\n// window.rerender = rerender;\n\n//# sourceURL=webpack:///./client/src/js/app.js?");

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