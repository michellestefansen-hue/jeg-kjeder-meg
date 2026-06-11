// ─── Vipps-mock betalingsflyt ─────────────────────────────────────────────────
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'

type Step = 'overview' | 'vipps-open' | 'vipps-confirm' | 'processing' | 'success'

export default function Payment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, activities, joinActivity, payForActivity } = useAppStore()

  const activity = activities.find((a) => a.id === id)
  if (!activity || !currentUser) return null

  const totalAmount = activity.pricePerPerson + activity.travelCost
  const [step, setStep] = useState<Step>('overview')
  const [phone, setPhone] = useState('')

  const handleVippsConfirm = () => {
    setStep('processing')
    setTimeout(() => {
      joinActivity(id!)
      payForActivity(id!)
      setStep('success')
    }, 2000)
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {step !== 'success' && step !== 'vipps-open' && step !== 'vipps-confirm' && step !== 'processing' && (
        <Header title="Bli med" />
      )}

      {/* ─── Oversikt ─── */}
      {step === 'overview' && (
        <div className="flex-1 p-5 space-y-5">
          <div className="text-center py-4">
            <span className="text-5xl">{activity.emoji}</span>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{activity.title}</h2>
            <p className="text-gray-500 text-sm">{activity.location}</p>
          </div>

          {/* Prisdetaljer */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Prisdetaljer</h3>
            <PriceRow label="🎟️ Aktivitet" amount={activity.pricePerPerson} />
            <PriceRow label="🚌 Reise" amount={activity.travelCost} />
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Totalt</span>
                <span className="text-2xl font-black text-gray-900">{totalAmount} kr</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700">
            💡 Betalingen bekrefter plassen din. Alle må betale for at aktiviteten skal starte.
          </div>

          {/* Avlysningspolicy */}
          <div className="text-xs text-gray-400 text-center px-4">
            Hvis aktiviteten avlyses, refunderes hele beløpet til Vipps-kontoen din innen 3 dager.
          </div>

          <Button variant="vipps" fullWidth size="lg" onClick={() => setStep('vipps-open')}>
            <span className="text-xl font-black tracking-tight">vipps</span>
            <span>· Betal {totalAmount} kr</span>
          </Button>
        </div>
      )}

      {/* ─── Vipps: tast nummer ─── */}
      {step === 'vipps-open' && (
        <div className="flex-1 flex flex-col bg-[#FF5B24]">
          {/* Vipps topptekst */}
          <div className="flex items-center justify-between px-4 pt-12 pb-6">
            <button onClick={() => setStep('overview')} className="text-white p-1">
              <ArrowLeft size={24} />
            </button>
            <span className="text-white text-2xl font-black tracking-tighter">vipps</span>
            <div className="w-8" />
          </div>

          <div className="flex-1 bg-white rounded-t-3xl p-6 space-y-5">
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">Betal til</p>
              <p className="text-lg font-bold text-gray-900">Lokka – {activity.title}</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{totalAmount} kr</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Ditt mobilnummer</label>
              <input
                type="tel"
                placeholder="414 00 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-xl text-center tracking-widest focus:outline-none focus:border-[#FF5B24]"
                maxLength={8}
              />
            </div>

            <Button
              fullWidth
              size="lg"
              style={{ backgroundColor: '#FF5B24' }}
              className="!bg-[#FF5B24] text-white rounded-2xl font-black text-lg"
              disabled={phone.replace(/\s/g, '').length < 8}
              onClick={() => setStep('vipps-confirm')}
            >
              Neste
            </Button>

            <p className="text-center text-xs text-gray-400">
              Du vil motta en bekreftelse i Vipps-appen
            </p>
          </div>
        </div>
      )}

      {/* ─── Vipps: bekreft ─── */}
      {step === 'vipps-confirm' && (
        <div className="flex-1 flex flex-col bg-[#FF5B24]">
          <div className="flex items-center justify-between px-4 pt-12 pb-6">
            <button onClick={() => setStep('vipps-open')} className="text-white p-1">
              <ArrowLeft size={24} />
            </button>
            <span className="text-white text-2xl font-black tracking-tighter">vipps</span>
            <div className="w-8" />
          </div>

          <div className="flex-1 bg-white rounded-t-3xl p-6 space-y-5">
            <div className="text-center py-4 space-y-2">
              <div className="w-16 h-16 bg-[#FF5B24] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-3xl font-black">v</span>
              </div>
              <p className="text-gray-500 text-sm">Bekrefter betaling</p>
              <p className="text-2xl font-black text-gray-900">{totalAmount} kr</p>
              <p className="text-sm text-gray-500">til Lokka – {activity.title}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Fra</span>
                <span className="font-medium">{currentUser.name} · {phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Beløp</span>
                <span className="font-medium">{totalAmount} kr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Til</span>
                <span className="font-medium">Lokka AS</span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              className="!bg-[#FF5B24] text-white rounded-2xl font-black text-lg"
              onClick={handleVippsConfirm}
            >
              Bekreft betaling
            </Button>
          </div>
        </div>
      )}

      {/* ─── Prosesserer ─── */}
      {step === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#FF5B24]">
          <div className="bg-white rounded-3xl p-8 mx-6 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#FF5B24] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-bold text-gray-900 text-lg">Behandler betaling...</p>
            <p className="text-gray-400 text-sm">Venter på Vipps</p>
          </div>
        </div>
      )}

      {/* ─── Suksess ─── */}
      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Betaling gjennomført! 🎉</h2>
            <p className="text-gray-500">Du er nå bekreftet deltaker på</p>
            <p className="text-xl font-bold text-gray-900">{activity.emoji} {activity.title}</p>
            <p className="text-sm text-gray-400">Du har nå tilgang til gruppechatten</p>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <Button variant="primary" fullWidth size="lg" onClick={() => navigate(`/chat/${id}`)}>
              💬 Åpne gruppechat
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate(`/activity/${id}`)}>
              Se aktiviteten
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function PriceRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{amount} kr</span>
    </div>
  )
}
