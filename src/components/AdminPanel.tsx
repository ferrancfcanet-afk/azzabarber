import { useEffect, useState } from 'react'
import {
  CalendarClock,
  ChevronLeft,
  Image as ImageIcon,
  Lock,
  LogOut,
  Settings,
  ShieldCheck,
  Sliders,
  Store,
  X,
} from 'lucide-react'
import { getAdminSession, signInAdmin, signOutAdmin } from '../lib/api'
import AdminAppointments from './admin/AdminAppointments'
import AdminHours from './admin/AdminHours'
import AdminServices from './admin/AdminServices'
import AdminGallery from './admin/AdminGallery'
import AdminSettings from './admin/AdminSettings'

interface Props {
  onClose: () => void
}

/** Pantalla principal del Modo Barbero: Citas es lo primero que se ve (como
 * una app de calendario); Ajustes queda como una segunda pantalla debajo,
 * con sus propias sub-secciones. Así, si el dueño se pone un acceso directo
 * en el iPhone, lo que abre de primeras son sus citas. */
type Screen = 'citas' | 'ajustes'
type SettingsTab = 'horario' | 'servicios' | 'fotos' | 'negocio'

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: typeof CalendarClock }[] = [
  { id: 'horario', label: 'Horario', icon: Sliders },
  { id: 'servicios', label: 'Servicios', icon: ShieldCheck },
  { id: 'fotos', label: 'Fotos', icon: ImageIcon },
  { id: 'negocio', label: 'Negocio', icon: Store },
]

export default function AdminPanel({ onClose }: Props) {
  const [checkingSession, setCheckingSession] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [error, setError] = useState(false)
  const [screen, setScreen] = useState<Screen>('citas')
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('horario')

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
    setScreen('citas')
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto min-h-full px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            {unlocked && screen === 'ajustes' ? (
              <button
                onClick={() => setScreen('citas')}
                className="grid place-items-center w-8 h-8 -ml-1.5 rounded-full text-white/60 active:bg-white/[0.06]"
                aria-label="Volver a citas"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <ShieldCheck size={18} className="text-violet-light" />
            )}
            <h2 className="font-display text-2xl tracking-wide text-bone">
              {!unlocked ? 'Modo Barbero' : screen === 'citas' ? 'Citas' : 'Ajustes'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {unlocked && screen === 'citas' && (
              <button
                onClick={() => setScreen('ajustes')}
                className="grid place-items-center w-9 h-9 rounded-full border border-white/10 text-white/50"
                aria-label="Ajustes"
              >
                <Settings size={15} />
              </button>
            )}
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
        ) : screen === 'citas' ? (
          <AdminAppointments />
        ) : (
          <div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-6 -mx-5 px-5">
              {SETTINGS_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSettingsTab(id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    settingsTab === id
                      ? 'bg-violet text-white'
                      : 'border border-white/10 text-white/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {settingsTab === 'horario' && <AdminHours />}
            {settingsTab === 'servicios' && <AdminServices />}
            {settingsTab === 'fotos' && <AdminGallery />}
            {settingsTab === 'negocio' && <AdminSettings />}
          </div>
        )}
      </div>
    </div>
  )
}
