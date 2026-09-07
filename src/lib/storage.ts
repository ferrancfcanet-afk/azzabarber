import type { Appointment, BlockedSlot } from './types'

const APPOINTMENTS_KEY = 'azzabarber.appointments'
const BLOCKED_KEY = 'azzabarber.blockedSlots'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getAppointments(): Appointment[] {
  return safeParse<Appointment[]>(localStorage.getItem(APPOINTMENTS_KEY), [])
}

export function saveAppointment(appointment: Appointment): void {
  const all = getAppointments()
  all.push(appointment)
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all))
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): void {
  const all = getAppointments().map((a) => (a.id === id ? { ...a, status } : a))
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all))
}

export function deleteAppointment(id: string): void {
  const all = getAppointments().filter((a) => a.id !== id)
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all))
}

export function getBlockedSlots(): BlockedSlot[] {
  return safeParse<BlockedSlot[]>(localStorage.getItem(BLOCKED_KEY), [])
}

export function addBlockedSlot(slot: BlockedSlot): void {
  const all = getBlockedSlots()
  all.push(slot)
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(all))
}

export function removeBlockedSlot(id: string): void {
  const all = getBlockedSlots().filter((b) => b.id !== id)
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(all))
}

export function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
