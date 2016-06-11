# RemoteData.js

Inspired by Kris Jenkins' [RemoteData](http://package.elm-lang.org/packages/krisajenkins/elm-exts/25.1.0/Exts-RemoteData) Elm package, this library provides an object for representing remote data in your application.

[![Build Status](https://travis-ci.org/jackfranklin/remote-data-js.svg?branch=master)](https://travis-ci.org/jackfranklin/remote-data-js)

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

Additionally, `RemoteData` instances are _never_ mutated, but pass a new version of themselves through callbacks. This means any mutation bugs with rendering off your remote data instances are not a concern, and that this library can play nicely with React, Redux and others.

## Example

```js
import RemoteData from 'remote-data';

const githubPerson = new RemoteData({
  url: username => `https://api.github.com/users/${username}`,
  onChange: remoteData => console.log('State changed!', remoteData)
});

// then later on

githubPerson.fetch('jackfranklin').then((remoteData) => {
  // it worked fine
  console.log(remoteData.isSuccess()) // true
  console.log(remoteData.data) // github api data
  console.log(remoteData.response.status) // 200
}).catch((remoteData) => {
  // something went wrong
  console.log(remoteData.isSuccess()) // false
  console.log(remoteData.isFailure()) // true
  console.log(remoteData.data) // error info
  console.log(remoteData.response.status) // response status code
});
```

## API

### Creating `RemoteData` instances

The configuration you can provide when creating a new instance of RemoteData are as follows:

```js
const instance = new RemoteData({
  url: (name) => `https://api.github.com/users/${username}`
  onChange: (newInstance) => {...},
  parse: (response) => response.json,
  fetchOptions: {}
});
```

These are fully documented below:

- `url: String | Function`: if given a string, this will be the URL that the request is made to. If it's a function it will be called when `fetch` is called, passing any arguments through. For example, `remoteData.fetch('jack')` will call the `url` function, passing `jack` as the argument.

- `onChange: Function`: a function called whenever the state of a remote data instance changes. This is passed in the new RemoteData instance.

- `parse: Function`: a function used to parse the `Response` from the HTTP request. Defaults to `response.json()`.

- `fetchOptions: Object`: an object that is passed through to `fetch` and allows you to configure headers and any other request options.

### Making Requests

To make a request, call `fetch` on the `RemoteData` instance:

```js
const githubPerson = new RemoteData({
  url: name => `https://api.github.com/users/${username}`,
  onChange: newGithubPerson => console.log(newGithubPerson)
});

githubPerson.fetch('jackfranklin')
```

A promise is returned and the value it will resolve to is the new `RemoteData` instance:

```js
githubPerson.fetch('jackfranklin').then(newData => {
  console.log(newData.data) // GitHub API data, parsed from JSON
  console.log(newData.response.status) // status code
  console.log(newData.state) // 'SUCCESS'
});
```

### Checking the status of a request

You can call any of the following methods:

- `isFinished()` : true if a request has succeeded or failed.
- `isNotAsked()` : true if the request hasn't been asked for (this is the default state).
- `isPending()`
- `isFailure()`
- `isSuccess()`

You can call `.data` on a request to access the data, but be aware that this _will throw an error_ if the request hasn't been asked for or is pending.

You can call `.response` on a request to access the response, but be aware that this _will throw an error_ if the request hasn't been asked for or is pending.
