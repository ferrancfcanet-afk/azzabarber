import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getActiveServices, getBusinessHours, getGalleryImages, getPublicSettings } from './api'
import type { DayHours, GalleryImage, PublicSettings, Service } from './types'

interface AppData {
  settings: PublicSettings | null
  hours: DayHours[]
  services: Service[]
  gallery: GalleryImage[]
  loading: boolean
  error: string | null
  refresh: () => void
}

const AppDataContext = createContext<AppData | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings | null>(null)
  const [hours, setHours] = useState<DayHours[]>([])
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
    Promise.all([getPublicSettings(), getBusinessHours(), getActiveServices(), getGalleryImages()])
      .then(([s, h, sv, g]) => {
        if (cancelled) return
        setSettings(s)
        setHours(h)
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

  return (
    <AppDataContext.Provider value={{ settings, hours, services, gallery, loading, error, refresh }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de <AppDataProvider>')
  return ctx
}
