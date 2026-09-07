import { useState } from 'react'
import Header from './components/Header'
import Gallery from './components/Gallery'
import BookingFlow from './components/BookingFlow'
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-10">
      <Header />
      <Gallery />
      <BookingFlow />

      <footer className="px-5 mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-white/8" />
          <button
            onClick={() => setAdminOpen(true)}
            className="w-1.5 h-1.5 rounded-full bg-white/15 hover:bg-violet-light transition-colors"
            aria-label="Modo Barbero"
          />
          <span className="h-px w-10 bg-white/8" />
        </div>
        <p className="text-[10px] tracking-wide text-white/20">© AZZABARBER · Mataró</p>
      </footer>

      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </div>
  )
}
