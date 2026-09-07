import { BLOCK_DURATION_MINUTES } from './constants'
import { timeStrToMinutes, type Interval } from './dates'
import { getAppointments, getBlockedSlots } from './storage'

export function getOccupiedIntervals(date: string): Interval[] {
  const appointments = getAppointments().filter(
    (a) => a.date === date && a.status === 'confirmed',
  )
  const blocked = getBlockedSlots().filter((b) => b.date === date)

  const fromAppointments: Interval[] = appointments.map((a) => ({
    start: timeStrToMinutes(a.time),
    end: timeStrToMinutes(a.time) + a.duration,
  }))
  const fromBlocked: Interval[] = blocked.map((b) => ({
    start: timeStrToMinutes(b.time),
    end: timeStrToMinutes(b.time) + BLOCK_DURATION_MINUTES,
  }))

  return [...fromAppointments, ...fromBlocked]
}
