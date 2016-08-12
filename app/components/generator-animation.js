import React from 'react'

let runningType = 'add-animation'
let running = []
let buffer = []

const timeout = (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`generator done callback:${a.type}`, (new Date()).getSeconds())
      a.setState(({animationsRun}) => {
        return {animationsRun: [...animationsRun, a.type]}
      })
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
      if (runningType === null) {
        runningType = aB[0].type
      }
      aBuffer.forEach((aB) => {
        aB.genObj.next(aB)
      })
    })
  }
}

const dataConsumer = function* () {
  while (true) { // eslint-disable-line
    const a = yield
    console.log('dataConsumer', a.type)
    if (a.type === runningType) {
      running.push(timeout(a))
    } else if (a) {
      awaitAnimations(a)
      buffer.push(a)
    } else {
      break
    }
  }

  console.log('generator stop')
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
  componentWillMount() {
    this.setState({animationsRun: []})
  }
  add() {
    // console.log(this.state)
    genObj.next({type: 'add-animation', setState: this.setState.bind(this), genObj})
  }
  move() {
    genObj.next({type: 'move-animation', setState: this.setState.bind(this), genObj})
  }
  exit() {
    genObj.next(false)
  }
  render() {
    return (
      <div>
        <div>
          <button id="add" onClick={this.add.bind(this)}>add</button>
          <button id="move" onClick={this.move.bind(this)}>move</button>
          <button id="exit" onClick={this.exit.bind(this)}>exit</button>
        </div>
        <div className="animationsRun">
          {this.state.animationsRun.map((type, i) => {
            return <div key={i}>{type}</div>
          })}
        </div>
      </div>
    )
  }
}
