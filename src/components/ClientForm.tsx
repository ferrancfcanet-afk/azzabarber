import { Calendar, Clock, Phone, Scissors, User } from 'lucide-react'
import { formatLongDate } from '../lib/dates'
import type { Service } from '../lib/types'

interface Props {
  service: Service
  date: string
  time: string
  name: string
  phone: string
  onNameChange: (v: string) => void
  onPhoneChange: (v: string) => void
}

export default function ClientForm({
  service,
  date,
  time,
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-4 space-y-3 bg-gradient-to-br from-violet-glow/10 to-transparent border border-violet-glow/20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70 mb-0.5">
          Resumen de tu cita
        </p>
        <div className="flex items-center gap-3 text-sm text-bone">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-white/[0.06] shrink-0">
            <Scissors size={13} className="text-violet-glow" />
          </span>
          <span className="flex-1 font-medium">{service.name}</span>
          <span className="text-violet-glow font-semibold font-display text-lg">{service.price}€</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-bone">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-white/[0.06] shrink-0">
            <Calendar size={13} className="text-violet-glow" />
          </span>
          <span className="font-medium">{formatLongDate(date)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-bone">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-white/[0.06] shrink-0">
            <Clock size={13} className="text-violet-glow" />
          </span>
          <span className="font-medium">
            {time} <span className="text-white/40 font-normal">· {service.duration} min</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-2xl glass pl-11 pr-4 py-3.5 text-sm text-bone placeholder-white/30 outline-none focus:border-violet-glow/60 focus:shadow-glow-sm transition-all"
          />
        </label>
        <label className="block relative">
          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Tu WhatsApp: 600 000 000"
            className="w-full rounded-2xl glass pl-11 pr-4 py-3.5 text-sm text-bone placeholder-white/30 outline-none focus:border-violet-glow/60 focus:shadow-glow-sm transition-all"
          />
        </label>
      </div>
    </div>
  )
}
