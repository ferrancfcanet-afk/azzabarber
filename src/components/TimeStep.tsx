import { useEffect, useState } from 'react'
import { Sun, Sunset } from 'lucide-react'
import { getOccupiedIntervals } from '../lib/api'
import { getCandidateSlots, isSlotAvailable } from '../lib/dates'
import type { DayHours } from '../lib/types'

interface Props {
  date: string
  getHoursForDate: (dateKey: string) => DayHours | undefined
  durationMinutes: number
  selected: string | null
  onSelect: (time: string) => void
  /** cambia para forzar recálculo de disponibilidad (p.ej. tras reservar) */
  refreshKey?: number
}

export default function TimeStep({
  date,
  getHoursForDate,
  durationMinutes,
  selected,
  onSelect,
  refreshKey,
}: Props) {
  const [loading, setLoading] = useState(true)
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const dayHours = getHoursForDate(date)
    const candidates = getCandidateSlots(durationMinutes, dayHours)

    getOccupiedIntervals(date)
      .then((occupied) => {
        if (cancelled) return
        setSlots(
          candidates.map((time) => ({
            time,
            available: isSlotAvailable(date, time, durationMinutes, occupied),
          })),
        )
      })
      .catch(() => {
        if (!cancelled) setSlots([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [date, getHoursForDate, durationMinutes, refreshKey])

  const morning = slots.filter((s) => s.time < '14:00')
  const afternoon = slots.filter((s) => s.time >= '14:00')

  const renderGroup = (
    label: string,
    Icon: typeof Sun,
    group: { time: string; available: boolean }[],
  ) => (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/35 mb-2.5">
        <Icon size={12} />
        {label}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {group.map(({ time, available }) => {
          const isActive = selected === time
          return (
            <button
              key={time}
              disabled={!available}
              onClick={() => onSelect(time)}
              className={`rounded-lg py-2.5 text-sm font-semibold border transition-colors ${
                isActive
                  ? 'bg-violet border-violet text-white'
                  : available
                    ? 'border-white/10 text-white/70 active:bg-white/[0.04]'
                    : 'border-white/5 text-white/15 line-through cursor-not-allowed'
              }`}
            >
              {time}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (loading) {
    return <p className="text-sm text-white/35 text-center py-6">Consultando disponibilidad…</p>
  }

  const noSlots = morning.length === 0 && afternoon.length === 0

  return (
    <div className="space-y-6">
      {noSlots && (
        <p className="text-sm text-white/45 text-center py-6">
          No hay franjas disponibles para este servicio ese día.
        </p>
      )}
      {morning.length > 0 && renderGroup('Mañana', Sun, morning)}
      {afternoon.length > 0 && renderGroup('Tarde', Sunset, afternoon)}
    </div>
  )
}
