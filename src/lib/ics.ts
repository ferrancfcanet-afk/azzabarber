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
  const day = parseDateKey(appt.appt_date)
  const [h, m] = appt.appt_time.slice(0, 5).split(':').map(Number)
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m)
  const end = new Date(start.getTime() + appt.duration_minutes * 60_000)
  return { start, end }
}

export function buildGoogleCalendarUrl(appt: Appointment, businessName: string, address: string): string {
  const { start, end } = getStartEndDates(appt)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${appt.service_name} · ${businessName}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: `Cita en ${businessName} — ${appt.service_name}. Cliente: ${appt.client_name}.`,
    location: address,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildIcsContent(appt: Appointment, businessName: string, address: string): string {
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
    `SUMMARY:${appt.service_name} · ${businessName}`,
    `DESCRIPTION:Cita en ${businessName} — ${appt.service_name}. Cliente: ${appt.client_name}.`,
    `LOCATION:${address}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcsFile(appt: Appointment, businessName: string, address: string): void {
  const blob = new Blob([buildIcsContent(appt, businessName, address)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `azzabarber-cita-${appt.appt_date}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
