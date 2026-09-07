import { useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ServiceStep from './ServiceStep'
import DateStep from './DateStep'
import TimeStep from './TimeStep'
import ClientForm from './ClientForm'
import ConfirmationCard from './ConfirmationCard'
import { genId, saveAppointment } from '../lib/storage'
import type { Appointment, Service } from '../lib/types'

const STEP_LABELS = ['Servicio', 'Día', 'Hora', 'Datos']

function fireConfetti() {
  const colors = ['#a855f7', '#c084fc', '#f5f3ff', '#6d28d9']
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
    // volver a "hora" invalida la hora elegida si cambiamos de día antes; aquí solo retrocedemos.
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
        <div className="glass rounded-3xl p-5 shadow-card">
          <ConfirmationCard appointment={appointment} onReset={resetFlow} />
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 mt-8 animate-slide-up" style={{ animationDelay: '380ms' }}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
        Reserva tu cita
      </h2>

      <div className="glass rounded-3xl p-5 shadow-card">
        {/* Progreso */}
        <div className="flex items-center gap-2 mb-5">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-violet-glow' : 'bg-white/10'
                }`}
              />
              <span
                className={`text-[10px] mt-1 block ${
                  i === step ? 'text-violet-glow font-semibold' : 'text-white/30'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

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

        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={goBack}
              className="grid place-items-center w-12 h-12 rounded-xl glass text-white/70 active:scale-95 transition-transform shrink-0"
              aria-label="Atrás"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-violet-glow to-violet-deep text-white shadow-glow active:scale-[0.98]'
                : 'bg-white/5 text-white/25 cursor-not-allowed'
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
