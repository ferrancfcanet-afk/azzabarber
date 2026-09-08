export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  position: number
  active: boolean
  featured: boolean
}

export interface Appointment {
  id: string
  service_id: string | null
  service_name: string
  duration_minutes: number
  price: number
  appt_date: string // YYYY-MM-DD
  appt_time: string // HH:MM(:SS)
  client_name: string
  client_phone: string
  status: 'confirmed' | 'cancelled'
  created_at: string
}

export interface BlockedSlot {
  id: string
  block_date: string
  block_time: string
  reason: string | null
}

/** Horario ya resuelto para un día concreto (tras aplicar la rotación). */
export interface DayHours {
  weekday: number // 0 domingo .. 6 sábado
  closed: boolean
  morning_start: string | null
  morning_end: string | null
  afternoon_start: string | null
  afternoon_end: string | null
}

/** Una fila del horario tal como se guarda: por semana del ciclo y día. */
export interface ScheduleWeekDay extends DayHours {
  week_index: number
}

export interface PublicSettings {
  business_name: string
  instagram_handle: string
  whatsapp_number: string
  address: string
  profile_photo_url: string
  /** Nº de semanas del ciclo de horario (1 = fijo, 2 = alterna cada semana...). */
  rotation_weeks: number
  /** Lunes de referencia que marca el inicio de la semana 0 del ciclo. */
  rotation_anchor: string
}

export interface GalleryImage {
  id: string
  url: string
  position: number
}

export interface DayOption {
  date: string // YYYY-MM-DD
  weekday: string
  dayNumber: string
  month: string
  isToday: boolean
}

export interface Interval {
  start: number
  end: number
}
