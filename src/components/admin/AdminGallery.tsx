import { useRef, useState } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { addGalleryImage, deleteGalleryImage, updateSettings, uploadMedia } from '../../lib/api'
import { useAppData } from '../../lib/AppDataContext'

export default function AdminGallery() {
  const { settings, gallery, refresh } = useAppData()
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleProfileUpload = async (file: File) => {
    setUploadingProfile(true)
    setError(null)
    try {
      const url = await uploadMedia(file, 'profile')
      await updateSettings({ profile_photo_url: url })
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la foto')
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleGalleryUpload = async (file: File) => {
    setUploadingGallery(true)
    setError(null)
    try {
      const url = await uploadMedia(file, 'gallery')
      await addGalleryImage(url, gallery.length + 1)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la foto')
    } finally {
      setUploadingGallery(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      {/* Foto de perfil */}
      <div className="panel rounded-2xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-3">
          Foto de perfil
        </p>
        <div className="flex items-center gap-4">
          {settings && (
            <img
              src={settings.profile_photo_url}
              alt="Perfil"
              className="w-16 h-16 rounded-full object-cover border border-white/10"
            />
          )}
          <input
            ref={profileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleProfileUpload(e.target.files[0])}
          />
          <button
            onClick={() => profileInputRef.current?.click()}
            disabled={uploadingProfile}
            className="flex-1 rounded-lg border border-white/10 py-3 text-xs font-semibold text-white/70 flex items-center justify-center gap-1.5"
          >
            <Upload size={13} />
            {uploadingProfile ? 'Subiendo…' : 'Cambiar foto'}
          </button>
        </div>
      </div>

      {/* Galería */}
      <div className="panel rounded-2xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-3">
          Galería de trabajos
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {gallery.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => deleteGalleryImage(img.id).then(refresh)}
                className="absolute top-1 right-1 grid place-items-center w-6 h-6 rounded-full bg-black/60 text-white"
                aria-label="Eliminar foto"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleGalleryUpload(e.target.files[0])}
          />
          <button
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploadingGallery}
            className="aspect-square rounded-lg border border-dashed border-white/15 grid place-items-center text-white/40"
          >
            {uploadingGallery ? (
              <span className="text-[10px]">Subiendo…</span>
            ) : (
              <Plus size={18} />
            )}
          </button>
        </div>
        <p className="text-[11px] text-white/30">
          Toca el «+» para añadir una foto nueva a la galería que ven los clientes.
        </p>
      </div>
    </div>
  )
}
