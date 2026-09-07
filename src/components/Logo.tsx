interface LogoProps {
  className?: string
  showWordmark?: boolean
}

/**
 * Logo de azzabarber: una "A" en violeta, con la barra central dibujada
 * como una cuchilla de afeitar pulida. Vectorial, sin dependencias.
 */
export default function Logo({ className = '', showWordmark = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 120 118" className="w-full h-full" role="img" aria-label="Logo azzabarber">
        <defs>
          <linearGradient id="legGrad" x1="0%" y1="0%" x2="10%" y2="100%">
            <stop offset="0%" stopColor="#c9a6fb" />
            <stop offset="45%" stopColor="#8544f0" />
            <stop offset="100%" stopColor="#3b0f78" />
          </linearGradient>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a94a3" />
            <stop offset="16%" stopColor="#eef2f6" />
            <stop offset="50%" stopColor="#fbfcfe" />
            <stop offset="84%" stopColor="#dbe2e9" />
            <stop offset="100%" stopColor="#75808e" />
          </linearGradient>
        </defs>

        <path
          d="M60 6 L17 108 L33 108 L60 36 L87 108 L103 108 Z"
          fill="url(#legGrad)"
          stroke="#1a0533"
          strokeWidth="0.5"
        />

        <g transform="rotate(-3 60 65)">
          <rect x="30" y="61" width="60" height="8" rx="2.2" fill="url(#bladeGrad)" />
          <rect x="41.5" y="63.6" width="9" height="2.8" rx="1.4" fill="#161821" opacity="0.85" />
          <rect x="69.5" y="63.6" width="9" height="2.8" rx="1.4" fill="#161821" opacity="0.85" />
          <rect x="30" y="61.4" width="60" height="1.1" rx="0.5" fill="#ffffff" opacity="0.75" />
        </g>
      </svg>

      {showWordmark && (
        <div className="mt-2 text-center leading-none select-none">
          <span className="font-display text-2xl tracking-[0.2em] text-bone">AZZA</span>
          <span className="font-display text-2xl tracking-[0.2em] text-violet-light ml-2">
            BARBER
          </span>
        </div>
      )}
    </div>
  )
}
