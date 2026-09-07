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
      <div className="rounded-xl p-4 space-y-2.5 bg-white/[0.03] border border-white/8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 mb-0.5">
          Resumen
        </p>
        <div className="flex items-center gap-2.5 text-sm text-bone">
          <Scissors size={14} className="text-white/35 shrink-0" />
          <span className="flex-1">{service.name}</span>
          <span className="font-semibold">{service.price}€</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-bone">
          <Calendar size={14} className="text-white/35 shrink-0" />
          <span>{formatLongDate(date)}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-bone">
          <Clock size={14} className="text-white/35 shrink-0" />
          <span>
            {time} <span className="text-white/35">· {service.duration} min</span>
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
            className="w-full rounded-xl bg-white/[0.03] border border-white/8 pl-11 pr-4 py-3.5 text-sm text-bone placeholder-white/30 outline-none focus:border-violet/60 transition-colors"
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
            className="w-full rounded-xl bg-white/[0.03] border border-white/8 pl-11 pr-4 py-3.5 text-sm text-bone placeholder-white/30 outline-none focus:border-violet/60 transition-colors"
          />
        </label>
      </div>
    </div>
  )
}
