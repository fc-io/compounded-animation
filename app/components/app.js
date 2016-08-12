import React from 'react'
import GeneratorAnimation from './generator-animation'
import AsyncAwaitAnimation from './async-await-animation'

export default () => {
  return (
    <div>
      Generator
      <GeneratorAnimation />
      Async Await
      <AsyncAwaitAnimation />
    </div>
  )
}
