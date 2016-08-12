import React from 'react'
import test from 'blue-tape'
import {shallow} from 'enzyme'
import AsyncAwaitAnimation from '../../app/components/async-await-animation'

test('animations to run in order', (t) => {
  const animationComponent = shallow(<AsyncAwaitAnimation />)

  animationComponent.find('#add').simulate('click')
  animationComponent.find('#add').simulate('click')
  animationComponent.find('#move').simulate('click')
  animationComponent.find('#move').simulate('click')
  animationComponent.find('#add').simulate('click')
  animationComponent.find('#add').simulate('click')

  setTimeout(() => {
    t.deepEqual(animationComponent.state('animationsRun'), [
      'add-animation',
      'add-animation',
    ])
  }, 1500)

  setTimeout(() => {
    t.deepEqual(animationComponent.state('animationsRun'), [
      'add-animation',
      'add-animation',
      'move-animation',
      'move-animation',
    ])
  }, 2500)

  setTimeout(() => {
    t.deepEqual(animationComponent.state('animationsRun'), [
      'add-animation',
      'add-animation',
      'move-animation',
      'move-animation',
      'add-animation',
      'add-animation',
    ])
    t.end()
  }, 3500)
})
