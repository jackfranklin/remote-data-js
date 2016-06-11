import {
  NOT_ASKED,
  PENDING,
  FAILURE,
  SUCCESS
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
    stateData
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
      'onSuccess', 'onFailure', 'parse', 'fetchOptions', 'state', 'url'
    ];
    const config = {};
    keys.forEach(k => config[k] = this[k]);
    return config;
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
      ...opts
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

export default RemoteData;
