// ─── Registreringsside ────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'
import { useAppStore } from '../../store/useAppStore'

export default function Register() {
  const navigate = useNavigate()
  const register = useAppStore((s) => s.register)

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [area, setArea] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const ageNum = parseInt(age)
  const ageValid = ageNum >= 10 && ageNum <= 17

  const handleFinish = () => {
    if (!ageValid) return
    register(name, ageNum, area || 'Oslo')
    navigate('/home')
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header title="Opprett konto" showBack={step === 1} />

      {/* Fremdriftsindikator */}
      <div className="flex gap-1.5 px-4 pt-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-pink-400' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6">
        {step === 1 && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hva heter du? 👋</h2>
              <p className="text-gray-500 mt-1">Dette er hva vennene dine ser</p>
            </div>
            <input
              type="text"
              placeholder="Fornavnet ditt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:border-pink-400 bg-gray-50"
            />
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Alder</label>
              <input
                type="number"
                placeholder="Hvor gammel er du?"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={10}
                max={17}
                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:border-pink-400 bg-gray-50"
              />
              {age && !ageValid && (
                <p className="text-red-400 text-sm mt-2">Lokka er for brukere mellom 10–17 år 🙏</p>
              )}
            </div>
            <Button variant="primary" fullWidth size="lg" disabled={!name || !ageValid} onClick={() => setStep(2)}>
              Neste
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hvor bor du? 📍</h2>
              <p className="text-gray-500 mt-1">Vi bruker dette for å finne aktiviteter i nærheten</p>
            </div>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Bydel eller sted, f.eks. Grünerløkka"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
              />
            </div>
            {/* Hurtigvalg */}
            <div className="flex flex-wrap gap-2">
              {['Grünerløkka', 'Majorstuen', 'Frogner', 'Bislett', 'St. Hanshaugen'].map((place) => (
                <button
                  key={place}
                  onClick={() => setArea(place + ', Oslo')}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${area.includes(place) ? 'bg-pink-100 border-pink-300 text-pink-600' : 'border-gray-200 text-gray-600'}`}
                >
                  {place}
                </button>
              ))}
            </div>
            <Button variant="primary" fullWidth size="lg" disabled={!area} onClick={() => setStep(3)}>
              Neste
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Logg inn-info 🔐</h2>
              <p className="text-gray-500 mt-1">Opprett en trygg konto</p>
            </div>
            <input
              type="email"
              placeholder="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
            />
            <input
              type="password"
              placeholder="Passord (minst 8 tegn)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
            />
            <p className="text-xs text-gray-400 text-center">
              Ved å opprette konto godtar du våre vilkår. Lokka er kun for brukere mellom 10–17 år.
            </p>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={!email || password.length < 8}
              onClick={handleFinish}
            >
              Opprett konto 🎉
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
