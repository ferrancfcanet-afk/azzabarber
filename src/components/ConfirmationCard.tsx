import { CalendarPlus, CheckCircle2, Download, MapPin, MessageCircle, RotateCcw } from 'lucide-react'
import { formatLongDate } from '../lib/dates'
import { buildGoogleCalendarUrl, downloadIcsFile } from '../lib/ics'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import type { Appointment, PublicSettings } from '../lib/types'

interface Props {
  appointment: Appointment
  settings: PublicSettings
  onReset: () => void
}

export default function ConfirmationCard({ appointment, settings, onReset }: Props) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col items-center text-center gap-3 pt-1">
        <div className="grid place-items-center w-14 h-14 rounded-full bg-violet/15">
          <CheckCircle2 size={28} className="text-violet-light" strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-display text-3xl tracking-wide text-bone">¡Cita reservada!</h3>
          <p className="text-sm text-white/45 max-w-xs mt-1">
            Confirma por WhatsApp para asegurar tu hueco. Te esperamos 💈
          </p>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-2 bg-white/[0.03] border border-white/8 text-sm">
        <p className="text-bone/90">
          <span className="text-white/35">Servicio </span> {appointment.service_name}
        </p>
        <p className="text-bone/90">
          <span className="text-white/35">Día </span> {formatLongDate(appointment.appt_date)}
        </p>
        <p className="text-bone/90">
          <span className="text-white/35">Hora </span> {appointment.appt_time.slice(0, 5)}
        </p>
        <p className="text-bone/90">
          <span className="text-white/35">Cliente </span> {appointment.client_name}
        </p>
      </div>

      <div className="space-y-2.5">
        <a
          href={buildWhatsAppUrl(appointment, settings.whatsapp_number)}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-ink-950 active:scale-[0.98] transition-transform"
        >
          <MessageCircle size={18} strokeWidth={2.2} />
          Confirmar por WhatsApp
        </a>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={buildGoogleCalendarUrl(appointment, settings.business_name, settings.address)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 py-3 text-xs font-semibold text-bone/80 active:bg-white/[0.04] transition-colors"
          >
            <CalendarPlus size={15} className="text-white/50" />
            Calendar
          </a>
          <button
            onClick={() => downloadIcsFile(appointment, settings.business_name, settings.address)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 py-3 text-xs font-semibold text-bone/80 active:bg-white/[0.04] transition-colors"
          >
            <Download size={15} className="text-white/50" />
            Descargar .ics
          </button>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-3 rounded-xl border border-white/8 p-3.5 active:bg-white/[0.03] transition-colors"
        >
          <div className="grid place-items-center w-9 h-9 rounded-full bg-white/[0.05] shrink-0">
            <MapPin size={16} className="text-white/50" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] uppercase tracking-wider text-white/35">Ubicación</p>
            <p className="text-xs text-bone/80 truncate">{settings.address}</p>
          </div>
        </a>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-semibold text-white/35 hover:text-white/60 transition-colors"
        >
          <RotateCcw size={13} />
          Reservar otra cita
        </button>
      </div>
    </div>
  )
}
