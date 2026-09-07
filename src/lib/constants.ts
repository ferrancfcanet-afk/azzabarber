import type { Service } from './types'

// ── Configuración del negocio ────────────────────────────────────────────
// Actualiza estos valores con los datos reales del barbero.
export const BRAND_NAME = 'AZZA BARBER'
export const INSTAGRAM_HANDLE = 'azzabarber'
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`
export const BARBER_WHATSAPP = '34722443789' // +34 722 44 37 89, formato internacional sin '+'
export const ADDRESS = 'Carrer Sant Francesc de Paula, 75, Mataró, Barcelona'
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`
export const ADMIN_PIN = '070926' // PIN del panel de barbero

export const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Pelo',
    duration: 45,
    price: 12,
    description: 'Corte a máquina y tijera, acabado con fade o clásico.',
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    duration: 60,
    price: 15,
    description: 'Combo completo: corte de pelo + perfilado de barba.',
  },
  {
    id: 'barba',
    name: 'Barba Express',
    duration: 30,
    price: 8,
    description: 'Perfilado y arreglo rápido de barba.',
  },
]

// ── Horario de trabajo ───────────────────────────────────────────────────
export const MORNING_START = '10:00'
export const MORNING_END = '14:00'
export const AFTERNOON_START = '16:00'
export const AFTERNOON_END = '20:30'
export const SLOT_STEP_MINUTES = 15
export const DAYS_TO_SHOW = 7
export const CLOSED_WEEKDAY = 0 // Domingo (0 = domingo en JS Date)
export const BLOCK_DURATION_MINUTES = 30 // duración que ocupa un bloqueo manual del barbero

export const GALLERY_IMAGES = [
  { src: '/corte1.jpg', alt: 'Corte con mechas y fade — azzabarber' },
  { src: '/corte2.jpg', alt: 'Sesión de corte en el estudio — azzabarber' },
  { src: '/corte3.jpg', alt: 'Fade y textura natural — azzabarber' },
]
