import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getActiveServices, getGalleryImages, getPublicSettings, getScheduleWeeks } from './api'
import { resolveDayHours } from './dates'
import type { DayHours, GalleryImage, PublicSettings, ScheduleWeekDay, Service } from './types'

interface AppData {
  settings: PublicSettings | null
  scheduleWeeks: ScheduleWeekDay[]
  services: Service[]
  gallery: GalleryImage[]
  loading: boolean
  error: string | null
  refresh: () => void
  /** Horario ya resuelto (según la rotación configurada) para una fecha dada. */
  getHoursForDate: (dateKey: string) => DayHours | undefined
}

const AppDataContext = createContext<AppData | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings | null>(null)
  const [scheduleWeeks, setScheduleWeeks] = useState<ScheduleWeekDay[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    // Solo la carga inicial (tick === 0) bloquea el render con la pantalla
    // de "Cargando…". Un refresh() posterior (p.ej. tras guardar algo en el
    // panel de administración) actualiza los datos en segundo plano sin
    // desmontar el resto de la app — si no, cualquier guardado en el panel
    // haría parpadear toda la app de vuelta a "Cargando…" y perdería la
    // pestaña/estado en la que estaba el dueño.
    if (tick === 0) setLoading(true)
    setError(null)
    Promise.all([getPublicSettings(), getScheduleWeeks(), getActiveServices(), getGalleryImages()])
      .then(([s, w, sv, g]) => {
        if (cancelled) return
        setSettings(s)
        setScheduleWeeks(w)
        setServices(sv)
        setGallery(g)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Error al cargar los datos')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  const getHoursForDate = useCallback(
    (dateKey: string) =>
      settings
        ? resolveDayHours(dateKey, scheduleWeeks, settings.rotation_weeks, settings.rotation_anchor)
        : undefined,
    [scheduleWeeks, settings],
  )

  return (
    <AppDataContext.Provider
      value={{ settings, scheduleWeeks, services, gallery, loading, error, refresh, getHoursForDate }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de <AppDataProvider>')
  return ctx
}
