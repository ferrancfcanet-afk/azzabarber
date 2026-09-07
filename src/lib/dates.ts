import {
  AFTERNOON_END,
  AFTERNOON_START,
  CLOSED_WEEKDAY,
  DAYS_TO_SHOW,
  MORNING_END,
  MORNING_START,
  SLOT_STEP_MINUTES,
} from './constants'
import type { DayOption } from './types'

const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Próximos N días hábiles (excluyendo domingos), empezando hoy. */
export function getUpcomingDays(count: number = DAYS_TO_SHOW): DayOption[] {
  const days: DayOption[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  const today = toDateKey(cursor)

  while (days.length < count) {
    if (cursor.getDay() !== CLOSED_WEEKDAY) {
      const key = toDateKey(cursor)
      days.push({
        date: key,
        weekday: WEEKDAYS[cursor.getDay()],
        dayNumber: String(cursor.getDate()),
        month: MONTHS[cursor.getMonth()],
        isToday: key === today,
      })
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Genera las franjas horarias candidatas para un día y duración de servicio dados. */
export function getCandidateSlots(durationMinutes: number): string[] {
  const slots: string[] = []
  const ranges: [string, string][] = [
    [MORNING_START, MORNING_END],
    [AFTERNOON_START, AFTERNOON_END],
  ]

  for (const [start, end] of ranges) {
    const startMin = timeToMinutes(start)
    const endMin = timeToMinutes(end)
    for (let t = startMin; t + durationMinutes <= endMin; t += SLOT_STEP_MINUTES) {
      slots.push(minutesToTime(t))
    }
  }
  return slots
}

export interface Interval {
  start: number
  end: number
}

/** true si [aStart,aEnd) se solapa con [bStart,bEnd) */
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

export function isSlotAvailable(
  date: string,
  time: string,
  durationMinutes: number,
  occupied: Interval[],
): boolean {
  const start = timeToMinutes(time)
  const end = start + durationMinutes

  // No permitir horas pasadas si el día es hoy
  const now = new Date()
  if (date === toDateKey(now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    if (start <= nowMinutes) return false
  }

  return !occupied.some((iv) => overlaps(start, end, iv.start, iv.end))
}

export function timeStrToMinutes(time: string): number {
  return timeToMinutes(time)
}

export function formatLongDate(key: string): string {
  const d = parseDateKey(key)
  const weekdayFull = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
  ][d.getDay()]
  const monthFull = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ][d.getMonth()]
  const text = `${weekdayFull} ${d.getDate()} de ${monthFull}`
  return text.charAt(0).toUpperCase() + text.slice(1)
}
