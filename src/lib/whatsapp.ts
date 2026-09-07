import { BARBER_WHATSAPP } from './constants'
import { formatLongDate } from './dates'
import type { Appointment } from './types'

export function buildWhatsAppMessage(appt: Appointment): string {
  return [
    `¡Hola azzabarber! 💈 Quiero confirmar mi cita:`,
    ``,
    `✂️ Servicio: ${appt.serviceName}`,
    `📅 Día: ${formatLongDate(appt.date)}`,
    `🕒 Hora: ${appt.time}`,
    `💶 Precio: ${appt.price}€`,
    `👤 Nombre: ${appt.clientName}`,
    `📱 Teléfono: ${appt.clientPhone}`,
    ``,
    `¡Gracias!`,
  ].join('\n')
}

export function buildWhatsAppUrl(appt: Appointment): string {
  const message = encodeURIComponent(buildWhatsAppMessage(appt))
  return `https://wa.me/${BARBER_WHATSAPP}?text=${message}`
}
