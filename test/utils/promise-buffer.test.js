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
