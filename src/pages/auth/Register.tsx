// ─── Registreringsside ────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'
import { POSTNUMMER } from '../../data/postnummer'
import { registerUser } from '../../lib/auth'
import { useAppStore } from '../../store/useAppStore'

export default function Register() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')
  const [area, setArea] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showAreaPanel, setShowAreaPanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ageNum = parseInt(age)
  const ageValid = ageNum >= 10 && ageNum <= 17
  const usernameValid = /^[a-z0-9_.]{3,20}$/.test(username)

  const handleFinish = async () => {
    if (!ageValid || !email || password.length < 8) return
    setLoading(true)
    setError('')
    try {
      const user = await registerUser(email, password, name, username, ageNum, area || 'Oslo')
      if (user) {
        // Sett bruker i store direkte så ProtectedRoute lar oss gjennom
        login({
          id: user.id,
          name,
          username: username.toLowerCase(),
          age: ageNum,
          area: area || 'Oslo',
          avatar: name[0].toUpperCase(),
          friends: [],
        })
      }
      navigate('/home')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Noe gikk galt'
      setError(msg.includes('already') ? 'E-posten er allerede i bruk' : msg)
      setLoading(false)
    }
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
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Fornavn</label>
              <input
                type="text"
                placeholder="F.eks. Sofia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:border-pink-400 bg-gray-50"
              />
              <p className="text-xs text-gray-400 mt-1.5">Dette er navnet vennene dine ser</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Brukernavn
                <span className="text-gray-400 font-normal ml-1">— brukes for å finne deg</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">@</span>
                <input
                  type="text"
                  placeholder="ditt.brukernavn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                  maxLength={20}
                  className="w-full border-2 border-gray-100 rounded-2xl pl-8 pr-4 py-4 text-lg focus:outline-none focus:border-pink-400 bg-gray-50"
                />
              </div>
              {username.length > 0 && !usernameValid && (
                <p className="text-red-400 text-xs mt-1">3–20 tegn, kun bokstaver, tall, punktum og understrek</p>
              )}
              {usernameValid && (
                <p className="text-green-500 text-xs mt-1">✓ @{username} er tilgjengelig</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Alder
                <span className="text-gray-400 font-normal ml-1">— kun 10–17 år</span>
              </label>
              <input
                type="number"
                placeholder="F.eks. 14"
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
            <Button variant="primary" fullWidth size="lg" disabled={!name || !usernameValid || !ageValid} onClick={() => setStep(2)}>
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
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Postnummer eller poststed</label>
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
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">E-postadresse
                <span className="text-gray-400 font-normal ml-1">— brukes til innlogging</span>
              </label>
              <input
                type="email"
                placeholder="din@epost.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Passord
                <span className="text-gray-400 font-normal ml-1">— minst 8 tegn</span>
              </label>
              <input
                type="password"
                placeholder="Velg et sterkt passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
              />
              {password.length > 0 && password.length < 8 && (
                <p className="text-red-400 text-xs mt-1.5">Passordet må være minst 8 tegn</p>
              )}
              {password.length >= 8 && (
                <p className="text-green-500 text-xs mt-1.5">✓ Passordet er sterkt nok</p>
              )}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 text-center">
                {error}
              </div>
            )}
            <p className="text-xs text-gray-400 text-center">
              Ved å opprette konto godtar du våre vilkår. Lokka er kun for brukere mellom 10–17 år.
            </p>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={loading || !email || password.length < 8}
              onClick={handleFinish}
            >
              {loading ? 'Oppretter konto...' : 'Opprett konto 🎉'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
