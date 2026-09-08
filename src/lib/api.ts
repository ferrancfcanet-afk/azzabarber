import { ADMIN_EMAIL, supabase } from './supabase'
import { normalizeTime } from './dates'
import type {
  Appointment,
  BlockedSlot,
  GalleryImage,
  Interval,
  PublicSettings,
  ScheduleWeekDay,
  Service,
} from './types'

// ── Datos públicos (visibles sin iniciar sesión) ─────────────────────────

export async function getPublicSettings(): Promise<PublicSettings> {
  const { data, error } = await supabase.from('public_settings').select('*').single()
  if (error) throw error
  return data as PublicSettings
}

export async function getScheduleWeeks(): Promise<ScheduleWeekDay[]> {
  const { data, error } = await supabase
    .from('schedule_weeks')
    .select('*')
    .order('week_index')
    .order('weekday')
  if (error) throw error
  return (data ?? []).map((h) => ({
    ...h,
    morning_start: h.morning_start ? normalizeTime(h.morning_start) : null,
    morning_end: h.morning_end ? normalizeTime(h.morning_end) : null,
    afternoon_start: h.afternoon_start ? normalizeTime(h.afternoon_start) : null,
    afternoon_end: h.afternoon_end ? normalizeTime(h.afternoon_end) : null,
  }))
}

export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('position')
  if (error) throw error
  return data as Service[]
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from('gallery_images').select('*').order('position')
  if (error) throw error
  return data as GalleryImage[]
}

export async function getOccupiedIntervals(date: string): Promise<Interval[]> {
  const { data, error } = await supabase.rpc('get_occupied_intervals', { p_date: date })
  if (error) throw error
  return (data ?? []).map((r: { start_minutes: number; end_minutes: number }) => ({
    start: r.start_minutes,
    end: r.end_minutes,
  }))
}

export async function createAppointment(input: {
  service: Service
  date: string
  time: string
  clientName: string
  clientPhone: string
}): Promise<Appointment> {
  const appt = {
    id: crypto.randomUUID(),
    service_id: input.service.id,
    service_name: input.service.name,
    duration_minutes: input.service.duration_minutes,
    price: input.service.price,
    appt_date: input.date,
    appt_time: input.time,
    client_name: input.clientName,
    client_phone: input.clientPhone,
    status: 'confirmed' as const,
  }
  const { error } = await supabase.from('appointments').insert(appt)
  if (error) throw error
  return { ...appt, created_at: new Date().toISOString() }
}

// ── Autenticación del dueño (PIN = contraseña de una cuenta fija) ────────

export async function signInAdmin(pin: string) {
  return supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: pin })
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signOutAdmin() {
  await supabase.auth.signOut()
}

// ── Panel de administración (requiere sesión) ────────────────────────────

export async function getAllAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appt_date')
    .order('appt_time')
  if (error) throw error
  return (data ?? []).map((a) => ({ ...a, appt_time: normalizeTime(a.appt_time) }))
}

export async function updateAppointmentStatus(id: string, status: 'confirmed' | 'cancelled') {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) throw error
}

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const { data, error } = await supabase.from('blocked_slots').select('*').order('block_date')
  if (error) throw error
  return (data ?? []).map((b) => ({ ...b, block_time: normalizeTime(b.block_time) }))
}

export async function addBlockedSlot(date: string, time: string, reason: string) {
  const { error } = await supabase
    .from('blocked_slots')
    .insert({ block_date: date, block_time: time, reason: reason || null })
  if (error) throw error
}

export async function removeBlockedSlot(id: string) {
  const { error } = await supabase.from('blocked_slots').delete().eq('id', id)
  if (error) throw error
}

export async function updateScheduleWeekDay(
  weekIndex: number,
  weekday: number,
  patch: Partial<Omit<ScheduleWeekDay, 'week_index' | 'weekday'>>,
) {
  const { error } = await supabase
    .from('schedule_weeks')
    .update(patch)
    .eq('week_index', weekIndex)
    .eq('weekday', weekday)
  if (error) throw error
}

export async function addScheduleWeek(weekIndex: number, days: Omit<ScheduleWeekDay, 'week_index'>[]) {
  const rows = days.map((d) => ({ ...d, week_index: weekIndex }))
  const { error } = await supabase.from('schedule_weeks').upsert(rows, {
    onConflict: 'week_index,weekday',
  })
  if (error) throw error
}

export async function removeScheduleWeek(weekIndex: number) {
  const { error } = await supabase.from('schedule_weeks').delete().eq('week_index', weekIndex)
  if (error) throw error
}

export async function updateRotationConfig(rotationWeeks: number, rotationAnchor: string) {
  const { error } = await supabase
    .from('settings')
    .update({ rotation_weeks: rotationWeeks, rotation_anchor: rotationAnchor })
    .eq('id', true)
  if (error) throw error
}

export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase.from('services').select('*').order('position')
  if (error) throw error
  return data as Service[]
}

export async function upsertService(service: Partial<Service> & { id?: string }) {
  if (service.id) {
    const { id, ...patch } = service
    const { error } = await supabase.from('services').update(patch).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('services').insert(service)
    if (error) throw error
  }
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

export async function updateSettings(patch: Partial<PublicSettings>) {
  const { error } = await supabase.from('settings').update(patch).eq('id', true)
  if (error) throw error
}

export async function getIcsFeedUrl(): Promise<string> {
  const { data, error } = await supabase.from('settings').select('ics_feed_token').single()
  if (error) throw error
  return `https://rpedvcnlbizrnxspezya.supabase.co/functions/v1/calendar-feed?token=${data.ics_feed_token}`
}

export async function addGalleryImage(url: string, position: number) {
  const { error } = await supabase.from('gallery_images').insert({ url, position })
  if (error) throw error
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase.from('gallery_images').delete().eq('id', id)
  if (error) throw error
}

/** Sube una imagen al bucket "media" y devuelve su URL pública. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}
