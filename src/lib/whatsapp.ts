import { formatLongDate } from './dates'
import type { Appointment } from './types'

export function buildWhatsAppMessage(appt: Appointment): string {
  return [
    `¡Hola! 💈 Quiero confirmar mi cita:`,
    ``,
    `✂️ Servicio: ${appt.service_name}`,
    `📅 Día: ${formatLongDate(appt.appt_date)}`,
    `🕒 Hora: ${appt.appt_time.slice(0, 5)}`,
    `💶 Precio: ${appt.price}€`,
    `👤 Nombre: ${appt.client_name}`,
    `📱 Teléfono: ${appt.client_phone}`,
    ``,
    `¡Gracias!`,
  ].join('\n')
}

export function buildWhatsAppUrl(appt: Appointment, whatsappNumber: string): string {
  const message = encodeURIComponent(buildWhatsAppMessage(appt))
  return `https://wa.me/${whatsappNumber}?text=${message}`
}
