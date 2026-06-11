// ─── Rediger profil ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, X, Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import Header from '../../components/layout/Header'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

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
  const { currentUser, updateProfile } = useAppStore()
  if (!currentUser) { navigate('/'); return null }

  const [name, setName] = useState(currentUser.name)
  const [area, setArea] = useState(currentUser.area)
  const [showLocationPanel, setShowLocationPanel] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile({ name: name.trim() || currentUser.name, area })
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
        {/* Avatar */}
        <div className="flex justify-center pt-2">
          <div className="relative">
            <Avatar initial={name[0]?.toUpperCase() || '?'} size="lg" />
          </div>
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
