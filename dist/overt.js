(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["overt"] = factory();
	else
		root["overt"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _sources = __webpack_require__(4);

	Object.keys(_sources).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _sources[key];
	    }
	  });
	});

	var _sinks = __webpack_require__(3);

	Object.keys(_sinks).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _sinks[key];
	    }
	  });
	});

	var _transformers = __webpack_require__(2);

	Object.keys(_transformers).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _transformers[key];
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var transformer = exports.transformer = function transformer(runner) {
	  return function () {
	    var s1 = this;
	    var transformer = runner.apply(undefined, arguments);
	    var go = function go(source) {
	      var handler = transformer(source);
	      return function (cb) {
	        return handler(cb);
	      };
	    };
	    if (s1) return go(s1);
	    return function () {
	      return go(this);
	    };
	  };
	};

	var sink = exports.sink = function sink(cb) {
	  var s1 = this;
	  var go = function go(source) {
	    return source(cb);
	  };
	  if (s1) return go(s1);
	  return function () {
	    return go(this);
	  };
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.replay = exports.share = exports.scan = exports.merge = exports.concat = exports.chainLatest = exports.take = exports.chain = exports.ap = exports.filter = exports.map = exports.delay = undefined;

	var _core = __webpack_require__(1);

	var delay = exports.delay = (0, _core.transformer)(function () {
	  var amt = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	  return function (source) {
	    return function (sink) {
	      var id = void 0;
	      var unsub = source(function (v) {
	        setTimeout(function () {
	          return sink(v);
	        }, amt);
	      });
	      return function () {
	        unsub();
	        clearTimeout(id);
	      };
	    };
	  };
	});

	var map = exports.map = (0, _core.transformer)(function (mapper) {
	  return function (source) {
	    return function (sink) {
	      return source(function (v) {
	        return sink(mapper(v));
	      });
	    };
	  };
	});

	var filter = exports.filter = (0, _core.transformer)(function (pred) {
	  return function (source) {
	    return function (sink) {
	      return source(function (v) {
	        if (pred(v)) sink(v);
	      });
	    };
	  };
	});

	var ap = exports.ap = (0, _core.transformer)(function (stream) {
	  return function (source) {
	    return function (sink) {
	      var latestf = { type: 'nothing' };
	      var latestv = { type: 'nothing' };
	      var push = function push() {
	        if (latestf.type === 'just' && latestv.type === 'just') {
	          sink(latestf.value(latestv.value));
	        }
	      };
	      var disposef = source(function (fn) {
	        latestf = { type: 'just', value: fn };
	        push();
	      });
	      var disposev = stream(function (v) {
	        latestv = { type: 'just', value: v };
	        push();
	      });
	      return function () {
	        disposef();
	        disposev();
	      };
	    };
	  };
	});

	var chain = exports.chain = (0, _core.transformer)(function (mapper) {
	  var listeners = [];
	  return function (source) {
	    return function (sink) {
	      var unsub = source(function (v) {
	        listeners.push(mapper(v)(sink));
	      });
	      return function () {
	        unsub();listeners.forEach(function (l) {
	          return l();
	        });
	      };
	    };
	  };
	});

	var take = exports.take = (0, _core.transformer)(function (n) {
	  return function (stream) {
	    return function (sink) {
	      var count = 0;
	      var disposer = null;
	      var dispose = function dispose() {
	        if (disposer !== null) {
	          disposer();
	          disposer = null;
	        }
	      };
	      disposer = stream(function (x) {
	        count++;
	        if (count <= n) {
	          sink(x);
	        }
	        if (count >= n) {
	          dispose();
	        }
	      });
	      if (count >= n) {
	        dispose();
	      }
	      return dispose;
	    };
	  };
	});

	var chainLatest = exports.chainLatest = (0, _core.transformer)(function (mapper) {
	  var listeners = function listeners() {};
	  return function (source) {
	    return function (sink) {
	      var unsub = source(function (v) {
	        listeners();
	        listeners = mapper(v)(sink);
	      });
	      return function () {
	        unsub();listeners();
	      };
	    };
	  };
	});

	var concat = exports.concat = (0, _core.transformer)(function (stream) {
	  return function (source) {
	    return function (cb) {
	      var d1 = source(cb);
	      var d2 = stream(cb);
	      return function () {
	        d1();d2();
	      };
	    };
	  };
	});

	var merge = exports.merge = concat;

	var scan = exports.scan = (0, _core.transformer)(function (init, reducer) {
	  var s = init;
	  return function (source) {
	    return function (sink) {
	      sink(s);
	      return source(function (v) {
	        s = reducer(s, v);
	        sink(s);
	      });
	    };
	  };
	});

	var share = exports.share = (0, _core.transformer)(function () {
	  var listeners = [];
	  var unsub = void 0;
	  return function (source) {
	    return function (sink) {
	      if (listeners.length === 0) {
	        unsub = source(function (v) {
	          return listeners.forEach(function (sink) {
	            return sink(v);
	          });
	        });
	      }
	      listeners.push(sink);
	      return function () {
	        listeners = listeners.filter(function (x) {
	          return x !== sink;
	        });
	        if (listeners.length === 0) {
	          unsub();
	        }
	      };
	    };
	  };
	});

	var replay = exports.replay = (0, _core.transformer)(function () {
	  var set = false;
	  var last = void 0;
	  return function (source) {
	    source(function (v) {});
	    return function (cb) {};
	  };
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.log = undefined;

	var _context;

	var _core = __webpack_require__(1);

	var log = exports.log = (0, _core.sink)((_context = console).log.bind(_context));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.repeat = exports.of = exports.value = exports.values = undefined;
	exports.signal = signal;

	var _transformers = __webpack_require__(2);

	var values = exports.values = function values(array) {
	  return function (cb) {
	    array.forEach(function (v) {
	      return cb(v);
	    });
	    return function () {};
	  };
	};

	var value = exports.value = function value(x) {
	  return values([x]);
	};
	var of = exports.of = function of(x) {
	  return values([x]);
	};

	var repeat = exports.repeat = function repeat(v) {
	  var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	  return function (cb) {
	    var id = void 0;
	    var go = function go() {
	      id = setTimeout(function () {
	        go();cb(v);
	      }, delay);
	    };
	    go();
	    return function () {
	      return clearTimeout(id);
	    };
	  };
	};

	function signal() {
	  var _context;

	  var dispatch = function dispatch() {};
	  var stream = (_context = function _context(cb) {
	    dispatch = cb;
	    return function () {
	      return dispatch = function dispatch() {};
	    };
	  }, _transformers.share).call(_context);
	  stream.dispatch = function (v) {
	    return dispatch(v);
	  };
	  return stream;
	}

/***/ }
/******/ ])
});
;