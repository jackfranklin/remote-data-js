# RemoteData.js

Inspired by Kris Jenkins' [RemoteData](http://package.elm-lang.org/packages/krisajenkins/elm-exts/25.1.0/Exts-RemoteData) Elm package, this library provides an object for representing remote data in your application.

This is still a very early draft, and is not yet published onto npm properly.

## Motivations

By representing the data and the state of the request in one object it becomes impossible for you to have data that's out of sync.

A typical app might model the data as:

```
{ loading: true, data: undefined }
```

And then update the values when the request succeeeds. However, this really is one piece of information that is now represented across two keys, and as such it can become out of sync.

Instead, `RemoteData` models both the _request_ and the _data_ in one object, so they can never be out of sync with each other.

A `RemoteData` instance has one of four states:

- `NOT_ASKED` - you've got started the request yet
- `PENDING` - the request is in flight
- `SUCCESS` - we have data from the request
- `FAILURE` - the request went wrong, we have an error for it

You can check the status of a `RemoteData` instance and therefore represent data in your application accordingly.

## Example

```js
import RemoteData from 'remote-data';

const githubPerson = new RemoteData({
  url: username => `https://api.github.com/users/${username}`,
  onSuccess: remoteData => console.log('Success!', remoteData);
  onFailure: remoteData => console.log('Failure!', remoteData);
  preFetch: remoteData => console.log('Pre fetch!', remoteData);
});

// then later on

githubPerson.fetch('jackfranklin').then((remoteData) => {
  // it worked fine
  console.log(remoteData.isSuccess()) // true
  console.log(remoteData.data()) // github api data
}).catch((remoteData) => {
  // something went wrong
  console.log(remoteData.isSuccess()) // false
  console.log(remoteData.isFailure()) // true
  console.log(remoteData.data()) // error info
});
```
