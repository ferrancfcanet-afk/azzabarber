import { CalendarPlus, CheckCircle2, Download, MapPin, MessageCircle, RotateCcw } from 'lucide-react'
import { ADDRESS, MAPS_URL } from '../lib/constants'
import { formatLongDate } from '../lib/dates'
import { buildGoogleCalendarUrl, downloadIcsFile } from '../lib/ics'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import type { Appointment } from '../lib/types'

interface Props {
  appointment: Appointment
  onReset: () => void
}

export default function ConfirmationCard({ appointment, onReset }: Props) {
  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-col items-center text-center gap-2 pt-2">
        <div className="grid place-items-center w-16 h-16 rounded-full bg-violet-glow/20 shadow-glow">
          <CheckCircle2 size={34} className="text-violet-glow" />
        </div>
        <h3 className="font-display text-2xl tracking-wide text-white mt-1">¡Cita reservada!</h3>
        <p className="text-sm text-white/50 max-w-xs">
          Confirma por WhatsApp para asegurar tu hueco. Te esperamos 💈
        </p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-1.5 text-sm">
        <p className="text-white/85">
          <span className="text-white/40">Servicio:</span> {appointment.serviceName}
        </p>
        <p className="text-white/85">
          <span className="text-white/40 normal-case">Día:</span> {formatLongDate(appointment.date)}
        </p>
        <p className="text-white/85">
          <span className="text-white/40">Hora:</span> {appointment.time}
        </p>
        <p className="text-white/85">
          <span className="text-white/40">Cliente:</span> {appointment.clientName}
        </p>
      </div>

      <div className="space-y-2.5">
        <a
          href={buildWhatsAppUrl(appointment)}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-black shadow-lg active:scale-[0.98] transition-transform"
        >
          <MessageCircle size={18} />
          Confirmar por WhatsApp
        </a>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={buildGoogleCalendarUrl(appointment)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl glass py-3 text-xs font-semibold text-white/85 active:scale-95 transition-transform"
          >
            <CalendarPlus size={15} className="text-violet-glow" />
            Google Calendar
          </a>
          <button
            onClick={() => downloadIcsFile(appointment)}
            className="flex items-center justify-center gap-1.5 rounded-xl glass py-3 text-xs font-semibold text-white/85 active:scale-95 transition-transform"
          >
            <Download size={15} className="text-violet-glow" />
            Descargar .ics
          </button>
        </div>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-3 rounded-xl glass p-3.5 active:scale-[0.98] transition-transform"
        >
          <div className="grid place-items-center w-9 h-9 rounded-lg bg-violet-glow/20 shrink-0">
            <MapPin size={17} className="text-violet-glow" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs text-white/40">Ubicación</p>
            <p className="text-xs text-white/80 truncate">{ADDRESS}</p>
          </div>
        </a>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
        >
          <RotateCcw size={14} />
          Reservar otra cita
        </button>
      </div>
    </div>
  )
}
