import { useEffect, useMemo, useState } from 'react'
import { Check, Repeat } from 'lucide-react'
import {
  addScheduleWeek,
  removeScheduleWeek,
  updateRotationConfig,
  updateScheduleWeekDay,
} from '../../lib/api'
import { WEEKDAY_NAMES_FULL } from '../../lib/dates'
import { useAppData } from '../../lib/AppDataContext'
import type { DayHours, ScheduleWeekDay } from '../../lib/types'

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0] // lunes .. domingo

function emptyWeek(): DayHours[] {
  return WEEKDAY_ORDER.map((weekday) => ({
    weekday,
    closed: true,
    morning_start: null,
    morning_end: null,
    afternoon_start: null,
    afternoon_end: null,
  }))
}

function groupByWeek(weeks: ScheduleWeekDay[]): Map<number, DayHours[]> {
  const map = new Map<number, DayHours[]>()
  for (const row of weeks) {
    const list = map.get(row.week_index) ?? []
    list.push(row)
    map.set(row.week_index, list)
  }
  return map
}

export default function AdminHours() {
  const { scheduleWeeks, settings, refresh } = useAppData()
  const [rotationWeeks, setRotationWeeks] = useState(1)
  const [rotationAnchor, setRotationAnchor] = useState('')
  const [rowsByWeek, setRowsByWeek] = useState<Map<number, DayHours[]>>(new Map())
  const [existingWeeks, setExistingWeeks] = useState<Set<number>>(new Set())
  const [activeWeek, setActiveWeek] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!settings) return
    setRotationWeeks(settings.rotation_weeks)
    setRotationAnchor(settings.rotation_anchor)
    const grouped = groupByWeek(scheduleWeeks)
    setExistingWeeks(new Set(grouped.keys()))
    setRowsByWeek(grouped)
    setActiveWeek(0)
  }, [scheduleWeeks, settings])

  const weekIndices = useMemo(
    () => Array.from({ length: rotationWeeks }, (_, i) => i),
    [rotationWeeks],
  )

  const rowsForActiveWeek = useMemo(() => {
    const existing = rowsByWeek.get(activeWeek)
    if (existing && existing.length === 7) return existing
    // Semana nueva del ciclo: parte de la semana 0 como base (o vacía si no hay).
    return rowsByWeek.get(0) ?? emptyWeek()
  }, [rowsByWeek, activeWeek])

  const patchRow = (weekIndex: number, weekday: number, patch: Partial<DayHours>) => {
    setRowsByWeek((prev) => {
      const next = new Map(prev)
      const base = next.get(weekIndex) ?? next.get(0) ?? emptyWeek()
      next.set(
        weekIndex,
        base.map((r) => (r.weekday === weekday ? { ...r, ...patch } : r)),
      )
      return next
    })
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    const rotationChanged =
      !settings || settings.rotation_weeks !== rotationWeeks || settings.rotation_anchor !== rotationAnchor
    const tasks: Promise<unknown>[] = []

    if (rotationChanged) {
      tasks.push(updateRotationConfig(rotationWeeks, rotationAnchor))
    }

    for (const weekIndex of weekIndices) {
      const rows = rowsByWeek.get(weekIndex) ?? rowsByWeek.get(0) ?? emptyWeek()
      if (existingWeeks.has(weekIndex)) {
        for (const r of rows) {
          tasks.push(
            updateScheduleWeekDay(weekIndex, r.weekday, {
              closed: r.closed,
              morning_start: r.morning_start || null,
              morning_end: r.morning_end || null,
              afternoon_start: r.afternoon_start || null,
              afternoon_end: r.afternoon_end || null,
            }),
          )
        }
      } else {
        tasks.push(addScheduleWeek(weekIndex, rows))
      }
    }

    // Elimina semanas del ciclo que ya no se usan (se redujo rotationWeeks).
    for (const weekIndex of existingWeeks) {
      if (weekIndex >= rotationWeeks) {
        tasks.push(removeScheduleWeek(weekIndex))
      }
    }

    await Promise.all(tasks)
    refresh()
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="space-y-5">
      <div className="panel rounded-2xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-3 flex items-center gap-1.5">
          <Repeat size={13} /> Ciclo de horario
        </p>
        <p className="text-xs text-white/45 mb-3">
          Elige cuántas semanas se van alternando (1 = siempre igual, 2 = una semana de una forma y la
          siguiente de otra…) y desde qué lunes empieza a contar el ciclo.
        </p>
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => {
                setRotationWeeks(n)
                setActiveWeek(0)
                setSaved(false)
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                rotationWeeks === n
                  ? 'bg-violet text-white'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {n} {n === 1 ? 'semana' : 'semanas'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-white/35 shrink-0">Lunes de referencia</span>
          <input
            type="date"
            value={rotationAnchor}
            onChange={(e) => {
              setRotationAnchor(e.target.value)
              setSaved(false)
            }}
            className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
          />
        </div>
      </div>

      {rotationWeeks > 1 && (
        <div className="flex gap-2">
          {weekIndices.map((w) => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                activeWeek === w
                  ? 'bg-violet text-white'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              Semana {w + 1}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {[...rowsForActiveWeek]
          .sort((a, b) => WEEKDAY_ORDER.indexOf(a.weekday) - WEEKDAY_ORDER.indexOf(b.weekday))
          .map((row) => (
            <div key={row.weekday} className="panel rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-bone">{WEEKDAY_NAMES_FULL[row.weekday]}</p>
                <label className="flex items-center gap-2 text-xs text-white/50">
                  <input
                    type="checkbox"
                    checked={row.closed}
                    onChange={(e) => patchRow(activeWeek, row.weekday, { closed: e.target.checked })}
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
                      onChange={(e) =>
                        patchRow(activeWeek, row.weekday, { morning_start: e.target.value })
                      }
                      className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                    />
                    <span className="text-white/25 text-xs">–</span>
                    <input
                      type="time"
                      value={row.morning_end ?? ''}
                      onChange={(e) =>
                        patchRow(activeWeek, row.weekday, { morning_end: e.target.value })
                      }
                      className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase text-white/35 w-14 shrink-0">Tarde</span>
                    <input
                      type="time"
                      value={row.afternoon_start ?? ''}
                      onChange={(e) =>
                        patchRow(activeWeek, row.weekday, { afternoon_start: e.target.value })
                      }
                      className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                    />
                    <span className="text-white/25 text-xs">–</span>
                    <input
                      type="time"
                      value={row.afternoon_end ?? ''}
                      onChange={(e) =>
                        patchRow(activeWeek, row.weekday, { afternoon_end: e.target.value })
                      }
                      className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-2 text-xs text-bone outline-none focus:border-violet/60 [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

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
