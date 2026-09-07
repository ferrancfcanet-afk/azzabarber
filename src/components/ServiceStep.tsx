import { Check, Clock, Scissors, Sparkles, Zap } from 'lucide-react'
import { SERVICES } from '../lib/constants'
import type { Service } from '../lib/types'

const ICONS: Record<string, typeof Scissors> = {
  corte: Scissors,
  'corte-barba': Sparkles,
  barba: Zap,
}

interface Props {
  selected: Service | null
  onSelect: (s: Service) => void
}

export default function ServiceStep({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {SERVICES.map((service) => {
        const Icon = ICONS[service.id] ?? Scissors
        const isActive = selected?.id === service.id
        return (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all glass ${
              isActive
                ? 'border-violet-glow/70 shadow-glow bg-violet-glow/10'
                : 'active:scale-[0.98]'
            }`}
          >
            <div
              className={`grid place-items-center w-12 h-12 rounded-xl shrink-0 ${
                isActive ? 'bg-violet-glow/25' : 'bg-white/5'
              }`}
            >
              <Icon size={22} className={isActive ? 'text-violet-glow' : 'text-white/70'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{service.name}</p>
              <p className="text-xs text-white/50 mt-0.5 truncate">{service.description}</p>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-white/40">
                <Clock size={12} />
                <span>{service.duration} min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-display text-xl text-violet-glow tracking-wide">
                {service.price}€
              </span>
              {isActive && (
                <span className="grid place-items-center w-5 h-5 rounded-full bg-violet-glow">
                  <Check size={12} className="text-ink-950" strokeWidth={3} />
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
