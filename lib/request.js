'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeFetchRequest = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _states = require('./states');

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
    var _ref2 = _slicedToArray(_ref, 2),
        rawResponse = _ref2[0],
        data = _ref2[1];

    return successfulResponse(remoteDataInstance, rawResponse, data);
  }).catch(function (error) {
    return failureResponse(remoteDataInstance, error.response, error);
  });
};