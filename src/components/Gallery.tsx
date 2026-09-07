import { useState } from 'react'
import { Expand, X } from 'lucide-react'
import { GALLERY_IMAGES } from '../lib/constants'

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="px-5 mt-3 animate-slide-up" style={{ animationDelay: '340ms' }}>
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="h-px w-4 bg-gradient-to-r from-transparent to-violet-glow/50" />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Últimos trabajos
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x-mandatory pb-1 -mx-5 px-5">
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setActive(i)}
            className="group snap-center shrink-0 relative w-32 h-44 rounded-2xl overflow-hidden hairline shadow-lift active:scale-[0.97] transition-transform"
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute bottom-2 right-2 grid place-items-center w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-active:opacity-100 transition-opacity">
              <Expand size={11} className="text-white" />
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-6 right-6 grid place-items-center w-9 h-9 rounded-full glass text-white"
            onClick={() => setActive(null)}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
          <img
            src={GALLERY_IMAGES[active].src}
            alt={GALLERY_IMAGES[active].alt}
            className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-glow"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
