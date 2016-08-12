import React from 'react'
import {create, push} from '../promise-buffer'

const timeout = (msg, setState) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`async/await done callback:${msg}`, (new Date()).getSeconds())
      setState(({animationsRun}) => {
        return {animationsRun: [...animationsRun, msg]}
      })
      resolve()
    }, 1000)
  })
}

export default class Hello extends React.Component {
  componentWillMount() {
    this.buffer = create()
    this.setState({animationsRun: []})
  }
  add() {
    push(this.buffer, {
      type: 'add-animation',
      callback: () => {
        return timeout('add-animation', this.setState.bind(this))
      },
    })
  }
  move() {
    push(this.buffer, {
      type: 'move-animation',
      callback: () => {
        return timeout('move-animation', this.setState.bind(this))
      },
    })
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
