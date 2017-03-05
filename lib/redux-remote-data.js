'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var remoteDataThunkAction = exports.remoteDataThunkAction = function remoteDataThunkAction(_ref) {
  var _ref$actionPrefix = _ref.actionPrefix,
      actionPrefix = _ref$actionPrefix === undefined ? 'REMOTE_DATA' : _ref$actionPrefix;

  var CHANGE_ACTION = actionPrefix + '_CHANGE';

  return function (remoteData) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function (dispatch) {
      remoteData.onChange = function (d) {
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