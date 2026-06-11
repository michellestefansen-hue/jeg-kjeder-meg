// ─── Rediger profil ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronDown, ChevronLeft, Search, X, Check } from 'lucide-react'
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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [citySearch, setCitySearch] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile({ name: name.trim() || currentUser.name, area })
    setSaved(true)
    setTimeout(() => navigate('/profile'), 800)
  }

  const selectCity = (city: string, country: string) => {
    setArea(`${city}, ${country}`)
    setShowLocationPanel(false)
    setSelectedCountry(null)
    setCitySearch('')
  }

  const cities = selectedCountry
    ? COUNTRIES[selectedCountry].cities.filter(
        (c) => !citySearch || c.toLowerCase().includes(citySearch.toLowerCase())
      )
    : []

  return (
    <div className="min-h-dvh bg-white flex flex-col">
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

          <button
            onClick={() => { setShowLocationPanel(!showLocationPanel); setSelectedCountry(null); setCitySearch('') }}
            className={`w-full flex items-center gap-2 border-2 rounded-2xl px-4 py-3 text-left transition-colors ${
              showLocationPanel ? 'border-pink-400 bg-pink-50' : 'border-gray-100 bg-gray-50'
            }`}
          >
            <MapPin size={15} className="text-pink-400 flex-shrink-0" />
            <span className="flex-1 text-base text-gray-800 font-medium">{area}</span>
            <ChevronDown size={15} className={`text-gray-400 transition-transform ${showLocationPanel ? 'rotate-180' : ''}`} />
          </button>

          {showLocationPanel && (
            <div className="mt-2 border border-gray-100 rounded-2xl shadow-lg overflow-hidden bg-white">

              {/* Steg 1: velg land */}
              {!selectedCountry && (
                <>
                  <p className="text-xs text-gray-400 font-medium px-4 pt-3 pb-2">Velg land</p>
                  {Object.entries(COUNTRIES).map(([country, { flag }]) => (
                    <button
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-t border-gray-50"
                    >
                      <span className="text-2xl">{flag}</span>
                      <span className="text-sm font-medium text-gray-800">{country}</span>
                      <ChevronDown size={14} className="ml-auto text-gray-300 -rotate-90" />
                    </button>
                  ))}
                </>
              )}

              {/* Steg 2: velg by */}
              {selectedCountry && (
                <>
                  <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-gray-50">
                    <button onClick={() => { setSelectedCountry(null); setCitySearch('') }} className="p-1 text-gray-400">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-semibold text-gray-800">
                      {COUNTRIES[selectedCountry].flag} {selectedCountry}
                    </span>
                  </div>
                  <div className="relative p-2 border-b border-gray-50">
                    <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Søk etter by..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl pl-8 pr-8 py-2.5 text-sm focus:outline-none"
                    />
                    {citySearch && (
                      <button onClick={() => setCitySearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <X size={13} className="text-gray-400" />
                      </button>
                    )}
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => selectCity(city, selectedCountry)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{city}</span>
                        {area === `${city}, ${selectedCountry}` && (
                          <Check size={14} className="ml-auto text-pink-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
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
