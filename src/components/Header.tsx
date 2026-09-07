import { Instagram, MapPin } from 'lucide-react'
import Logo from './Logo'
import { useAppData } from '../lib/AppDataContext'

export default function Header() {
  const { settings } = useAppData()
  if (!settings) return null

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`
  const instagramUrl = `https://instagram.com/${settings.instagram_handle}`

  return (
    <header className="relative">
      {/* Foto real del estudio como cabecera */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src="/corte2.jpg"
          alt={`Interior de ${settings.business_name}`}
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 38%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-black/10" />
        <div className="absolute top-4 left-5 w-9 h-9">
          <Logo showWordmark={false} />
        </div>
      </div>

      {/* Franja de perfil, superpuesta a la foto */}
      <div className="relative px-5 pb-6 animate-slide-up">
        <div className="flex items-end gap-3.5 -mt-10">
          <img
            src={settings.profile_photo_url}
            alt={`${settings.business_name} — barbero profesional`}
            className="w-20 h-20 rounded-full object-cover border-2 border-ink-950 shrink-0"
          />
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="font-display text-3xl tracking-wide text-bone leading-none">
              {settings.business_name}
            </h1>
            <p className="text-xs text-white/45 mt-1">Barber &amp; Fade Specialist · Mataró</p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="grid place-items-center w-9 h-9 rounded-full border border-white/15 text-white/70 shrink-0 mb-1"
            aria-label={`Instagram @${settings.instagram_handle}`}
          >
            <Instagram size={16} />
          </a>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3.5 flex items-center gap-1.5 text-xs text-white/40 hover:text-violet-light transition-colors"
        >
          <MapPin size={12} />
          {settings.address}
        </a>
      </div>
    </header>
  )
}
