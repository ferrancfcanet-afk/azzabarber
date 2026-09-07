import { useMemo } from 'react'
import { getUpcomingDays } from '../lib/dates'

interface Props {
  selected: string | null
  onSelect: (date: string) => void
}

export default function DateStep({ selected, onSelect }: Props) {
  const days = useMemo(() => getUpcomingDays(), [])

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x-mandatory pb-1 -mx-5 px-5">
      {days.map((day) => {
        const isActive = selected === day.date
        return (
          <button
            key={day.date}
            onClick={() => onSelect(day.date)}
            className={`snap-center shrink-0 w-[4.2rem] rounded-xl py-3 flex flex-col items-center gap-1 border transition-colors ${
              isActive
                ? 'bg-violet border-violet'
                : 'bg-transparent border-white/10 active:bg-white/[0.04]'
            }`}
          >
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold ${
                isActive ? 'text-white/80' : 'text-white/35'
              }`}
            >
              {day.isToday ? 'Hoy' : day.weekday}
            </span>
            <span className={`font-display text-2xl leading-none ${isActive ? 'text-white' : 'text-bone'}`}>
              {day.dayNumber}
            </span>
            <span className={`text-[10px] uppercase ${isActive ? 'text-white/70' : 'text-white/35'}`}>
              {day.month}
            </span>
          </button>
        )
      })}
    </div>
  )
}
