import { useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import ServiceStep from './ServiceStep'
import DateStep from './DateStep'
import TimeStep from './TimeStep'
import ClientForm from './ClientForm'
import ConfirmationCard from './ConfirmationCard'
import { genId, saveAppointment } from '../lib/storage'
import type { Appointment, Service } from '../lib/types'

const STEP_LABELS = ['Servicio', 'Día', 'Hora', 'Datos']

function fireConfetti() {
  const colors = ['#a976fa', '#cda45e', '#f5f3ff', '#7c3aed']
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.65 },
    colors,
    zIndex: 999,
  })
  setTimeout(
    () =>
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.5 },
        colors,
        zIndex: 999,
      }),
    180,
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-7 px-1">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`grid place-items-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all duration-300 ${
                i < step
                  ? 'bg-gradient-to-br from-violet-glow to-violet-deep text-white shadow-glow-sm'
                  : i === step
                    ? 'bg-gradient-to-br from-violet-glow to-violet-deep text-white shadow-glow-sm ring-4 ring-violet-glow/20'
                    : 'bg-white/[0.04] text-white/30 border border-white/10'
              }`}
            >
              {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={`text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                i <= step ? 'text-white/70' : 'text-white/25'
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className="flex-1 h-[2px] mx-1.5 -mt-4 rounded-full overflow-hidden bg-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-violet-deep to-violet-glow transition-all duration-500 ease-out"
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
  const [step, setStep] = useState(0)
  const [service, setService] = useState<Service | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

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

  const confirmBooking = () => {
    if (!service || !date || !time) return
    const appt: Appointment = {
      id: genId(),
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      date,
      time,
      clientName: name.trim(),
      clientPhone: phone.trim(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    }
    saveAppointment(appt)
    setAppointment(appt)
    setRefreshKey((k) => k + 1)
    fireConfetti()
  }

  const resetFlow = () => {
    setStep(0)
    setService(null)
    setDate(null)
    setTime(null)
    setName('')
    setPhone('')
    setAppointment(null)
  }

  if (appointment) {
    return (
      <section className="px-5 mt-8">
        <div className="glass-strong rounded-[28px] p-5 shadow-card">
          <ConfirmationCard appointment={appointment} onReset={resetFlow} />
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 mt-9 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="h-px w-4 bg-gradient-to-r from-transparent to-violet-glow/50" />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Reserva tu cita
        </h2>
      </div>

      <div className="glass-strong rounded-[28px] p-5 shadow-card">
        <Stepper step={step} />

        <div key={step} className="animate-fade-in min-h-[220px]">
          {step === 0 && <ServiceStep selected={service} onSelect={setService} />}
          {step === 1 && <DateStep selected={date} onSelect={setDate} />}
          {step === 2 && service && date && (
            <TimeStep
              date={date}
              durationMinutes={service.duration}
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

        <div className="flex items-center gap-3 mt-7">
          {step > 0 && (
            <button
              onClick={goBack}
              className="grid place-items-center w-12 h-12 rounded-2xl glass text-white/70 active:scale-95 transition-transform shrink-0"
              aria-label="Atrás"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className={`relative flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 ${
              canProceed()
                ? 'bg-gradient-to-r from-violet-glow via-violet-deep to-violet-ink text-white shadow-glow active:scale-[0.98]'
                : 'bg-white/[0.04] text-white/25 cursor-not-allowed'
            }`}
          >
            {step === 3 ? 'Confirmar cita' : 'Siguiente'}
            {step < 3 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </section>
  )
}
