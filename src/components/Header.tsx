import { Instagram, Scissors } from 'lucide-react'
import Logo from './Logo'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/constants'

export default function Header() {
  return (
    <header className="relative pt-8 pb-6 px-5 flex flex-col items-center text-center overflow-hidden">
      {/* Glow decorativo de fondo */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-violet-glow/25 blur-3xl animate-pulse-glow" />

      <div className="relative w-16 mb-1 animate-slide-up">
        <Logo showWordmark={false} className="w-16" />
      </div>

      <div className="relative animate-slide-up" style={{ animationDelay: '80ms' }}>
        <div className="relative w-28 h-28 mx-auto mb-4 mt-2">
          <div className="absolute inset-0 rounded-full bg-violet-glow/50 blur-xl animate-pulse-glow" />
          <img
            src="/perfil.jpg"
            alt="azzabarber — barbero profesional"
            className="relative w-28 h-28 rounded-full object-cover border-2 border-violet-glow/60 shadow-glow"
          />
          <span className="absolute bottom-1 right-1 grid place-items-center w-8 h-8 rounded-full bg-violet-deep border-2 border-ink-950 shadow-glow-sm">
            <Scissors size={15} className="text-white" strokeWidth={2.4} />
          </span>
        </div>
      </div>

      <h1
        className="font-display text-3xl tracking-[0.14em] text-white animate-slide-up"
        style={{ animationDelay: '140ms' }}
      >
        AZABARBER
      </h1>

      <div
        className="mt-2 flex items-center gap-2 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] font-semibold tracking-wide text-violet-glow uppercase">
          Barber &amp; Fade Specialist
        </span>
      </div>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-violet-glow transition-colors animate-slide-up"
        style={{ animationDelay: '260ms' }}
      >
        <Instagram size={16} />
        @{INSTAGRAM_HANDLE}
      </a>
    </header>
  )
}
