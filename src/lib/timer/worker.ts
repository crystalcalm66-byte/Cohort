interface TimerMessage {
  type: "start" | "pause" | "reset" | "sync"
  payload?: {
    startedAt?: number
    elapsed?: number
    target?: number
  }
}

let startTime: number | null = null
let elapsedBeforePause = 0
let targetDuration = 0
let running = false

function tick() {
  if (!running || !startTime) return
  const now = Date.now()
  const elapsed = Math.floor((now - startTime) / 1000) + elapsedBeforePause

  if (elapsed >= targetDuration && targetDuration > 0) {
    running = false
    self.postMessage({ type: "completed", elapsed: targetDuration })
    return
  }

  self.postMessage({ type: "tick", elapsed })
  setTimeout(tick, 200)
}

self.onmessage = (e: MessageEvent<TimerMessage>) => {
  const { type, payload } = e.data

  switch (type) {
    case "start":
      startTime = Date.now()
      elapsedBeforePause = payload?.elapsed || 0
      targetDuration = payload?.target || 0
      running = true
      tick()
      self.postMessage({ type: "started", startedAt: startTime })
      break

    case "pause":
      if (running && startTime) {
        elapsedBeforePause += Math.floor((Date.now() - startTime) / 1000)
        running = false
        startTime = null
        self.postMessage({ type: "paused", elapsed: elapsedBeforePause })
      }
      break

    case "reset":
      running = false
      startTime = null
      elapsedBeforePause = 0
      self.postMessage({ type: "reset" })
      break

    case "sync":
      self.postMessage({
        type: "synced",
        running,
        elapsed: elapsedBeforePause,
        startedAt: startTime,
      })
      break
  }
}
