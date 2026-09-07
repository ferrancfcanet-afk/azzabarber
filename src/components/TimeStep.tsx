import { useMemo } from 'react'
import { Sun, Sunset } from 'lucide-react'
import { getCandidateSlots, isSlotAvailable } from '../lib/dates'
import { getOccupiedIntervals } from '../lib/availability'

interface Props {
  date: string
  durationMinutes: number
  selected: string | null
  onSelect: (time: string) => void
  /** cambia para forzar recálculo de disponibilidad (p.ej. tras reservar) */
  refreshKey?: number
}

export default function TimeStep({ date, durationMinutes, selected, onSelect, refreshKey }: Props) {
  const { morning, afternoon } = useMemo(() => {
    const occupied = getOccupiedIntervals(date)
    const all = getCandidateSlots(durationMinutes).map((time) => ({
      time,
      available: isSlotAvailable(date, time, durationMinutes, occupied),
    }))
    return {
      morning: all.filter((s) => s.time < '14:00'),
      afternoon: all.filter((s) => s.time >= '14:00'),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, durationMinutes, refreshKey])

  const renderGroup = (
    label: string,
    Icon: typeof Sun,
    slots: { time: string; available: boolean }[],
  ) => (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
        <Icon size={13} />
        {label}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map(({ time, available }) => {
          const isActive = selected === time
          return (
            <button
              key={time}
              disabled={!available}
              onClick={() => onSelect(time)}
              className={`rounded-xl py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-violet-glow text-white shadow-glow-sm'
                  : available
                    ? 'glass text-white/80 active:scale-95'
                    : 'bg-white/[0.02] text-white/20 line-through cursor-not-allowed border border-white/5'
              }`}
            >
              {time}
            </button>
          )
        })}
      </div>
    </div>
  )

  const noSlots = morning.length === 0 && afternoon.length === 0

  return (
    <div className="space-y-5">
      {noSlots && (
        <p className="text-sm text-white/50 text-center py-6">
          No hay franjas disponibles para este servicio ese día.
        </p>
      )}
      {morning.length > 0 && renderGroup('Mañana', Sun, morning)}
      {afternoon.length > 0 && renderGroup('Tarde', Sunset, afternoon)}
    </div>
  )
}
