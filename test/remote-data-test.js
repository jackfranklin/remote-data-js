import test from 'tape';
import RemoteData from '../src/index';
import fetchMock from 'fetch-mock';

test('It is NOT_ASKED by default', t => {
  t.plan(1);
  t.ok(new RemoteData().isNotAsked());
});

test('When given a URL function it is used for the request', t => {
  fetchMock.reset();
  t.plan(1);
  fetchMock.mock('api.com/1', 200);

  const instance = new RemoteData({
    url: x => `api.com/${x}`
  })

  instance.fetch('1').then(() => {
    t.ok(fetchMock.called('api.com/1'));
  });
});

test('When given a URL as a string it will be used', t => {
  fetchMock.reset();
  t.plan(1);
  fetchMock.mock('api.com/1', 200);
  const instance = new RemoteData({
    url: 'api.com/1'
  });

  instance.fetch('1').then(() => {
    t.ok(fetchMock.called('api.com/1'));
  });
});
