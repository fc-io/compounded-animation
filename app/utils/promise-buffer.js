export const create = () => {
  return {
    runningType: undefined,
    running: [],
    waiting: [],
  }
}

export const push = (buffer, a) => {
  if (a.type === buffer.runningType) {
    buffer.running.push(a.callback())
  } else {
    buffer.runningType = null
    buffer.waiting.push(a)
    if (buffer.waiting.length === 1) {
      Promise
        .all(buffer.running)
        .then(() => {
          buffer.running = []
          if (!buffer.runningType) {
            buffer.runningType = buffer.waiting[0].type
          }
          const aBuffer = buffer.waiting
          buffer.waiting = []
          aBuffer.forEach(push.bind(undefined, buffer))
        })
    }
  }
}
