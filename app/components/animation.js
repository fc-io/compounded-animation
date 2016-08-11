import React from 'react'

let runningType = 'add-animation'
let running = []
let buffer = []

const timeout = (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('animation done callback:', a.type)
      a.setState(({animationsRun}) => {
        return {animationsRun: [...animationsRun, a.type]}
      })
      resolve()
    }, 200)
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
