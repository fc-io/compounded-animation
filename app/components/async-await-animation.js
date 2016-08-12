import React from 'react'

let runningType = 'add-animation'
let running = []
let buffer = []

const timeout = (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`async/await done callback:${a.type}`, (new Date()).getSeconds())
      a.setState(({animationsRun}) => {
        return {animationsRun: [...animationsRun, a.type]}
      })
      resolve()
    }, 1000)
  })
}

// async function awaitAnimations (a) {
//   if (!buffer.length) {
//     runningType = null
//
//     await Promise.all(running)
//     const aBuffer = buffer
//     // buffer = []
//     // running = []
//     // aBuffer.forEach((aB) => {
//     //   if (runningType === null) {
//     //     runningType = aB.type
//     //   }
//       // runOrStack(aB)
//     // })
//   }
// }

const runOrStack = (a) => {
  // console.log(`runOrStack type: ${a.type}, r: ${runningType}`)
  if (a.type === runningType) {
    running.push(timeout(a))
  } else {
    runningType = null
    buffer.push(a)
    if (buffer.length === 1) {
      Promise
        .all(running)
        .then(() => {
          console.log('Promise resolve', buffer.length)
          running = []
          if (!runningType) {
            runningType = buffer[0].type
          }
          const aBuffer = buffer
          buffer = []
          aBuffer.forEach(runOrStack)
        })
    }
  }
}

export default class Hello extends React.Component {
  componentWillMount() {
    this.setState({animationsRun: []})
  }
  add() {
    runOrStack({type: 'add-animation', setState: this.setState.bind(this)})
  }
  move() {
    runOrStack({type: 'move-animation', setState: this.setState.bind(this)})
  }
  exit() {
    // genObj.next(false)
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
