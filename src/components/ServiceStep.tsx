import { Check, Clock, Scissors, Sparkles, Zap } from 'lucide-react'
import { SERVICES } from '../lib/constants'
import type { Service } from '../lib/types'

const ICONS: Record<string, typeof Scissors> = {
  corte: Scissors,
  'corte-barba': Sparkles,
  barba: Zap,
}

const RECOMMENDED_ID = 'corte-barba'

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
        const isRecommended = service.id === RECOMMENDED_ID
        return (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`relative w-full text-left rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-br from-violet-glow/15 to-violet-deep/10 border border-violet-glow/60 shadow-glow-sm'
                : 'glass active:scale-[0.98]'
            }`}
          >
            {isRecommended && !isActive && (
              <span className="absolute -top-2 right-4 text-[9px] font-bold uppercase tracking-wider text-ink-950 bg-gradient-to-r from-gold-light to-gold px-2 py-0.5 rounded-full shadow-glow-gold">
                Recomendado
              </span>
            )}
            <div
              className={`relative grid place-items-center w-12 h-12 rounded-full shrink-0 transition-colors ${
                isActive
                  ? 'bg-gradient-to-br from-violet-glow to-violet-deep shadow-glow-sm'
                  : 'bg-white/[0.05] border border-white/10'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-white/60'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-bone tracking-tight">{service.name}</p>
              <p className="text-xs text-white/45 mt-0.5 leading-snug">{service.description}</p>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-white/35">
                <Clock size={11} />
                <span>{service.duration} min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 pl-1">
              <span className="font-display text-2xl text-violet-glow tracking-wide leading-none">
                {service.price}€
              </span>
              <span
                className={`grid place-items-center w-5 h-5 rounded-full transition-all ${
                  isActive ? 'bg-violet-glow scale-100' : 'bg-transparent scale-0'
                }`}
              >
                <Check size={12} className="text-ink-950" strokeWidth={3} />
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
