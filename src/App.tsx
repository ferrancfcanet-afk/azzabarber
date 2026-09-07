import { useState } from 'react'
import { MapPin } from 'lucide-react'
import Header from './components/Header'
import Gallery from './components/Gallery'
import BookingFlow from './components/BookingFlow'
import AdminPanel from './components/AdminPanel'
import { ADDRESS, MAPS_URL } from './lib/constants'

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-10">
      <Header />
      <Gallery />
      <BookingFlow />

      <footer className="px-5 mt-10 flex flex-col items-center gap-4">
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-violet-glow transition-colors text-center"
        >
          <MapPin size={13} />
          {ADDRESS}
        </a>

        <div className="flex items-center gap-3 mt-1">
          <span className="h-px w-10 bg-white/10" />
          <button
            onClick={() => setAdminOpen(true)}
            className="w-1.5 h-1.5 rounded-full bg-white/15 hover:bg-violet-glow transition-colors"
            aria-label="Modo Barbero"
          />
          <span className="h-px w-10 bg-white/10" />
        </div>
        <p className="text-[10px] text-white/20">© azzabarber · Mataró</p>
      </footer>

      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </div>
  )
}
