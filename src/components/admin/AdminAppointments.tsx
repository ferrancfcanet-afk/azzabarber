import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, Phone, Trash2, XCircle } from 'lucide-react'
import {
  addBlockedSlot,
  deleteAppointment,
  getAllAppointments,
  getBlockedSlots,
  removeBlockedSlot,
  updateAppointmentStatus,
} from '../../lib/api'
import { formatLongDate, getUpcomingDays, parseDateKey } from '../../lib/dates'
import { useAppData } from '../../lib/AppDataContext'
import type { Appointment, BlockedSlot } from '../../lib/types'

function rangeMinutes(start: string | null, end: string | null): number {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return eh * 60 + em - (sh * 60 + sm)
}

export default function AdminAppointments() {
  const { hours } = useAppData()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [blocked, setBlocked] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [blockDate, setBlockDate] = useState('')
  const [blockTime, setBlockTime] = useState('')
  const [blockReason, setBlockReason] = useState('')

  const refresh = () => {
    Promise.all([getAllAppointments(), getBlockedSlots()]).then(([a, b]) => {
      setAppointments(a)
      setBlocked(b)
      setLoading(false)
    })
  }

  useEffect(refresh, [])

  const grouped = useMemo(() => {
    const sorted = [...appointments].sort((a, b) =>
      a.appt_date === b.appt_date
        ? a.appt_time.localeCompare(b.appt_time)
        : a.appt_date.localeCompare(b.appt_date),
    )
    const map = new Map<string, Appointment[]>()
    for (const appt of sorted) {
      const list = map.get(appt.appt_date) ?? []
      list.push(appt)
      map.set(appt.appt_date, list)
    }
    return Array.from(map.entries())
  }, [appointments])

  const occupancy = useMemo(() => {
    const days = getUpcomingDays(hours, 7)
    return days.map((day) => {
      const dayHours = hours.find((h) => h.weekday === parseDateKey(day.date).getDay())
      const totalMinutes = dayHours
        ? rangeMinutes(dayHours.morning_start, dayHours.morning_end) +
          rangeMinutes(dayHours.afternoon_start, dayHours.afternoon_end)
        : 0
      const bookedMinutes =
        appointments
          .filter((a) => a.appt_date === day.date && a.status === 'confirmed')
          .reduce((sum, a) => sum + a.duration_minutes, 0) +
        blocked.filter((b) => b.block_date === day.date).length * 30
      const pct = totalMinutes > 0 ? Math.min(100, Math.round((bookedMinutes / totalMinutes) * 100)) : 0
      return { ...day, pct }
    })
  }, [hours, appointments, blocked])

  const handleBlock = async () => {
    if (!blockDate || !blockTime) return
    await addBlockedSlot(blockDate, blockTime, blockReason.trim())
    setBlockTime('')
    setBlockReason('')
    refresh()
  }

  if (loading) return <p className="text-sm text-white/35 text-center py-10">Cargando…</p>

  return (
    <div className="space-y-6">
      {/* Ocupación */}
      <div className="panel rounded-2xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-3">
          Ocupación · próximos 7 días
        </p>
        <div className="space-y-2">
          {occupancy.map((day) => (
            <div key={day.date} className="flex items-center gap-3 text-xs">
              <span className="w-16 text-white/50 shrink-0">
                {day.isToday ? 'Hoy' : `${day.weekday} ${day.dayNumber}`}
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-violet rounded-full transition-all"
                  style={{ width: `${day.pct}%` }}
                />
              </div>
              <span className="w-9 text-right text-white/60 font-semibold">{day.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bloquear horario */}
      <div className="panel rounded-2xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-3 flex items-center gap-1.5">
          <CalendarClock size={13} /> Bloquear horario
        </p>
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <input
            type="date"
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
            className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5 text-sm text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
          />
          <input
            type="time"
            value={blockTime}
            onChange={(e) => setBlockTime(e.target.value)}
            className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5 text-sm text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
          />
        </div>
        <input
          type="text"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          placeholder="Motivo (opcional)"
          className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5 text-sm text-bone placeholder-white/30 outline-none focus:border-violet/60 mb-2.5"
        />
        <button
          onClick={handleBlock}
          disabled={!blockDate || !blockTime}
          className="w-full rounded-lg py-2.5 text-sm font-semibold bg-white/[0.04] text-white/80 disabled:text-white/20 enabled:hover:bg-white/[0.08] transition-colors"
        >
          Bloquear franja
        </button>

        {blocked.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {blocked.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between text-xs bg-white/[0.03] rounded-lg px-3 py-2"
              >
                <span className="text-white/55">
                  {b.block_date} · {b.block_time}
                  {b.reason ? ` — ${b.reason}` : ''}
                </span>
                <button
                  onClick={() => removeBlockedSlot(b.id).then(refresh)}
                  className="text-white/35 hover:text-red-400 transition-colors"
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-3 px-1">
          Citas guardadas ({appointments.length})
        </p>
        {grouped.length === 0 && (
          <p className="text-sm text-white/35 text-center py-10">Todavía no hay citas.</p>
        )}
        <div className="space-y-4">
          {grouped.map(([date, list]) => (
            <div key={date}>
              <p className="text-xs text-violet-light font-semibold mb-2 px-1">
                {formatLongDate(date)}
              </p>
              <div className="space-y-2">
                {list.map((appt) => (
                  <div key={appt.id} className="panel rounded-xl p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-bone truncate">
                          {appt.appt_time.slice(0, 5)} · {appt.service_name}
                        </p>
                        <p className="text-xs text-white/45 mt-0.5">{appt.client_name}</p>
                        <a
                          href={`tel:${appt.client_phone}`}
                          className="text-xs text-white/35 flex items-center gap-1 mt-0.5"
                        >
                          <Phone size={11} /> {appt.client_phone}
                        </a>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
                          appt.status === 'confirmed'
                            ? 'bg-violet/15 text-violet-light'
                            : 'bg-white/[0.06] text-white/40'
                        }`}
                      >
                        {appt.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {appt.status === 'confirmed' ? (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'cancelled').then(refresh)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/[0.04] py-2 text-xs text-white/65 hover:bg-white/[0.08] transition-colors"
                        >
                          <XCircle size={13} /> Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'confirmed').then(refresh)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/[0.04] py-2 text-xs text-white/65 hover:bg-white/[0.08] transition-colors"
                        >
                          <CheckCircle2 size={13} /> Reactivar
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppointment(appt.id).then(refresh)}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 text-red-400 py-2 px-3 text-xs hover:bg-red-500/15 transition-colors"
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
  )
}
