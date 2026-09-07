import { Clock, Scissors, Sparkles, Zap } from 'lucide-react'
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
    <div>
      {SERVICES.map((service) => {
        const Icon = ICONS[service.id] ?? Scissors
        const isActive = selected?.id === service.id
        const isRecommended = service.id === RECOMMENDED_ID
        return (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`row w-full text-left py-4 flex items-center gap-3.5 pl-3 pr-1 -mx-1 rounded-lg transition-colors ${
              isActive ? 'bg-violet/[0.08]' : ''
            }`}
          >
            <span
              className={`w-[3px] self-stretch rounded-full ${isActive ? 'bg-violet' : 'bg-transparent'}`}
            />
            <Icon size={18} className={isActive ? 'text-violet-light' : 'text-white/40'} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-bone">{service.name}</p>
                {isRecommended && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-violet-light border border-violet/40 rounded-full px-1.5 py-0.5">
                    Top
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-0.5 leading-snug">{service.description}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-white/30">
                <Clock size={11} />
                <span>{service.duration} min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 pl-1">
              <span className="font-display text-xl text-bone tracking-wide leading-none">
                {service.price}€
              </span>
              <span
                className={`w-4 h-4 rounded-full border ${
                  isActive ? 'bg-violet border-violet' : 'border-white/20'
                }`}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
