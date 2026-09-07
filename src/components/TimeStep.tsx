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
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/35 mb-2.5">
        <Icon size={12} />
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
