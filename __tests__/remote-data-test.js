import RemoteData from '../src/index'
import fetchMock from 'fetch-mock'

const mockSuccess = url => fetchMock.mock(url, { success: true })
const mockError = url => fetchMock.mock(url, 404)

const resetAndMockSuccess = url => {
  fetchMock.restore()
  mockSuccess(url)
}

const resetAndMockError = url => {
  fetchMock.restore()
  mockError(url)
}

const resetAndMockWithResponse = (url, response) => {
  fetchMock.restore()
  fetchMock.mock(url, response)
}

const makeInstance = (obj = {}) => {
  const args = Object.assign({}, {
    url: 'api.com/1',
  }, obj)

  return new RemoteData(args)
}

it('Is NOT_ASKED by default', () => {
  expect(new RemoteData().isNotAsked()).toBe(true)
})

describe('defining the URL', () => {
  it('uses a url if it is given one', () => {
    resetAndMockSuccess('api.com/1')

    const instance = makeInstance({
      url: x => `api.com/${x}`,
    })

    return instance.fetch('1').then(() => {
      expect(fetchMock.called('api.com/1')).toBe(true)
    })
  })

  it('uses a string if given a string', () => {
    resetAndMockSuccess('api.com/1')
    const instance = makeInstance()

    return instance.fetch('1').then(() => {
      expect(fetchMock.called('api.com/1')).toBe(true)
    })
  })
})

it('calls onChange twice when there is a successful request', () => {
  resetAndMockSuccess('api.com/1')
  const onChange = jest.fn()
  const instance = makeInstance({ onChange })

  return instance.fetch().then(() => {
    expect(onChange.mock.calls[0][0].isPending()).toBe(true)
    expect(onChange.mock.calls[1][0].isSuccess()).toBe(true)
  })
})

it('calls onChange twice for a failed request', () => {
  resetAndMockError('api.com/1')
  const onChange = jest.fn()
  const instance = makeInstance({ onChange })

  return instance.fetch().then(() => {
    expect(onChange.mock.calls[0][0].isPending()).toBe(true)
    expect(onChange.mock.calls[1][0].isFailure()).toBe(true)
  })
})

it('parses as JSON by default', () => {
  resetAndMockWithResponse('api.com/1', { some: 'json' })
  const instance = makeInstance()

  return instance.fetch().then(result => {
    expect(result.data).toEqual({ some: 'json' })
  })
})

it('allows a custom parser function to be provided', () => {
  resetAndMockWithResponse('api.com/1', 'Hello World')
  const instance = makeInstance({ parse: x => x.text() })

  return instance.fetch().then(result => {
    expect(result.data).toEqual('Hello World')
  })
})

it('provides `response` to allow access to the raw HTTP response', () => {
  resetAndMockWithResponse('api.com/1', { some: 'json' })
  const instance = makeInstance()

  return instance.fetch().then(result => {
    expect(result.data).toEqual({ some: 'json' })
    expect(result.response.status).toEqual(200)
  })
})

it('throws if you access the response when the request is not finished', () => {
  const instance = makeInstance()

  expect(() => instance.response).toThrowError(
    /Cannot get response for request that hasn't finished/
  )
})

it('throws if you try to access the data before it has been fetched', () => {
  const instance = makeInstance()

  expect(() => instance.data).toThrowError(
    /Cannot get data for request that hasn't finished/
  )
})

describe('the case method', () => {
  it('first calls the NotAsked callback', () => {
    const instance = makeInstance()

    const notAsked = jest.fn()
    const otherFn = jest.fn()

    instance.case({
      NotAsked: notAsked,
      Pending: otherFn,
      Failure: otherFn,
      Success: otherFn,
    })

    expect(notAsked).toBeCalled()
    expect(otherFn).not.toBeCalled()
  })

  it('calls the success callback when data has been fetched', () => {
    resetAndMockSuccess('api.com/1')
    const instance = makeInstance()

    const successFn = jest.fn()
    const otherFn = jest.fn()

    return instance.fetch().then(result => {
      result.case({
        NotAsked: otherFn,
        Pending: otherFn,
        Failure: otherFn,
        Success: successFn,
      })

      expect(successFn).toBeCalledWith({ success: true })
      expect(otherFn).not.toBeCalled()
    })
  })

  it('calls the pending callback when the request is in motion', () => {
    resetAndMockSuccess('api.com/1')

    const pendingFn = jest.fn()
    const otherFn = jest.fn()

    let count = 0
    const instance = new RemoteData({
      url: 'api.com/1',
      onChange(remoteData) {
        if (count++ > 0) return

        remoteData.case({
          NotAsked: otherFn,
          Pending: pendingFn,
          Failure: otherFn,
          Success: otherFn,
        })

        expect(pendingFn).toBeCalled()
        expect(otherFn).not.toBeCalled()
      },
    })

    return instance.fetch()
  })

  it('calls the failure callback when the request failed', () => {
    resetAndMockError('api.com/1')

    const instance = makeInstance()

    const failedFn = jest.fn()
    const otherFn = jest.fn()

    return instance.fetch().then(result => {
      result.case({
        NotAsked: otherFn,
        Pending: otherFn,
        Failure: failedFn,
        Success: otherFn,
      })

      expect(failedFn).toBeCalled()
      expect(otherFn).not.toBeCalled()
    })
  })

  it('will call the default callback if none match', () => {
    resetAndMockError('api.com/1')
    const handler = jest.fn()
    const instance = makeInstance()

    instance.case({
      _: handler,
    })

    expect(handler).toBeCalled()
  })

  it('copies the onChange event over when a new remote data instance is created', () => {
    const onChange = jest.fn()
    const instance = makeInstance({
      onChange,
    })

    resetAndMockSuccess('api.com/1')

    return instance.fetch().then((newInstance) => {
      expect(onChange.mock.calls.length).toBe(2)
      expect(newInstance.onChange).toBe(onChange)
    })
  })
})
