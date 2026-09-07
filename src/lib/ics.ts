import { ADDRESS, BRAND_NAME } from './constants'
import { parseDateKey } from './dates'
import type { Appointment } from './types'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Fecha/hora local -> formato UTC básico YYYYMMDDTHHMMSSZ para ICS/Google Calendar. */
function toUtcStamp(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

function getStartEndDates(appt: Appointment): { start: Date; end: Date } {
  const day = parseDateKey(appt.date)
  const [h, m] = appt.time.split(':').map(Number)
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m)
  const end = new Date(start.getTime() + appt.duration * 60_000)
  return { start, end }
}

export function buildGoogleCalendarUrl(appt: Appointment): string {
  const { start, end } = getStartEndDates(appt)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${appt.serviceName} · ${BRAND_NAME}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: `Cita en ${BRAND_NAME} — ${appt.serviceName}. Cliente: ${appt.clientName}.`,
    location: ADDRESS,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildIcsContent(appt: Appointment): string {
  const { start, end } = getStartEndDates(appt)
  const now = new Date()
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//azzabarber//booking//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appt.id}@azzabarber`,
    `DTSTAMP:${toUtcStamp(now)}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${appt.serviceName} · ${BRAND_NAME}`,
    `DESCRIPTION:Cita en ${BRAND_NAME} — ${appt.serviceName}. Cliente: ${appt.clientName}.`,
    `LOCATION:${ADDRESS}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcsFile(appt: Appointment): void {
  const blob = new Blob([buildIcsContent(appt)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `azzabarber-cita-${appt.date}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
