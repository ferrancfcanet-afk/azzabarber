import { useState } from 'react'
import { X } from 'lucide-react'
import { GALLERY_IMAGES } from '../lib/constants'

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="px-5 mt-1">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
        Últimos trabajos
      </h2>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x-mandatory pb-1 -mx-5 px-5">
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setActive(i)}
            className="snap-center shrink-0 w-28 h-36 rounded-xl overflow-hidden border border-white/8 active:opacity-80 transition-opacity"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover grayscale contrast-[1.05]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-6 right-6 grid place-items-center w-9 h-9 rounded-full border border-white/15 text-white"
            onClick={() => setActive(null)}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
          <img
            src={GALLERY_IMAGES[active].src}
            alt={GALLERY_IMAGES[active].alt}
            className="max-h-[80vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
