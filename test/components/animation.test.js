import React from 'react'
import test from 'blue-tape'
import {shallow} from 'enzyme'
import Animation from '../../app/components/animation'

test('animations to run in order', (t) => {
  const animationComponent = shallow(<Animation />)

  animationComponent.find('#add').simulate('click')
  animationComponent.find('#add').simulate('click')
  animationComponent.find('#move').simulate('click')
  animationComponent.find('#add').simulate('click')

  setTimeout(function () {
    t.deepEqual(animationComponent.state('animationsRun'), [
      'add-animation',
      'add-animation',
      'move-animation',
      'add-animation',
    ])
    t.end()
  }, 1000);
})
