import { useEffect, useState } from 'react'
import { Calendar, Check, Copy } from 'lucide-react'
import { getIcsFeedUrl, updateSettings } from '../../lib/api'
import { useAppData } from '../../lib/AppDataContext'

export default function AdminSettings() {
  const { settings, refresh } = useAppData()
  const [draft, setDraft] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [icsUrl, setIcsUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => setDraft(settings), [settings])
  useEffect(() => {
    getIcsFeedUrl().then(setIcsUrl)
  }, [])

  if (!draft) return null

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings)
  const webcalUrl = icsUrl ? icsUrl.replace(/^https:\/\//, 'webcal://') : null

  const save = async () => {
    setSaving(true)
    await updateSettings(draft)
    refresh()
    setSaving(false)
    setSaved(true)
  }

  const copyUrl = async () => {
    if (!webcalUrl) return
    try {
      await navigator.clipboard.writeText(webcalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard no disponible; el usuario puede copiarlo a mano
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel rounded-2xl p-4 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          Datos del negocio
        </p>
        <label className="block">
          <span className="text-[10px] uppercase text-white/35">Nombre</span>
          <input
            value={draft.business_name}
            onChange={(e) => {
              setDraft({ ...draft, business_name: e.target.value })
              setSaved(false)
            }}
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60 mt-1"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase text-white/35">Instagram (sin @)</span>
          <input
            value={draft.instagram_handle}
            onChange={(e) => {
              setDraft({ ...draft, instagram_handle: e.target.value })
              setSaved(false)
            }}
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60 mt-1"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase text-white/35">WhatsApp (con prefijo, sin +)</span>
          <input
            value={draft.whatsapp_number}
            onChange={(e) => {
              setDraft({ ...draft, whatsapp_number: e.target.value })
              setSaved(false)
            }}
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60 mt-1"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase text-white/35">Dirección</span>
          <input
            value={draft.address}
            onChange={(e) => {
              setDraft({ ...draft, address: e.target.value })
              setSaved(false)
            }}
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60 mt-1"
          />
        </label>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className={`w-full rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            dirty ? 'bg-violet text-white' : 'bg-white/[0.04] text-white/30'
          }`}
        >
          {saved && !dirty && <Check size={14} />}
          {saving ? 'Guardando…' : saved && !dirty ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>

      <div className="panel rounded-2xl p-4 space-y-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 flex items-center gap-1.5">
          <Calendar size={13} /> Calendario del iPhone
        </p>
        <p className="text-xs text-white/45 leading-relaxed">
          Añade este enlace una vez en Ajustes → Calendario → Cuentas → Añadir cuenta →
          Otra → Añadir suscripción de calendario. Tus citas aparecerán solas y se
          actualizarán automáticamente.
        </p>
        {webcalUrl ? (
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[10px] text-white/50 bg-white/[0.03] rounded-lg px-3 py-2.5 truncate">
              {webcalUrl}
            </code>
            <button
              onClick={copyUrl}
              className="grid place-items-center w-9 h-9 rounded-lg border border-white/10 text-white/60 shrink-0"
              aria-label="Copiar enlace"
            >
              {copied ? <Check size={14} className="text-violet-light" /> : <Copy size={14} />}
            </button>
          </div>
        ) : (
          <p className="text-xs text-white/30">Cargando enlace…</p>
        )}
      </div>
    </div>
  )
}
