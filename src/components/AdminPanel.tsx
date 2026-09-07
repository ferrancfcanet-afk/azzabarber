import { useEffect, useState } from 'react'
import { CalendarClock, Image as ImageIcon, Lock, LogOut, ShieldCheck, Sliders, X } from 'lucide-react'
import { getAdminSession, signInAdmin, signOutAdmin } from '../lib/api'
import AdminAppointments from './admin/AdminAppointments'
import AdminHours from './admin/AdminHours'
import AdminServices from './admin/AdminServices'
import AdminGallery from './admin/AdminGallery'
import AdminSettings from './admin/AdminSettings'

interface Props {
  onClose: () => void
}

type Tab = 'citas' | 'horario' | 'servicios' | 'fotos' | 'ajustes'

const TABS: { id: Tab; label: string; icon: typeof CalendarClock }[] = [
  { id: 'citas', label: 'Citas', icon: CalendarClock },
  { id: 'horario', label: 'Horario', icon: Sliders },
  { id: 'servicios', label: 'Servicios', icon: ShieldCheck },
  { id: 'fotos', label: 'Fotos', icon: ImageIcon },
  { id: 'ajustes', label: 'Ajustes', icon: Sliders },
]

export default function AdminPanel({ onClose }: Props) {
  const [checkingSession, setCheckingSession] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<Tab>('citas')

  useEffect(() => {
    getAdminSession()
      .then((session) => setUnlocked(!!session))
      .finally(() => setCheckingSession(false))
  }, [])

  const handlePinSubmit = async () => {
    const { error: signInError } = await signInAdmin(pinInput)
    if (signInError) {
      setError(true)
    } else {
      setUnlocked(true)
      setError(false)
    }
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setUnlocked(false)
    setPinInput('')
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto min-h-full px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-violet-light" />
            <h2 className="font-display text-2xl tracking-wide text-bone">Modo Barbero</h2>
          </div>
          <div className="flex items-center gap-2">
            {unlocked && (
              <button
                onClick={handleLogout}
                className="grid place-items-center w-9 h-9 rounded-full border border-white/10 text-white/50"
                aria-label="Cerrar sesión"
              >
                <LogOut size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="grid place-items-center w-9 h-9 rounded-full border border-white/10 text-white/60"
              aria-label="Cerrar panel"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {checkingSession ? (
          <p className="text-sm text-white/35 text-center py-16">Comprobando sesión…</p>
        ) : !unlocked ? (
          <div className="panel rounded-2xl p-7 flex flex-col items-center gap-4 mt-12">
            <div className="grid place-items-center w-14 h-14 rounded-full bg-violet/15">
              <Lock size={22} className="text-violet-light" />
            </div>
            <p className="text-sm text-white/50 text-center max-w-[220px]">
              Introduce el PIN para acceder a las citas y gestionar el negocio.
            </p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={12}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value)
                setError(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              placeholder="PIN"
              className={`w-40 text-center tracking-[0.35em] rounded-xl bg-white/[0.03] border px-4 py-3.5 text-lg text-bone outline-none transition-colors ${
                error ? 'border-red-500/60' : 'border-white/10 focus:border-violet/60'
              }`}
              autoFocus
            />
            {error && <p className="text-xs text-red-400">PIN incorrecto</p>}
            <button
              onClick={handlePinSubmit}
              className="w-full rounded-xl bg-violet py-3.5 text-sm font-semibold text-white active:scale-[0.98] transition-transform"
            >
              Entrar
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-6 -mx-5 px-5">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    tab === id
                      ? 'bg-violet text-white'
                      : 'border border-white/10 text-white/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'citas' && <AdminAppointments />}
            {tab === 'horario' && <AdminHours />}
            {tab === 'servicios' && <AdminServices />}
            {tab === 'fotos' && <AdminGallery />}
            {tab === 'ajustes' && <AdminSettings />}
          </div>
        )}
      </div>
    </div>
  )
}
