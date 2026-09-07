interface LogoProps {
  className?: string
  showWordmark?: boolean
  animated?: boolean
}

/**
 * Logo de azzabarber: una "A" perfilada por una cuchilla de afeitar,
 * con el nombre de la marca debajo. Vectorial, sin dependencias externas.
 */
export default function Logo({ className = '', showWordmark = true, animated = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 120 110"
        className={`w-full h-full ${animated ? 'animate-fade-in' : ''}`}
        role="img"
        aria-label="Logo azzabarber"
      >
        <defs>
          <linearGradient id="legGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="55%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Piernas de la "A" */}
        <g filter="url(#glow)">
          <path
            d="M60 8 L20 96 L34 96 L60 38 L86 96 L100 96 Z"
            fill="url(#legGrad)"
          />
        </g>

        {/* Cuchilla como barra de la "A", ligeramente inclinada */}
        <g transform="rotate(-5 60 66)">
          <rect
            x="27"
            y="58"
            width="66"
            height="12"
            rx="3"
            fill="url(#bladeGrad)"
            stroke="#64748b"
            strokeWidth="0.6"
          />
          {/* Perforaciones típicas de una cuchilla de afeitar */}
          <circle cx="41" cy="64" r="2.6" fill="#0d0e12" />
          <circle cx="60" cy="64" r="2.6" fill="#0d0e12" />
          <circle cx="79" cy="64" r="2.6" fill="#0d0e12" />
          {/* Filo brillante */}
          <rect x="27" y="58.5" width="66" height="2" rx="1" fill="#ffffff" opacity="0.75" />
          {animated && (
            <rect x="27" y="58" width="14" height="12" rx="3" fill="#ffffff" opacity="0.35">
              <animate attributeName="x" from="20" to="90" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.4;0" dur="2.8s" repeatCount="indefinite" />
            </rect>
          )}
        </g>
      </svg>

      {showWordmark && (
        <div className="mt-1.5 text-center leading-none select-none">
          <span className="font-display text-2xl tracking-[0.18em] text-white">AZZA</span>
          <span className="font-display text-2xl tracking-[0.18em] text-violet-glow ml-1.5">
            BARBER
          </span>
        </div>
      )}
    </div>
  )
}
