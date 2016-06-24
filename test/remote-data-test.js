import test from 'tape-promise/tape';
import RemoteData from '../src/index';
import fetchMock from 'fetch-mock';
import { Double } from 'doubler';

const mockSuccess = url => fetchMock.mock(url, { success: true });
const mockError = url => fetchMock.mock(url, 404);

const resetAndMockSuccess = url => {
  fetchMock.restore();
  mockSuccess(url);
};

const resetAndMockError = url => {
  fetchMock.restore();
  mockError(url);
};

const resetAndMockWithResponse = (url, response) => {
  fetchMock.restore();
  fetchMock.mock(url, response);
};

test('It is NOT_ASKED by default', t => {
  t.plan(1);
  t.ok(new RemoteData().isNotAsked());
});

test('When given a URL function it is used for the request', t => {
  t.plan(1);
  resetAndMockSuccess('api.com/1');

  const instance = new RemoteData({
    url: x => `api.com/${x}`,
  });

  instance.fetch('1').then(() => {
    t.ok(fetchMock.called('api.com/1'));
  });
});

test('When given a URL as a string it will be used', t => {
  t.plan(1);
  resetAndMockSuccess('api.com/1');
  const instance = new RemoteData({
    url: 'api.com/1',
  });

  instance.fetch('1').then(() => {
    t.ok(fetchMock.called('api.com/1'));
  });
});

test('for a successful request, onChange is called twice', t => {
  t.plan(2);
  resetAndMockSuccess('api.com/1');
  const onChange = Double.function();
  const instance = new RemoteData({
    url: 'api.com/1',
    onChange,
  });

  instance.fetch().then(() => {
    t.ok(onChange.args[0][0].isPending(), 'onChange is first called with pending');
    t.ok(onChange.args[1][0].isSuccess(), 'onChange is then called with success');
  });
});

test('for a failed request, onChange is called twice', t => {
  t.plan(2);
  resetAndMockError('api.com/1');
  const onChange = Double.function();
  const instance = new RemoteData({
    url: 'api.com/1',
    onChange,
  });

  instance.fetch().then(() => {
    t.ok(onChange.args[0][0].isPending(), 'onChange is first called with pending');
    t.ok(onChange.args[1][0].isFailure(), 'onChange is then called with error');
  });
});

test('By default responses are parsed as JSON', t => {
  t.plan(1);
  resetAndMockWithResponse('api.com/1', { some: 'json' });
  const onChange = Double.function();
  const instance = new RemoteData({
    url: 'api.com/1',
    onChange,
  });

  return instance.fetch().then(result => {
    t.deepEqual(result.data, { some: 'json' });
  });
});

test('A custom parse function can be used for non JSON responses', t => {
  t.plan(1);
  resetAndMockWithResponse('api.com/1', 'Hello World');
  const instance = new RemoteData({
    url: 'api.com/1',
    parse: x => x.text(),
  });

  return instance.fetch().then(result => {
    t.equal(result.data, 'Hello World');
  });
});

test('You can also access response to get the raw HTTP response', t => {
  t.plan(2);
  resetAndMockWithResponse('api.com/1', { some: 'json' });
  const instance = new RemoteData({
    url: 'api.com/1',
  });

  return instance.fetch().then(result => {
    t.deepEqual(result.data, { some: 'json' });
    t.equal(result.response.status, 200);
  }).catch(e => console.log(e));
});

test('Accessing the response throws if the request hasn\'t finished', t => {
  t.plan(1);
  const instance = new RemoteData({
    url: 'api.com/1',
  });

  t.throws(() => instance.response, /Cannot get response for request that hasn't finished/);
});

test('Accessing data throws if the state isn\'t finished', t => {
  t.plan(1);
  const instance = new RemoteData({
    url: 'api.com/1',
  });

  t.throws(() => instance.data, /Cannot get data for request that hasn't finished/);
});
