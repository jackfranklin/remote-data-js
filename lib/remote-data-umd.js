(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RemoteData"] = factory();
	else
		root["RemoteData"] = factory();
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

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NOT_ASKED = exports.NOT_ASKED = 'REMOTE_DATA_NOT_ASKED';
	var PENDING = exports.PENDING = 'REMOTE_DATA_PENDING';
	var FAILURE = exports.FAILURE = 'REMOTE_DATA_FAILURE';
	var SUCCESS = exports.SUCCESS = 'REMOTE_DATA_SUCCESS';

	var REMOTE_DATA_STATES = exports.REMOTE_DATA_STATES = {
	  NOT_ASKED: NOT_ASKED,
	  PENDING: PENDING,
	  FAILURE: FAILURE,
	  SUCCESS: SUCCESS
	};

	var checkStatus = function checkStatus(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response;
	  } else {
	    var error = new Error(response.statusText);
	    error.response = response;
	    throw error;
	  }
	};

	var RemoteData = function () {
	  function RemoteData(_ref) {
	    var url = _ref.url;
	    var _ref$state = _ref.state;
	    var state = _ref$state === undefined ? NOT_ASKED : _ref$state;
	    var _ref$onSuccess = _ref.onSuccess;
	    var onSuccess = _ref$onSuccess === undefined ? function () {} : _ref$onSuccess;
	    var _ref$onFailure = _ref.onFailure;
	    var onFailure = _ref$onFailure === undefined ? function () {} : _ref$onFailure;
	    var _ref$preFetch = _ref.preFetch;
	    var preFetch = _ref$preFetch === undefined ? function () {} : _ref$preFetch;
	    var _ref$parse = _ref.parse;
	    var parse = _ref$parse === undefined ? function (x) {
	      return x.json();
	    } : _ref$parse;
	    var _ref$fetchOptions = _ref.fetchOptions;
	    var fetchOptions = _ref$fetchOptions === undefined ? {} : _ref$fetchOptions;
	    var stateData = _ref.stateData;

	    _classCallCheck(this, RemoteData);

	    this.state = state;
	    this.url = url;
	    this.onSuccess = onSuccess;
	    this.onFailure = onFailure;
	    this.preFetch = preFetch;
	    this.parse = parse;
	    this.fetchOptions = fetchOptions;
	    this.stateData = stateData;
	  }

	  _createClass(RemoteData, [{
	    key: 'config',
	    value: function config() {
	      var _this = this;

	      var keys = ['onSuccess', 'onFailure', 'parse', 'fetchOptions', 'state', 'url'];
	      var config = {};
	      keys.forEach(function (k) {
	        return config[k] = _this[k];
	      });
	      return config;
	    }
	  }, {
	    key: 'isFinished',
	    value: function isFinished() {
	      return this.isFailure() || this.isSuccess();
	    }
	  }, {
	    key: 'isPending',
	    value: function isPending() {
	      return this.state === PENDING;
	    }
	  }, {
	    key: 'isNotAsked',
	    value: function isNotAsked() {
	      return this.state === NOT_ASKED;
	    }
	  }, {
	    key: 'isFailure',
	    value: function isFailure() {
	      return this.state === FAILURE;
	    }
	  }, {
	    key: 'isSuccess',
	    value: function isSuccess() {
	      return this.state === SUCCESS;
	    }
	  }, {
	    key: 'data',
	    value: function data() {
	      if (this.isFinished()) {
	        return this.stateData;
	      } else {
	        throw new Error("Cannot get data for request that hasn't finished");
	      }
	    }
	  }, {
	    key: 'fetch',
	    value: function (_fetch) {
	      function fetch() {
	        return _fetch.apply(this, arguments);
	      }

	      fetch.toString = function () {
	        return _fetch.toString();
	      };

	      return fetch;
	    }(function () {
	      var _this2 = this;

	      var url = this.url.apply(this, arguments);
	      this.preFetch(new RemoteData(_extends({}, this.config(), {
	        state: PENDING
	      })));

	      return fetch(url, this.fetchOptions = {}).then(checkStatus).then(this.parse).then(function (data) {
	        var result = new RemoteData(_extends({}, _this2.config(), {
	          state: SUCCESS,
	          stateData: data
	        }));
	        _this2.onSuccess(result);
	        return result;
	      }).catch(function (err) {
	        var result = new RemoteData(_extends({}, _this2.config(), {
	          state: FAILURE,
	          stateData: err
	        }));
	        _this2.onFailure(result);
	        return result;
	      });
	    })
	  }]);

	  return RemoteData;
	}();

	exports.default = RemoteData;
	var remoteDataThunkAction = exports.remoteDataThunkAction = function remoteDataThunkAction(_ref2) {
	  var _ref2$actionPrefix = _ref2.actionPrefix;
	  var actionPrefix = _ref2$actionPrefix === undefined ? 'REMOTE_DATA' : _ref2$actionPrefix;

	  var CHANGE_ACTION = actionPrefix + '_CHANGE';

	  return function (remoteData) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    return function (dispatch) {
	      remoteData.preFetch = function (d) {
	        return dispatch({
	          type: CHANGE_ACTION,
	          remoteData: d
	        });
	      };

	      return remoteData.fetch.apply(remoteData, args).then(function (d) {
	        dispatch({
	          type: CHANGE_ACTION,
	          remoteData: d
	        });
	      });
	    };
	  };
	};

/***/ }
/******/ ])
});
;