export interface Service {
  id: string
  name: string
  duration: number // minutes
  price: number // euros
  description: string
}

export interface Appointment {
  id: string
  serviceId: string
  serviceName: string
  duration: number
  price: number
  date: string // YYYY-MM-DD
  time: string // HH:MM
  clientName: string
  clientPhone: string
  createdAt: string // ISO
  status: 'confirmed' | 'cancelled'
}

export interface BlockedSlot {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  reason?: string
}

export interface DayOption {
  date: string // YYYY-MM-DD
  weekday: string
  dayNumber: string
  month: string
  isToday: boolean
}
