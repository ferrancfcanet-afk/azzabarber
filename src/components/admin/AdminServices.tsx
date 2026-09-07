import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { deleteService, getAllServices, upsertService } from '../../lib/api'
import { useAppData } from '../../lib/AppDataContext'
import type { Service } from '../../lib/types'

const EMPTY_NEW = { name: '', description: '', duration_minutes: 30, price: 10 }

function ServiceRow({ service, onSaved, onDeleted }: {
  service: Service
  onSaved: () => void
  onDeleted: () => void
}) {
  const [draft, setDraft] = useState(service)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(service)

  const save = async () => {
    setSaving(true)
    await upsertService(draft)
    setSaving(false)
    setSaved(true)
    onSaved()
  }

  return (
    <div className="panel rounded-2xl p-4 space-y-2.5">
      <input
        value={draft.name}
        onChange={(e) => {
          setDraft({ ...draft, name: e.target.value })
          setSaved(false)
        }}
        className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm font-semibold text-bone outline-none focus:border-violet/60"
        placeholder="Nombre del servicio"
      />
      <textarea
        value={draft.description}
        onChange={(e) => {
          setDraft({ ...draft, description: e.target.value })
          setSaved(false)
        }}
        rows={2}
        className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-xs text-bone outline-none focus:border-violet/60 resize-none"
        placeholder="Descripción"
      />
      <div className="grid grid-cols-2 gap-2.5">
        <label className="block">
          <span className="text-[10px] uppercase text-white/35">Duración (min)</span>
          <input
            type="number"
            min={5}
            step={5}
            value={draft.duration_minutes}
            onChange={(e) => {
              setDraft({ ...draft, duration_minutes: Number(e.target.value) })
              setSaved(false)
            }}
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60 mt-1"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase text-white/35">Precio (€)</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={draft.price}
            onChange={(e) => {
              setDraft({ ...draft, price: Number(e.target.value) })
              setSaved(false)
            }}
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60 mt-1"
          />
        </label>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs text-white/50">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => {
                setDraft({ ...draft, active: e.target.checked })
                setSaved(false)
              }}
              className="accent-violet"
            />
            Activo
          </label>
          <label className="flex items-center gap-1.5 text-xs text-white/50">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => {
                setDraft({ ...draft, featured: e.target.checked })
                setSaved(false)
              }}
              className="accent-violet"
            />
            Recomendado
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => deleteService(service.id).then(onDeleted)}
            className="grid place-items-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400"
            aria-label="Eliminar servicio"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className={`rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              dirty ? 'bg-violet text-white' : 'bg-white/[0.04] text-white/30'
            }`}
          >
            {saved && !dirty ? <Check size={13} /> : null}
            {saving ? 'Guardando…' : saved && !dirty ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminServices() {
  const { refresh: refreshAppData } = useAppData()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newService, setNewService] = useState(EMPTY_NEW)

  const load = () => {
    getAllServices().then((s) => {
      setServices(s)
      setLoading(false)
      refreshAppData()
    })
  }

  useEffect(load, [])

  const createService = async () => {
    if (!newService.name.trim()) return
    await upsertService({ ...newService, position: services.length + 1, active: true, featured: false })
    setNewService(EMPTY_NEW)
    setShowNew(false)
    load()
  }

  if (loading) return <p className="text-sm text-white/35 text-center py-10">Cargando…</p>

  return (
    <div className="space-y-3">
      {services.map((s) => (
        <ServiceRow key={s.id} service={s} onSaved={load} onDeleted={load} />
      ))}

      {showNew ? (
        <div className="panel rounded-2xl p-4 space-y-2.5">
          <input
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            placeholder="Nombre del servicio"
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60"
            autoFocus
          />
          <textarea
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            rows={2}
            placeholder="Descripción"
            className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-xs text-bone outline-none focus:border-violet/60 resize-none"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="number"
              value={newService.duration_minutes}
              onChange={(e) =>
                setNewService({ ...newService, duration_minutes: Number(e.target.value) })
              }
              className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60"
              placeholder="Duración (min)"
            />
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
              className="w-full rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-bone outline-none focus:border-violet/60"
              placeholder="Precio (€)"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNew(false)}
              className="flex-1 rounded-lg py-2.5 text-xs font-semibold text-white/50 border border-white/10"
            >
              Cancelar
            </button>
            <button
              onClick={createService}
              className="flex-1 rounded-lg py-2.5 text-xs font-semibold bg-violet text-white"
            >
              Crear servicio
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full rounded-xl border border-dashed border-white/15 py-3.5 text-sm font-semibold text-white/50 flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Nuevo servicio
        </button>
      )}
    </div>
  )
}
