import type { DayHours, DayOption, Interval } from './types'

const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]
const SLOT_STEP_MINUTES = 15

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

/** Normaliza "10:00:00" (formato time de Postgres) a "10:00". */
export function normalizeTime(t: string): string {
  return t.slice(0, 5)
}

/** Próximos N días hábiles según el horario configurado, empezando hoy. */
export function getUpcomingDays(hours: DayHours[], count = 7): DayOption[] {
  const days: DayOption[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  const today = toDateKey(cursor)
  const closedWeekdays = new Set(hours.filter((h) => h.closed).map((h) => h.weekday))

  let guard = 0
  while (days.length < count && guard < 60) {
    guard++
    if (!closedWeekdays.has(cursor.getDay())) {
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
  const [h, m] = normalizeTime(time).split(':').map(Number)
  return h * 60 + m
}

export { timeToMinutes as timeStrToMinutes }

/** Franjas candidatas para un día (según su horario) y duración de servicio. */
export function getCandidateSlots(durationMinutes: number, dayHours: DayHours | undefined): string[] {
  if (!dayHours || dayHours.closed) return []
  const ranges: [string, string][] = []
  if (dayHours.morning_start && dayHours.morning_end) {
    ranges.push([dayHours.morning_start, dayHours.morning_end])
  }
  if (dayHours.afternoon_start && dayHours.afternoon_end) {
    ranges.push([dayHours.afternoon_start, dayHours.afternoon_end])
  }

  const slots: string[] = []
  for (const [start, end] of ranges) {
    const startMin = timeToMinutes(start)
    const endMin = timeToMinutes(end)
    for (let t = startMin; t + durationMinutes <= endMin; t += SLOT_STEP_MINUTES) {
      slots.push(minutesToTime(t))
    }
  }
  return slots
}

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

  const now = new Date()
  if (date === toDateKey(now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    if (start <= nowMinutes) return false
  }

  return !occupied.some((iv) => overlaps(start, end, iv.start, iv.end))
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

export const WEEKDAY_NAMES_FULL = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
]
