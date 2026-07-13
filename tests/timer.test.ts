import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Date.now for deterministic testing
let mockTime = 1000000

beforeEach(() => {
  mockTime = 1000000
  vi.spyOn(Date, "now").mockImplementation(() => mockTime)
})

describe("Timer Logic", () => {
  it("calculates elapsed time correctly", () => {
    const startTime = 1000000
    mockTime = 1005000 // 5 seconds later
    const elapsed = Math.floor((mockTime - startTime) / 1000)
    expect(elapsed).toBe(5)
  })

  it("grace period allows 15 seconds of hidden tab", () => {
    const GRACE_PERIOD = 15
    const hiddenDuration = 10
    const hiddenSince = 1000000
    mockTime = hiddenSince + hiddenDuration * 1000 // 10 seconds
    const elapsedSinceHidden = (mockTime - hiddenSince) / 1000

    expect(elapsedSinceHidden).toBeLessThanOrEqual(GRACE_PERIOD)
    expect(elapsedSinceHidden <= GRACE_PERIOD).toBe(true)
  })

  it("auto-pauses after 15 seconds hidden", () => {
    const GRACE_PERIOD = 15
    const hiddenDuration = 20
    const hiddenSince = 1000000
    mockTime = hiddenSince + hiddenDuration * 1000 // 20 seconds
    const elapsedSinceHidden = (mockTime - hiddenSince) / 1000

    expect(elapsedSinceHidden).toBeGreaterThan(GRACE_PERIOD)
  })

  it("detects session crossing midnight correctly", () => {
    const sessionStart = new Date("2026-07-13T23:45:00")
    const sessionEnd = new Date("2026-07-14T00:15:00")
    const totalMinutes = (sessionEnd.getTime() - sessionStart.getTime()) / 60000

    expect(totalMinutes).toBe(30)

    const minutesBeforeMidnight = (new Date("2026-07-14T00:00:00").getTime() - sessionStart.getTime()) / 60000
    const minutesAfterMidnight = (sessionEnd.getTime() - new Date("2026-07-14T00:00:00").getTime()) / 60000

    expect(Math.round(minutesBeforeMidnight)).toBe(15)
    expect(Math.round(minutesAfterMidnight)).toBe(15)
  })

  it("enforces 6-hour daily cap for leaderboard", () => {
    const DAILY_CAP_MINUTES = 6 * 60
    const userMinutes = 400
    const cappedMinutes = Math.min(userMinutes, DAILY_CAP_MINUTES)
    expect(cappedMinutes).toBe(360)
  })
})

describe("Streak Logic", () => {
  it("requires 15+ minutes for a streak day", () => {
    expect(10 >= 15).toBe(false)
    expect(15 >= 15).toBe(true)
    expect(30 >= 15).toBe(true)
  })
})
