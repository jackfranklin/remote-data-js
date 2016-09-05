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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _states = __webpack_require__(1);

	var _request = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RemoteData = function () {
	  function RemoteData() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var url = _ref.url;
	    var _ref$state = _ref.state;
	    var state = _ref$state === undefined ? _states.NOT_ASKED : _ref$state;
	    var _ref$onChange = _ref.onChange;
	    var onChange = _ref$onChange === undefined ? function () {} : _ref$onChange;
	    var _ref$parse = _ref.parse;
	    var parse = _ref$parse === undefined ? function (x) {
	      return x.json();
	    } : _ref$parse;
	    var _ref$fetchOptions = _ref.fetchOptions;
	    var fetchOptions = _ref$fetchOptions === undefined ? {} : _ref$fetchOptions;
	    var rawResponse = _ref.rawResponse;
	    var stateData = _ref.stateData;

	    _classCallCheck(this, RemoteData);

	    this.state = state;
	    this.url = url;
	    this.onChange = onChange;
	    this.parse = parse;
	    this.fetchOptions = fetchOptions;
	    this.stateData = stateData;
	    this.rawResponse = rawResponse;
	  }

	  _createClass(RemoteData, [{
	    key: 'config',
	    value: function config() {
	      var _this = this;

	      var keys = ['onSuccess', 'onFailure', 'parse', 'fetchOptions', 'state', 'url', 'onChange'];
	      var config = {};
	      keys.forEach(function (k) {
	        config[k] = _this[k];
	      });
	      return config;
	    }

	    // the default implementations here call through to the _ function
	    // which is called if the user does not provide a function

	  }, {
	    key: 'case',
	    value: function _case(_ref2) {
	      var _ref2$NotAsked = _ref2.NotAsked;
	      var NotAsked = _ref2$NotAsked === undefined ? function () {
	        return _();
	      } : _ref2$NotAsked;
	      var _ref2$Pending = _ref2.Pending;
	      var Pending = _ref2$Pending === undefined ? function () {
	        return _();
	      } : _ref2$Pending;
	      var _ref2$Failure = _ref2.Failure;
	      var Failure = _ref2$Failure === undefined ? function () {
	        return _.apply(undefined, arguments);
	      } : _ref2$Failure;
	      var _ref2$Success = _ref2.Success;
	      var Success = _ref2$Success === undefined ? function () {
	        return _.apply(undefined, arguments);
	      } : _ref2$Success;
	      var _ref2$_ = _ref2._;

	      var _ = _ref2$_ === undefined ? function () {} : _ref2$_;

	      switch (this.state) {
	        case _states.NOT_ASKED:
	          return NotAsked();
	        case _states.PENDING:
	          return Pending();
	        case _states.FAILURE:
	          return Failure(this.stateData);
	        case _states.SUCCESS:
	          return Success(this.stateData);
	      }
	    }
	  }, {
	    key: 'isFinished',
	    value: function isFinished() {
	      return this.isFailure() || this.isSuccess();
	    }
	  }, {
	    key: 'isPending',
	    value: function isPending() {
	      return this.state === _states.PENDING;
	    }
	  }, {
	    key: 'isNotAsked',
	    value: function isNotAsked() {
	      return this.state === _states.NOT_ASKED;
	    }
	  }, {
	    key: 'isFailure',
	    value: function isFailure() {
	      return this.state === _states.FAILURE;
	    }
	  }, {
	    key: 'isSuccess',
	    value: function isSuccess() {
	      return this.state === _states.SUCCESS;
	    }
	  }, {
	    key: 'makeNewAndOnChange',
	    value: function makeNewAndOnChange() {
	      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var newRemoteData = new this.constructor(_extends({}, this.config(), opts));

	      this.onChange(newRemoteData);
	      return newRemoteData;
	    }
	  }, {
	    key: 'fetch',
	    value: function fetch() {
	      var reqUrl = typeof this.url === 'function' ? this.url.apply(this, arguments) : this.url;
	      this.makeNewAndOnChange({ state: _states.PENDING });

	      return (0, _request.makeFetchRequest)(this, reqUrl);
	    }
	  }, {
	    key: 'data',
	    get: function get() {
	      if (this.isFinished()) {
	        return this.stateData;
	      } else {
	        throw new Error('Cannot get data for request that hasn\'t finished');
	      }
	    }
	  }, {
	    key: 'response',
	    get: function get() {
	      if (this.isFinished()) {
	        return this.rawResponse;
	      } else {
	        throw new Error('Cannot get response for request that hasn\'t finished');
	      }
	    }
	  }]);

	  return RemoteData;
	}();

	exports.default = RemoteData;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var NOT_ASKED = exports.NOT_ASKED = 'REMOTE_DATA_NOT_ASKED';
	var PENDING = exports.PENDING = 'REMOTE_DATA_PENDING';
	var FAILURE = exports.FAILURE = 'REMOTE_DATA_FAILURE';
	var SUCCESS = exports.SUCCESS = 'REMOTE_DATA_SUCCESS';

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeFetchRequest = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _states = __webpack_require__(1);

	var checkStatus = function checkStatus(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response;
	  } else {
	    var error = new Error(response.statusText);
	    error.response = response;
	    throw error;
	  }
	};

	var dataResponse = function dataResponse(remoteDataInstance, rawResponse, data, isError) {
	  return remoteDataInstance.makeNewAndOnChange({
	    state: isError ? _states.FAILURE : _states.SUCCESS,
	    stateData: data,
	    rawResponse: rawResponse
	  });
	};

	var successfulResponse = function successfulResponse(remoteDataInstance, rawResponse, data) {
	  return dataResponse(remoteDataInstance, rawResponse, data, false);
	};

	var failureResponse = function failureResponse(remoteDataInstance, rawResponse, data) {
	  return dataResponse(remoteDataInstance, rawResponse, data, true);
	};

	var parseAndKeepResponse = function parseAndKeepResponse(parseFn) {
	  return function (result) {
	    return Promise.all([Promise.resolve(result), Promise.resolve(parseFn(result))]);
	  };
	};

	var makeFetchRequest = exports.makeFetchRequest = function makeFetchRequest(remoteDataInstance, url) {
	  return fetch(url, remoteDataInstance.fetchOptions).then(checkStatus).then(parseAndKeepResponse(remoteDataInstance.parse)).then(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);

	    var rawResponse = _ref2[0];
	    var data = _ref2[1];
	    return successfulResponse(remoteDataInstance, rawResponse, data);
	  }).catch(function (error) {
	    return failureResponse(remoteDataInstance, error.response, error);
	  });
	};

/***/ }
/******/ ])
});
;