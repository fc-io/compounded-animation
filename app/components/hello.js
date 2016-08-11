import React from 'react'

let running = []
let buffer = []
let runningType = 'add-animation'

const timeout = (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('animation done callback:', a.type)
      resolve()
    }, 1000)
  })
}

const awaitAnimations = (a) => {
  if (!buffer.length) {
    runningType = null

    Promise.all(running).then(() => {
      const aBuffer = buffer
      buffer = []
      running = []
      aBuffer.forEach((aB) => {
        if (runningType === null) {
          runningType = aB.type
        }
        aB.genObj.next(aB)
      })
    })
  }
}

const dataConsumer = function* () {
  while (true) { // eslint-disable-line
    const a = yield
    if (a.type === runningType) {
      running.push(timeout(a))
    } else if (a) {
      awaitAnimations(a)
      buffer.push(a)
    } else {
      break
    }
  }

  console.log('ex')
  return 'dataConsumer exit!'
}

const coroutine = (generatorFunction) => {
  return function (...args) {
    const generatorObject = generatorFunction(...args)
    generatorObject.next(true)
    return generatorObject
  }
}

const c = coroutine(dataConsumer)
const genObj = c()

export default class Hello extends React.Component {
  add() {
    genObj.next({type: 'add-animation', genObj})
  }
  move() {
    genObj.next({type: 'move-animation', genObj})
  }
  exit() {
    genObj.next(false)
  }
  render() {
    return (
      <div>
        <button onClick={this.add}>add</button>
        <button onClick={this.move}>move</button>
        <button onClick={this.exit}>exit</button>
      </div>
    )
  }
}
