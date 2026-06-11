// ─── Rediger profil ───────────────────────────────────────────────────────────
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, X, Check, Camera } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'

const COUNTRIES: Record<string, { flag: string; cities: string[] }> = {
  Norge: {
    flag: '🇳🇴',
    cities: [
      'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø',
      'Kristiansand', 'Drammen', 'Fredrikstad', 'Sandnes', 'Bodø',
      'Ålesund', 'Haugesund', 'Tønsberg', 'Moss', 'Sandefjord',
      'Arendal', 'Lillehammer', 'Molde', 'Gjøvik', 'Harstad',
      'Steinkjer', 'Kongsberg', 'Hamar', 'Larvik', 'Halden',
      'Sarpsborg', 'Skien', 'Porsgrunn', 'Notodden', 'Horten',
      'Volda', 'Florø', 'Sogndal', 'Førde', 'Voss', 'Stord',
      'Alta', 'Hammerfest', 'Vadsø', 'Kirkenes', 'Narvik',
      'Sortland', 'Svolvær', 'Mo i Rana', 'Brønnøysund', 'Namsos',
      'Levanger', 'Verdal', 'Stjørdal', 'Kristiansund', 'Egersund',
      'Kongsvinger', 'Elverum', 'Fagernes', 'Hønefoss', 'Jessheim',
      'Lillestrøm', 'Ski', 'Ås', 'Drøbak', 'Eidsvoll',
      'Mysen', 'Askim', 'Rakkestad', 'Hvaler', 'Røros',
    ],
  },
  Sverige: {
    flag: '🇸🇪',
    cities: ['Stockholm', 'Gøteborg', 'Malmø', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Umeå'],
  },
  Danmark: {
    flag: '🇩🇰',
    cities: ['København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
  },
  Finland: {
    flag: '🇫🇮',
    cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
  },
  Island: {
    flag: '🇮🇸',
    cities: ['Reykjavik', 'Kópavogur', 'Hafnarfjörður', 'Akureyri'],
  },
}

export default function EditProfile() {
  const navigate = useNavigate()
  const { currentUser, updateProfile, updateProfilePhoto } = useAppStore()
  if (!currentUser) { navigate('/'); return null }

  const [name, setName] = useState(currentUser.name)
  const [area, setArea] = useState(currentUser.area)
  const [showLocationPanel, setShowLocationPanel] = useState(false)
  const [saved, setSaved] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setPhotoUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    updateProfile({ name: name.trim() || currentUser.name, area })
    if (photoUrl !== currentUser.photoUrl) updateProfilePhoto(photoUrl)
    setSaved(true)
    setTimeout(() => navigate('/profile'), 800)
  }

  // Bygg flat liste av alle byer for autocomplete
  const allCities = Object.entries(COUNTRIES).flatMap(([country, { flag, cities }]) =>
    cities.map((city) => ({ city, country, flag }))
  )

  const suggestions = area.length > 0
    ? allCities.filter((c) =>
        c.city.toLowerCase().includes(area.toLowerCase()) ||
        c.country.toLowerCase().includes(area.toLowerCase())
      ).slice(0, 8)
    : []

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="Rediger profil" />

      <div className="flex-1 p-5 space-y-6">
        {/* Profilbilde */}
        <div className="flex flex-col items-center pt-2 gap-2">
          <button onClick={() => fileRef.current?.click()} className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-pink-200">
              {photoUrl ? (
                <img src={photoUrl} alt="Profilbilde" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-3xl font-black text-white">
                  {name[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            {/* Kamera-overlay */}
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
              <Camera size={22} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow">
              <Camera size={13} className="text-white" />
            </div>
          </button>
          <p className="text-xs text-gray-400">Trykk for å bytte bilde</p>

          {/* Skjult fil-input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          {/* Fjern bilde */}
          {photoUrl && (
            <button onClick={() => setPhotoUrl('')} className="text-xs text-red-400 font-medium">
              Fjern profilbilde
            </button>
          )}
        </div>

        {/* Navn */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Navn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
          />
        </div>

        {/* Lokasjon */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">📍 Lokasjon</label>

          <div className="relative">
            <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type="text"
              value={area}
              onChange={(e) => { setArea(e.target.value); setShowLocationPanel(e.target.value.length > 0) }}
              onFocus={() => setShowLocationPanel(true)}
              placeholder="Skriv by eller sted..."
              className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-10 py-3 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
            />
            {area && (
              <button onClick={() => { setArea(''); setShowLocationPanel(false) }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={15} className="text-gray-400" />
              </button>
            )}
          </div>

          {showLocationPanel && suggestions.length > 0 && (
            <div className="mt-1 border border-gray-100 rounded-2xl shadow-lg overflow-hidden bg-white max-h-52 overflow-y-auto">
              {suggestions.map(({ city, country, flag }) => (
                <button
                  key={`${city}-${country}`}
                  onMouseDown={(e) => e.preventDefault()} // hindrer blur før klikk
                  onClick={() => { setArea(`${city}, ${country}`); setShowLocationPanel(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-lg">{flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">{city}</p>
                    <p className="text-xs text-gray-400">{country}</p>
                  </div>
                  {area === `${city}, ${country}` && (
                    <Check size={14} className="ml-auto text-pink-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lagre-knapp */}
      <div className="p-5 border-t border-gray-50">
        <Button
          variant={saved ? 'secondary' : 'primary'}
          fullWidth
          size="lg"
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? '✓ Lagret!' : 'Lagre endringer'}
        </Button>
      </div>
    </div>
  )
}
