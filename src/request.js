import {
  FAILURE,
  SUCCESS
} from './states';

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

const dataResponse = (remoteDataInstance, rawResponse, data, isError) => {
  return remoteDataInstance.makeNewAndOnChange({
    state: isError ? FAILURE : SUCCESS,
    stateData: data,
    rawResponse
  });
}

const successfulResponse = (remoteDataInstance, rawResponse, data) => {
  return dataResponse(remoteDataInstance, rawResponse, data, false);
}
const failureResponse = (remoteDataInstance, rawResponse, data) => {
  return dataResponse(remoteDataInstance, rawResponse, data, true);
}

const parseAndKeepResponse = parseFn => result => {
  return Promise.all([
    Promise.resolve(result),
    Promise.resolve(parseFn(result))
  ]);
}

export const makeFetchRequest = (remoteDataInstance, url) => {
  return fetch(url, remoteDataInstance.fetchOptions)
    .then(checkStatus)
    .then(parseAndKeepResponse(remoteDataInstance.parse.bind(remoteDataInstance)))
    .then(([rawResponse, data]) => successfulResponse(remoteDataInstance, rawResponse, data))
    .catch(error => failureResponse(remoteDataInstance, error.response, error));
}
