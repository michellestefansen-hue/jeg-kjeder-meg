// ─── Registreringsside ────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'
import { useAppStore } from '../../store/useAppStore'
import { POSTNUMMER } from '../../data/postnummer'

export default function Register() {
  const navigate = useNavigate()
  const register = useAppStore((s) => s.register)

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [area, setArea] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showAreaPanel, setShowAreaPanel] = useState(false)

  const ageNum = parseInt(age)
  const ageValid = ageNum >= 10 && ageNum <= 17

  const handleFinish = () => {
    if (!ageValid) return
    register(name, ageNum, area || 'Oslo')
    navigate('/home')
  }

  return (
    <div className="min-h-dvh flex flex-col">
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
              <p className="text-gray-500 mt-1">Skriv postnummer eller poststed</p>
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-4 text-pink-400 pointer-events-none" />
              <input
                type="text"
                placeholder="F.eks. 2300 eller Hamar"
                value={area}
                onChange={(e) => { setArea(e.target.value); setShowAreaPanel(true) }}
                onFocus={() => setShowAreaPanel(true)}
                onBlur={() => setTimeout(() => setShowAreaPanel(false), 150)}
                className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-10 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
              />
              {area && (
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => setArea('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X size={15} className="text-gray-400" />
                </button>
              )}
            </div>
            {/* Autocomplete */}
            {showAreaPanel && area.length > 0 && (() => {
              const q = area.trim().toLowerCase()
              const hits = POSTNUMMER.filter(
                (p) => p.nr.startsWith(q) || p.sted.toLowerCase().includes(q) || p.kommune.toLowerCase().includes(q)
              )
              const seen = new Set<string>()
              const unique = hits.filter((p) => {
                const key = `${p.sted}-${p.kommune}`
                if (seen.has(key)) return false
                seen.add(key)
                return true
              }).slice(0, 6)
              if (unique.length === 0) return null
              return (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden -mt-2">
                  {unique.map((p) => (
                    <button
                      key={`${p.nr}-${p.sted}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setArea(`${p.sted}, ${p.kommune}`); setShowAreaPanel(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                    >
                      <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.sted}</p>
                        <p className="text-xs text-gray-400">{p.kommune} · {p.nr}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })()}
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
