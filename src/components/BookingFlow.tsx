import { useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import ServiceStep from './ServiceStep'
import DateStep from './DateStep'
import TimeStep from './TimeStep'
import ClientForm from './ClientForm'
import ConfirmationCard from './ConfirmationCard'
import { createAppointment } from '../lib/api'
import { useAppData } from '../lib/AppDataContext'
import type { Appointment, Service } from '../lib/types'

const STEP_LABELS = ['Servicio', 'Día', 'Hora', 'Datos']

function fireConfetti() {
  confetti({
    particleCount: 70,
    spread: 70,
    startVelocity: 32,
    origin: { y: 0.65 },
    colors: ['#8544f0', '#c9a6fb', '#f5f3ff'],
    zIndex: 999,
  })
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-6">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`grid place-items-center w-7 h-7 rounded-full text-[11px] font-bold shrink-0 ${
                i <= step ? 'bg-violet text-white' : 'bg-ink-700 text-white/30'
              }`}
            >
              {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={`text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                i <= step ? 'text-white/65' : 'text-white/25'
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className="flex-1 h-px mx-1.5 -mt-4 bg-ink-700">
              <div
                className="h-full bg-violet transition-all duration-300"
                style={{ width: i < step ? '100%' : '0%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookingFlow() {
  const { services, scheduleWeeks, settings, getHoursForDate } = useAppData()
  const [step, setStep] = useState(0)
  const [service, setService] = useState<Service | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const canProceed = () => {
    if (step === 0) return !!service
    if (step === 1) return !!date
    if (step === 2) return !!time
    if (step === 3) return name.trim().length > 1 && phone.trim().length >= 6
    return false
  }

  const goNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      confirmBooking()
    }
  }

  const goBack = () => {
    if (step === 0) return
    setStep(step - 1)
  }

  const confirmBooking = async () => {
    if (!service || !date || !time || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const appt = await createAppointment({
        service,
        date,
        time,
        clientName: name.trim(),
        clientPhone: phone.trim(),
      })
      setAppointment(appt)
      setRefreshKey((k) => k + 1)
      fireConfetti()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'No se ha podido reservar. Inténtalo de nuevo.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const resetFlow = () => {
    setStep(0)
    setService(null)
    setDate(null)
    setTime(null)
    setName('')
    setPhone('')
    setAppointment(null)
    setSubmitError(null)
  }

  if (appointment && settings) {
    return (
      <section className="px-5 mt-8">
        <div className="panel rounded-2xl p-5 shadow-card">
          <ConfirmationCard appointment={appointment} settings={settings} onReset={resetFlow} />
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 mt-8">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
        Reserva tu cita
      </h2>

      <div className="panel rounded-2xl p-5 shadow-card">
        <Stepper step={step} />

        <div key={step} className="animate-fade-in min-h-[220px]">
          {step === 0 && (
            <ServiceStep services={services} selected={service} onSelect={setService} />
          )}
          {step === 1 && settings && (
            <DateStep
              scheduleWeeks={scheduleWeeks}
              settings={settings}
              selected={date}
              onSelect={setDate}
            />
          )}
          {step === 2 && service && date && (
            <TimeStep
              date={date}
              getHoursForDate={getHoursForDate}
              durationMinutes={service.duration_minutes}
              selected={time}
              onSelect={setTime}
              refreshKey={refreshKey}
            />
          )}
          {step === 3 && service && date && time && (
            <ClientForm
              service={service}
              date={date}
              time={time}
              name={name}
              phone={phone}
              onNameChange={setName}
              onPhoneChange={setPhone}
            />
          )}
        </div>

        {submitError && <p className="text-xs text-red-400 mt-4 text-center">{submitError}</p>}

        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={goBack}
              className="grid place-items-center w-12 h-12 rounded-xl border border-white/10 text-white/60 active:scale-95 transition-transform shrink-0"
              aria-label="Atrás"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed() || submitting}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 ${
              canProceed() && !submitting
                ? 'bg-violet text-white shadow-button active:scale-[0.98]'
                : 'bg-white/[0.04] text-white/25 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Reservando…' : step === 3 ? 'Confirmar cita' : 'Siguiente'}
            {step < 3 && !submitting && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </section>
  )
}
