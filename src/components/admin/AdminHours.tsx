import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { updateBusinessHour } from '../../lib/api'
import { WEEKDAY_NAMES_FULL } from '../../lib/dates'
import { useAppData } from '../../lib/AppDataContext'
import type { DayHours } from '../../lib/types'

export default function AdminHours() {
  const { hours, refresh } = useAppData()
  const [rows, setRows] = useState<DayHours[]>(hours)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setRows(hours), [hours])

  const patchRow = (weekday: number, patch: Partial<DayHours>) => {
    setRows((prev) => prev.map((r) => (r.weekday === weekday ? { ...r, ...patch } : r)))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    await Promise.all(
      rows.map((r) =>
        updateBusinessHour(r.weekday, {
          closed: r.closed,
          morning_start: r.morning_start || null,
          morning_end: r.morning_end || null,
          afternoon_start: r.afternoon_start || null,
          afternoon_end: r.afternoon_end || null,
        }),
      ),
    )
    refresh()
    setSaving(false)
    setSaved(true)
  }

  const sorted = [...rows].sort((a, b) => {
    // lunes a domingo
    const order = (w: number) => (w === 0 ? 7 : w)
    return order(a.weekday) - order(b.weekday)
  })

  return (
    <div className="space-y-3">
      {sorted.map((row) => (
        <div key={row.weekday} className="panel rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-bone">{WEEKDAY_NAMES_FULL[row.weekday]}</p>
            <label className="flex items-center gap-2 text-xs text-white/50">
              <input
                type="checkbox"
                checked={row.closed}
                onChange={(e) => patchRow(row.weekday, { closed: e.target.checked })}
                className="accent-violet"
              />
              Cerrado
            </label>
          </div>
          {!row.closed && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-white/35 w-14 shrink-0">Mañana</span>
                <input
                  type="time"
                  value={row.morning_start ?? ''}
                  onChange={(e) => patchRow(row.weekday, { morning_start: e.target.value })}
                  className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                />
                <span className="text-white/25 text-xs">–</span>
                <input
                  type="time"
                  value={row.morning_end ?? ''}
                  onChange={(e) => patchRow(row.weekday, { morning_end: e.target.value })}
                  className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-white/35 w-14 shrink-0">Tarde</span>
                <input
                  type="time"
                  value={row.afternoon_start ?? ''}
                  onChange={(e) => patchRow(row.weekday, { afternoon_start: e.target.value })}
                  className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                />
                <span className="text-white/25 text-xs">–</span>
                <input
                  type="time"
                  value={row.afternoon_end ?? ''}
                  onChange={(e) => patchRow(row.weekday, { afternoon_end: e.target.value })}
                  className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="w-full rounded-xl bg-violet py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {saved ? (
          <>
            <Check size={16} /> Guardado
          </>
        ) : saving ? (
          'Guardando…'
        ) : (
          'Guardar horario'
        )}
      </button>
    </div>
  )
}
