import {
  NOT_ASKED,
  PENDING,
  FAILURE,
  SUCCESS,
} from './states';

import { makeFetchRequest } from './request';

class RemoteData {
  constructor({
    url,
    state = NOT_ASKED,
    onChange = () => {},
    parse = x => x.json(),
    fetchOptions = {},
    rawResponse,
    stateData,
  } = {}) {
    this.state = state;
    this.url = url;
    this.onChange = onChange;
    this.parse = parse;
    this.fetchOptions = fetchOptions;
    this.stateData = stateData;
    this.rawResponse = rawResponse;
  }

  config() {
    const keys = [
      'onSuccess',
      'onFailure',
      'parse',
      'fetchOptions',
      'state',
      'url',
      'onChange',
    ];
    const config = {};
    keys.forEach(k => { config[k] = this[k]; });
    return config;
  }

  // the default implementations here call through to the _ function
  // which is called if the user does not provide a function
  case({
    NotAsked = () => _(),
    Pending = () => _(),
    Failure = (...args) => _(...args),
    Success = (...args) => _(...args),
    _ = () => {},
  }) {
    switch (this.state) {
      case NOT_ASKED:
        return NotAsked();
      case PENDING:
        return Pending();
      case FAILURE:
        return Failure(this.stateData);
      case SUCCESS:
        return Success(this.stateData);
    }
  }

  isFinished() {
    return this.isFailure() || this.isSuccess();
  }

  isPending() {
    return this.state === PENDING;
  }

  isNotAsked() {
    return this.state === NOT_ASKED;
  }

  isFailure() {
    return this.state === FAILURE;
  }

  isSuccess() {
    return this.state === SUCCESS;
  }

  get data() {
    if (this.isFinished()) {
      return this.stateData;
    } else {
      throw new Error('Cannot get data for request that hasn\'t finished');
    }
  }

  get response() {
    if (this.isFinished()) {
      return this.rawResponse;
    } else {
      throw new Error('Cannot get response for request that hasn\'t finished');
    }
  }

  makeNewAndOnChange(opts = {}) {
    const newRemoteData = new this.constructor({
      ...this.config(),
      ...opts,
    });

    this.onChange(newRemoteData);
    return newRemoteData;
  }

  fetch(...args) {
    const reqUrl = typeof this.url === 'function' ? this.url(...args) : this.url;
    this.makeNewAndOnChange({ state: PENDING });

    return makeFetchRequest(this, reqUrl);
  }
}

RemoteData.all = (promises, {
  onChange,
  mergeStateData = remoteDatas => remoteDatas.map(instance => instance.data),
  mergeResponse = remoteDatas => remoteDatas.map(instance => instance.response),
}) => {
  return Promise.all(promises).then((remoteDatas) => {
    const state = remoteDatas.every(instance => instance.isSuccess()) ? SUCCESS : FAILURE;

    const instance = new RemoteData({ onChange });
    return instance.makeNewAndOnChange({
      state,
      rawResponse: mergeResponse(remoteDatas),
      stateData: mergeStateData(remoteDatas),
    });
  });
};

export default RemoteData;
