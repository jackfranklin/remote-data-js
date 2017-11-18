import { fromPromise } from '../src/index'

it('can be constructed from a promise and be in the loading state', () => {
  const onChange = () => {}
  const prom = new Promise(resolve => resolve({ success: true }))
  const remoteData = fromPromise(prom, { onChange })
  expect(remoteData.isPending()).toBe(true)
})

it('gives the data back when it succeeds', done => {
  const onChange = res => {
    expect(res.isSuccess()).toEqual(true)
    expect(res.data).toEqual({ success: true })
    done()
  }
  const prom = new Promise(resolve => resolve({ success: true }))
  const remoteData = fromPromise(prom, { onChange })
  expect(remoteData.isPending()).toBe(true)
})

it('gives the error back when it fails', done => {
  const onChange = res => {
    expect(res.isFailure()).toEqual(true)
    expect(res.data).toEqual({ error: true })
    done()
  }
  /* eslint-disable prefer-promise-reject-errors */
  const prom = new Promise((resolve, reject) => reject({ error: true }))
  /* eslint-enable prefer-promise-reject-errors */
  fromPromise(prom, { onChange })
})
