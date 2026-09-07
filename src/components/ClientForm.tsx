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
      <div className="glass rounded-2xl p-4 space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">
          Resumen de tu cita
        </p>
        <div className="flex items-center gap-2.5 text-sm text-white/85">
          <Scissors size={15} className="text-violet-glow shrink-0" />
          <span className="flex-1">{service.name}</span>
          <span className="text-violet-glow font-semibold">{service.price}€</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-white/85">
          <Calendar size={15} className="text-violet-glow shrink-0" />
          <span>{formatLongDate(date)}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-white/85">
          <Clock size={15} className="text-violet-glow shrink-0" />
          <span>
            {time} · {service.duration} min
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1.5 flex items-center gap-1.5">
            <User size={13} /> Nombre
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-xl glass px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-glow/70 focus:shadow-glow-sm transition-all"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1.5 flex items-center gap-1.5">
            <Phone size={13} /> Teléfono (WhatsApp)
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="600 000 000"
            className="w-full rounded-xl glass px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-glow/70 focus:shadow-glow-sm transition-all"
          />
        </label>
      </div>
    </div>
  )
}
