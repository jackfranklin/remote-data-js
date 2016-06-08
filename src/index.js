export const NOT_ASKED = 'REMOTE_DATA_NOT_ASKED';
export const PENDING = 'REMOTE_DATA_PENDING';
export const FAILURE = 'REMOTE_DATA_FAILURE';
export const SUCCESS = 'REMOTE_DATA_SUCCESS';

export const REMOTE_DATA_STATES = {
  NOT_ASKED,
  PENDING,
  FAILURE,
  SUCCESS
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

class RemoteData {
  constructor({
    url,
    state = NOT_ASKED,
    onSuccess = () => {},
    onFailure = () => {},
    preFetch = () => {},
    parse = x => x.json(),
    fetchOptions = {},
    stateData
  } = {}) {
    this.state = state;
    this.url = url;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.preFetch = preFetch;
    this.parse = parse;
    this.fetchOptions = fetchOptions;
    this.stateData = stateData;
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

  data() {
    if (this.isFinished()) {
      return this.stateData;
    } else {
      throw new Error("Cannot get data for request that hasn't finished");
    }
  }

  fetch(...args) {
    const reqUrl = typeof this.url === 'function' ? this.url(...args) : this.url;
    this.preFetch(new RemoteData({
      ...this.config(),
      state: PENDING
    }));

    return fetch(reqUrl, this.fetchOptions = {})
      .then(checkStatus)
      .then(this.parse)
      .then(data => {
        const result = new RemoteData({
          ...this.config(),
          state: SUCCESS,
          stateData: data
        });
        this.onSuccess(result);
        return result;
      })
      .catch(err => {
        const result = new RemoteData({
          ...this.config(),
          state: FAILURE,
          stateData: err
        });
        this.onFailure(result);
        return result;
      });
  }
}

export default RemoteData;

export const remoteDataThunkAction = ({
  actionPrefix = 'REMOTE_DATA',
}) => {
    const CHANGE_ACTION = `${actionPrefix}_CHANGE`;

    return (remoteData, ...args) => (dispatch) => {
      remoteData.preFetch = d => dispatch({
        type: CHANGE_ACTION,
        remoteData: d
      });

      return remoteData.fetch(...args).then(d => {
        dispatch({
          type: CHANGE_ACTION,
          remoteData: d
        });
      });
    }
};
