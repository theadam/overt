(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["streamline"] = factory();
	else
		root["streamline"] = factory();
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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var css = '.timeline:last-child{border-bottom:0;}.timeline{width:100%;border-bottom:1px solid gray;position:relative;overflow:hidden;height:100px}.timeline .name{position:absolute;top:0;left:0;color:gray;font-family:sans-serif;padding:2px 5px;font-weight:400;font-size:12px;border-bottom:1px solid gray;border-right:1px solid gray}.timeline .line{position:absolute;background-color:#000;top:50%;left:0;right:0;height:2px}.timeline .ball-wrapper{height:100%;width:100%;position:absolute}.timeline .ball-wrapper .ball{background-color:#ff6946;position:absolute;transform:translateY(-50%);top:50%;width:50px;height:50px;border-radius:100px;border:2px solid #000;text-align:center;line-height:50px;font-weight:700;font-family:sans-serif}';
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');

	style.type = 'text/css';
	if (style.styleSheet) {
	  style.styleSheet.cssText = css;
	} else {
	  style.appendChild(document.createTextNode(css));
	}
	head.appendChild(style);

	var _React = React;
	var Component = _React.Component;

	var Timelines = exports.Timelines = function (_Component) {
	  _inherits(Timelines, _Component);

	  function Timelines() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, Timelines);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Timelines)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.scheduleUpdate = function () {
	      _this._id = requestAnimationFrame(_this.rerender);
	    }, _this.rerender = function (t) {
	      if (t - _this._lastUpdate < 16) return _this.scheduleUpdate();
	      _this._lastUpdate = t;
	      _this.forceUpdate();
	      _this.scheduleUpdate();
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(Timelines, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var streams = this.props.streams;

	      var streamArray = Object.keys(streams).map(function (key) {
	        return { name: key, stream: streams[key] };
	      });
	      this.setState({ streams: streamArray });
	      this._lastUpdate = 0;
	      this.scheduleUpdate();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      cancelAnimationFrame(this._id);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var streams = this.state.streams;

	      return React.createElement(
	        'div',
	        null,
	        streams.map(function (_ref) {
	          var name = _ref.name;
	          var stream = _ref.stream;
	          return React.createElement(Timeline, { key: name, name: name, stream: stream, time: _this2._lastUpdate });
	        })
	      );
	    }
	  }]);

	  return Timelines;
	}(Component);

	var Timeline = function (_Component2) {
	  _inherits(Timeline, _Component2);

	  function Timeline() {
	    var _Object$getPrototypeO2;

	    var _temp2, _this3, _ret2;

	    _classCallCheck(this, Timeline);

	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Timeline)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this3), _this3.handleStream = function (value) {
	      var event = { key: _this3._id++, value: value, offset: Math.random(), time: performance.now() };
	      _this3._events = [event].concat(_toConsumableArray(_this3._events.slice(0, 15)));
	    }, _temp2), _possibleConstructorReturn(_this3, _ret2);
	  }

	  _createClass(Timeline, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this._id = 0;
	      this._events = [];
	      this._unsubscribe = this.props.stream(this.handleStream);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this._unsubscribe();
	    }
	  }, {
	    key: 'x',
	    value: function x(time) {
	      return 100 - (this.props.time - time) / 50;
	    }
	  }, {
	    key: 'y',
	    value: function y(x, offset) {
	      return 2 * Math.sin(offset * x / 4);
	    }
	  }, {
	    key: 'transform',
	    value: function transform(time, offset) {
	      var x = this.x(time);
	      var y = this.y(x, offset);
	      return 'translate(' + x + '%, ' + y + '%)';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      return React.createElement(
	        'div',
	        { className: 'timeline' },
	        this.props.name !== undefined && React.createElement(
	          'div',
	          { className: 'name' },
	          this.props.name
	        ),
	        React.createElement('div', { className: 'line' }),
	        this._events.map(function (_ref2) {
	          var key = _ref2.key;
	          var value = _ref2.value;
	          var time = _ref2.time;
	          var offset = _ref2.offset;
	          return React.createElement(
	            'div',
	            { key: key, className: 'ball-wrapper', style: { transform: _this4.transform(time, offset) } },
	            React.createElement(
	              'div',
	              { className: 'ball' },
	              value
	            )
	          );
	        })
	      );
	    }
	  }]);

	  return Timeline;
	}(Component);

/***/ }
/******/ ])
});
;