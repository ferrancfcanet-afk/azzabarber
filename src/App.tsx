import { useState } from 'react'
import { AppDataProvider, useAppData } from './lib/AppDataContext'
import Header from './components/Header'
import Gallery from './components/Gallery'
import BookingFlow from './components/BookingFlow'
import AdminPanel from './components/AdminPanel'

/** Si el dueño abre /admin directamente (p.ej. desde un acceso directo en la
 * pantalla de inicio del iPhone) entramos directo en el Modo Barbero, sin
 * pasar por la web pública — así el acceso directo se comporta como una app
 * propia dedicada a las citas. */
function isAdminRoute(): boolean {
  return window.location.pathname.replace(/\/+$/, '') === '/admin'
}

function AppShell() {
  const [adminOpen, setAdminOpen] = useState(isAdminRoute)
  const { loading, error, refresh } = useAppData()

  const closeAdmin = () => {
    setAdminOpen(false)
    if (isAdminRoute()) {
      window.history.replaceState({}, '', '/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-white/40 text-sm">
        Cargando…
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <p className="text-white/70 text-sm mb-3">No se ha podido cargar la app.</p>
          <button
            onClick={refresh}
            className="rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (adminOpen) {
    return <AdminPanel onClose={closeAdmin} />
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-10">
      <Header />
      <Gallery />
      <BookingFlow />

      <footer className="px-5 mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-white/8" />
          <button
            onClick={() => setAdminOpen(true)}
            className="w-1.5 h-1.5 rounded-full bg-white/15 hover:bg-violet-light transition-colors"
            aria-label="Modo Barbero"
          />
          <span className="h-px w-10 bg-white/8" />
        </div>
        <p className="text-[10px] tracking-wide text-white/20">© AZZABARBER · Mataró</p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  )
}
