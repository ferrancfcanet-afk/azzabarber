import { Instagram, Scissors } from 'lucide-react'
import Logo from './Logo'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/constants'

export default function Header() {
  return (
    <header className="relative pt-10 pb-7 px-5 flex flex-col items-center text-center overflow-hidden">
      {/* Glow decorativo de fondo */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-violet-glow/20 blur-[90px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -top-6 left-1/2 translate-x-10 w-40 h-40 rounded-full bg-gold/10 blur-3xl" />

      <span className="relative text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80 animate-slide-up">
        Mataró · Barbería
      </span>

      <div className="relative w-14 mt-3 mb-2 animate-slide-up" style={{ animationDelay: '60ms' }}>
        <Logo showWordmark={false} className="w-14" />
      </div>

      <div className="relative animate-scale-in" style={{ animationDelay: '120ms' }}>
        <div className="relative w-32 h-32 mx-auto mb-5 mt-3">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-violet-glow/60 via-violet-deep/40 to-transparent blur-md opacity-70" />
          <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-violet-glow via-violet-deep to-ink-800">
            <div className="w-full h-full rounded-full p-[2px] bg-ink-950">
              <img
                src="/perfil.jpg"
                alt="azzabarber — barbero profesional"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="absolute bottom-0.5 right-0.5 grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-violet-glow to-violet-deep border-[3px] border-ink-950 shadow-lift">
            <Scissors size={15} className="text-white" strokeWidth={2.4} />
          </span>
        </div>
      </div>

      <h1
        className="font-display text-4xl tracking-[0.16em] text-bone animate-slide-up"
        style={{ animationDelay: '180ms' }}
      >
        AZZABARBER
      </h1>

      <div
        className="mt-2.5 flex items-center gap-2 animate-slide-up"
        style={{ animationDelay: '230ms' }}
      >
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/25" />
        <span className="text-[11px] font-medium tracking-[0.18em] text-white/55 uppercase">
          Barber &amp; Fade Specialist
        </span>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/25" />
      </div>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-bone/85 hover:border-violet-glow/50 hover:text-white transition-colors animate-slide-up"
        style={{ animationDelay: '290ms' }}
      >
        <Instagram size={15} className="text-violet-glow" />
        @{INSTAGRAM_HANDLE}
      </a>
    </header>
  )
}
