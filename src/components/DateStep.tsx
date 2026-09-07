import { useMemo } from 'react'
import { getUpcomingDays } from '../lib/dates'

interface Props {
  selected: string | null
  onSelect: (date: string) => void
}

export default function DateStep({ selected, onSelect }: Props) {
  const days = useMemo(() => getUpcomingDays(), [])

  return (
    <div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x-mandatory pb-1 -mx-5 px-5">
        {days.map((day) => {
          const isActive = selected === day.date
          return (
            <button
              key={day.date}
              onClick={() => onSelect(day.date)}
              className={`snap-center shrink-0 w-[4.4rem] rounded-2xl py-3 flex flex-col items-center gap-1 transition-all glass ${
                isActive
                  ? 'border-violet-glow/70 shadow-glow bg-violet-glow/15'
                  : 'active:scale-95'
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold ${
                  isActive ? 'text-violet-glow' : 'text-white/40'
                }`}
              >
                {day.isToday ? 'Hoy' : day.weekday}
              </span>
              <span className="font-display text-2xl text-white leading-none">
                {day.dayNumber}
              </span>
              <span className="text-[10px] text-white/40 uppercase">{day.month}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
