interface LogoProps {
  className?: string
  showWordmark?: boolean
  animated?: boolean
}

/**
 * Logo de azzabarber: una "A" en gradiente violeta, con la barra central
 * dibujada como una cuchilla de afeitar pulida. Vectorial, sin dependencias.
 */
export default function Logo({ className = '', showWordmark = true, animated = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 120 118"
        className="w-full h-full"
        role="img"
        aria-label="Logo azzabarber"
      >
        <defs>
          <linearGradient id="legGrad" x1="0%" y1="0%" x2="10%" y2="100%">
            <stop offset="0%" stopColor="#d6bcfb" />
            <stop offset="38%" stopColor="#a976fa" />
            <stop offset="75%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b0f78" />
          </linearGradient>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c8798" />
            <stop offset="14%" stopColor="#eef2f6" />
            <stop offset="50%" stopColor="#fbfcfe" />
            <stop offset="86%" stopColor="#dbe2e9" />
            <stop offset="100%" stopColor="#6b7684" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sombra de contacto */}
        <ellipse cx="60" cy="112" rx="34" ry="4" fill="#000000" opacity="0.28" />

        {/* Piernas de la "A" — silueta esbelta */}
        <path
          d="M60 6 L17 108 L33 108 L60 36 L87 108 L103 108 Z"
          fill="url(#legGrad)"
          stroke="#1a0533"
          strokeWidth="0.5"
        />

        {/* Cuchilla como barra de la "A" */}
        <g transform="rotate(-3 60 65)" filter="url(#softGlow)">
          <rect x="30" y="61" width="60" height="8" rx="2.2" fill="url(#bladeGrad)" />
          <rect x="30" y="61" width="60" height="8" rx="2.2" fill="none" stroke="#4b5563" strokeWidth="0.4" opacity="0.6" />
          {/* Perforaciones estilo cuchilla recta */}
          <rect x="41.5" y="63.6" width="9" height="2.8" rx="1.4" fill="#161821" opacity="0.85" />
          <rect x="69.5" y="63.6" width="9" height="2.8" rx="1.4" fill="#161821" opacity="0.85" />
          {/* Filo brillante */}
          <rect x="30" y="61.4" width="60" height="1.1" rx="0.5" fill="#ffffff" opacity="0.8" />

          {animated && (
            <rect x="30" y="61" width="10" height="8" fill="#ffffff" opacity="0">
              <animate
                attributeName="x"
                values="26;94;94"
                keyTimes="0;0.4;1"
                dur="4.5s"
                begin="0.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.32;0;0"
                keyTimes="0;0.12;0.4;1"
                dur="4.5s"
                begin="0.6s"
                repeatCount="indefinite"
              />
            </rect>
          )}
        </g>
      </svg>

      {showWordmark && (
        <div className="mt-2 text-center leading-none select-none">
          <span className="font-display text-2xl tracking-[0.2em] text-bone">AZZA</span>
          <span className="font-display text-2xl tracking-[0.2em] text-violet-glow ml-2">
            BARBER
          </span>
        </div>
      )}
    </div>
  )
}
