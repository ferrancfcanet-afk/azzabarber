import { useEffect, useMemo, useState } from 'react'
import {
  CalendarClock,
  CheckCircle2,
  Lock,
  Phone,
  ShieldCheck,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import { ADMIN_PIN } from '../lib/constants'
import { formatLongDate } from '../lib/dates'
import {
  addBlockedSlot,
  deleteAppointment,
  genId,
  getAppointments,
  getBlockedSlots,
  removeBlockedSlot,
  updateAppointmentStatus,
} from '../lib/storage'
import type { Appointment, BlockedSlot } from '../lib/types'

interface Props {
  onClose: () => void
}

export default function AdminPanel({ onClose }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [error, setError] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [blocked, setBlocked] = useState<BlockedSlot[]>([])
  const [blockDate, setBlockDate] = useState('')
  const [blockTime, setBlockTime] = useState('')
  const [blockReason, setBlockReason] = useState('')

  const refresh = () => {
    setAppointments(getAppointments())
    setBlocked(getBlockedSlots())
  }

  useEffect(() => {
    if (unlocked) refresh()
  }, [unlocked])

  const grouped = useMemo(() => {
    const sorted = [...appointments].sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    )
    const map = new Map<string, Appointment[]>()
    for (const appt of sorted) {
      const list = map.get(appt.date) ?? []
      list.push(appt)
      map.set(appt.date, list)
    }
    return Array.from(map.entries())
  }, [appointments])

  const handlePinSubmit = () => {
    if (pinInput === ADMIN_PIN) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleBlock = () => {
    if (!blockDate || !blockTime) return
    addBlockedSlot({ id: genId(), date: blockDate, time: blockTime, reason: blockReason.trim() })
    setBlockTime('')
    setBlockReason('')
    refresh()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950/95 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto min-h-full px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-violet-glow" />
            <h2 className="font-display text-xl tracking-wide text-white">Modo Barbero</h2>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center w-9 h-9 rounded-full glass text-white/70"
            aria-label="Cerrar panel"
          >
            <X size={17} />
          </button>
        </div>

        {!unlocked ? (
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4 mt-10">
            <div className="grid place-items-center w-14 h-14 rounded-full bg-violet-glow/20">
              <Lock size={24} className="text-violet-glow" />
            </div>
            <p className="text-sm text-white/60 text-center">
              Introduce el PIN para acceder a las citas y gestionar horarios.
            </p>
            <input
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value)
                setError(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              placeholder="PIN"
              className={`w-32 text-center tracking-[0.5em] rounded-xl glass px-4 py-3 text-lg text-white outline-none ${
                error ? 'border-red-500/70' : 'focus:border-violet-glow/70'
              }`}
              autoFocus
            />
            {error && <p className="text-xs text-red-400">PIN incorrecto</p>}
            <button
              onClick={handlePinSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-violet-glow to-violet-deep py-3 text-sm font-semibold text-white shadow-glow"
            >
              Entrar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bloquear horario */}
            <div className="glass rounded-2xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-1.5">
                <CalendarClock size={14} /> Bloquear horario
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="rounded-xl glass px-3 py-2.5 text-sm text-white outline-none focus:border-violet-glow/70 [color-scheme:dark]"
                />
                <input
                  type="time"
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="rounded-xl glass px-3 py-2.5 text-sm text-white outline-none focus:border-violet-glow/70 [color-scheme:dark]"
                />
              </div>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Motivo (opcional)"
                className="w-full rounded-xl glass px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-violet-glow/70 mb-2.5"
              />
              <button
                onClick={handleBlock}
                disabled={!blockDate || !blockTime}
                className="w-full rounded-xl py-2.5 text-sm font-semibold bg-white/5 text-white/80 disabled:text-white/20 enabled:hover:bg-white/10 transition-colors"
              >
                Bloquear franja
              </button>

              {blocked.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {blocked
                    .slice()
                    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                    .map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between text-xs bg-white/[0.03] rounded-lg px-3 py-2"
                      >
                        <span className="text-white/60">
                          {b.date} · {b.time}
                          {b.reason ? ` — ${b.reason}` : ''}
                        </span>
                        <button
                          onClick={() => {
                            removeBlockedSlot(b.id)
                            refresh()
                          }}
                          className="text-white/40 hover:text-red-400"
                          aria-label="Desbloquear"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Citas */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Citas guardadas ({appointments.length})
              </p>
              {grouped.length === 0 && (
                <p className="text-sm text-white/40 text-center py-8">Todavía no hay citas.</p>
              )}
              <div className="space-y-4">
                {grouped.map(([date, list]) => (
                  <div key={date}>
                    <p className="text-xs text-violet-glow font-semibold mb-2">
                      {formatLongDate(date)}
                    </p>
                    <div className="space-y-2">
                      {list.map((appt) => (
                        <div key={appt.id} className="glass rounded-xl p-3.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {appt.time} · {appt.serviceName}
                              </p>
                              <p className="text-xs text-white/50 mt-0.5">{appt.clientName}</p>
                              <a
                                href={`tel:${appt.clientPhone}`}
                                className="text-xs text-white/40 flex items-center gap-1 mt-0.5"
                              >
                                <Phone size={11} /> {appt.clientPhone}
                              </a>
                            </div>
                            <span
                              className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
                                appt.status === 'confirmed'
                                  ? 'bg-violet-glow/20 text-violet-glow'
                                  : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {appt.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {appt.status === 'confirmed' ? (
                              <button
                                onClick={() => {
                                  updateAppointmentStatus(appt.id, 'cancelled')
                                  refresh()
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-xs text-white/70"
                              >
                                <XCircle size={13} /> Cancelar
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  updateAppointmentStatus(appt.id, 'confirmed')
                                  refresh()
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-xs text-white/70"
                              >
                                <CheckCircle2 size={13} /> Reactivar
                              </button>
                            )}
                            <button
                              onClick={() => {
                                deleteAppointment(appt.id)
                                refresh()
                              }}
                              className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 text-red-400 py-2 px-3 text-xs"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
