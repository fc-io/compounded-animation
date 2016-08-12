import test from 'blue-tape'
import {create, push} from '../../app/utils/promise-buffer'

test('buffer.create should return a valid object', (t) => {
  t.deepEqual(create(), {
    runningType: undefined,
    running: [],
    waiting: [],
  })
  t.end()
})

test('buffer.push should trigger callback', (t) => {
  t.plan(1)
  const buffer = create()
  push(buffer, {
    type: 'run first',
    callback: t.false,
  })
})

test('buffer.push x2 and same type should trigger 2 callbacks', (t) => {
  t.plan(2)
  const buffer = create()
  push(buffer, {
    type: 'run first',
    callback: t.false,
  })
  push(buffer, {
    type: 'run first',
    callback: t.false,
  })
})

test('buffer.push x2 and different types should trigger 2 callbacks', (t) => {
  t.plan(2)
  const buffer = create()
  push(buffer, {
    type: 'run first',
    callback: t.false,
  })
  push(buffer, {
    type: 'run 2nd',
    callback: t.false,
  })
})
