import test from 'blue-tape'
import {create, push} from '../../app/utils/promise-buffer'

const timeout = (callback) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback(true) // eslint-disable-line
      resolve()
    }, 100)
  })
}

test('async buffer.push x2 should proved results in order', (t) => {
  t.plan(1)
  const buffer = create()
  const callbackResults = []

  setTimeout(() => {
    t.deepEqual(callbackResults, [
      '1',
      '2',
    ])
  }, 250)

  push(buffer, {
    type: '1',
    callback: () => {timeout(() => callbackResults.push('1'))},
  })
  push(buffer, {
    type: '2',
    callback: () => {timeout(() => callbackResults.push('2'))},
  })
})

test('async buffer.push x6 should proved results in order', (t) => {
  t.plan(1)
  const buffer = create()
  const callbackResults = []

  setTimeout(() => {
    t.deepEqual(callbackResults, [
      '1',
      '1',
      '2',
      '2',
      '3',
      '3',
    ])
  }, 350)

  push(buffer, {
    type: '1',
    callback: () => {return timeout(() => callbackResults.push('1'))},
  })
  push(buffer, {
    type: '1',
    callback: () => {return timeout(() => callbackResults.push('1'))},
  })
  push(buffer, {
    type: '2',
    callback: () => {return timeout(() => callbackResults.push('2'))},
  })
  push(buffer, {
    type: '2',
    callback: () => {return timeout(() => callbackResults.push('2'))},
  })
  push(buffer, {
    type: '3',
    callback: () => {return timeout(() => callbackResults.push('3'))},
  })
  push(buffer, {
    type: '3',
    callback: () => {return timeout(() => callbackResults.push('3'))},
  })
})
