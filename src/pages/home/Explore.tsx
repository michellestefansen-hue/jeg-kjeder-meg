// ─── Utforsk-side med land → by-velger ───────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, X, ChevronDown, ChevronLeft } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import BottomNav from '../../components/layout/BottomNav'

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
      'Ålesund', 'Volda', 'Florø', 'Sogndal', 'Førde',
      'Voss', 'Stord', 'Odda', 'Knarvik', 'Askøy',
      'Alta', 'Hammerfest', 'Vadsø', 'Kirkenes', 'Narvik',
      'Sortland', 'Svolvær', 'Leknes', 'Mosjøen', 'Mo i Rana',
      'Brønnøysund', 'Namsos', 'Levanger', 'Verdal', 'Stjørdal',
      'Orkanger', 'Melhus', 'Røros', 'Oppdal', 'Sunndalsøra',
      'Kristiansund', 'Egersund', 'Bryne', 'Klepp', 'Forus',
      'Leirvik', 'Sauda', 'Kopervik', 'Husnes', 'Rosendal',
      'Kongsvinger', 'Elverum', 'Røros', 'Rena', 'Fagernes',
      'Ål', 'Gol', 'Nesbyen', 'Hønefoss', 'Jessheim',
      'Lillestrøm', 'Ski', 'Ås', 'Drøbak', 'Eidsvoll',
      'Mysen', 'Askim', 'Rakkestad', 'Hvaler', 'Kråkerøy',
    ],
  },
  Sverige: {
    flag: '🇸🇪',
    cities: [
      'Stockholm', 'Gøteborg', 'Malmø', 'Uppsala', 'Västerås',
      'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Umeå',
    ],
  },
  Danmark: {
    flag: '🇩🇰',
    cities: [
      'København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg',
      'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde',
    ],
  },
  Finland: {
    flag: '🇫🇮',
    cities: [
      'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu',
      'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori',
    ],
  },
  Island: {
    flag: '🇮🇸',
    cities: ['Reykjavik', 'Kópavogur', 'Hafnarfjörður', 'Akureyri'],
  },
}

import { getSuggestionsForArea } from '../../data/citySuggestions'

export default function Explore() {
  const navigate = useNavigate()
  const { currentUser, activities, setActiveActivity } = useAppStore()
  if (!currentUser) return null

  const [query, setQuery] = useState('')
  const [location, setLocation] = useState(currentUser.area)
  const [showPanel, setShowPanel] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [citySearch, setCitySearch] = useState('')

  // Hent bynavn uten land (f.eks. "Oslo" fra "Oslo, Norge")
  const selectedCity = location.split(',')[0].trim().toLowerCase()

  // Sjekk om aktiviteten hører til valgt by — eksakt ordmatch
  const matchesCity = (text: string) => {
    const words = text.toLowerCase().split(/[\s,]+/)
    return words.includes(selectedCity)
  }

  const openActivities = activities.filter(
    (a) =>
      a.type === 'open' &&
      a.ageRange[0] <= currentUser.age &&
      currentUser.age <= a.ageRange[1] &&
      (matchesCity(a.location) || matchesCity(a.address)) &&
      (query === '' ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase()))
  )

  const selectCity = (city: string, country: string) => {
    setLocation(`${city}, ${country}`)
    setShowPanel(false)
    setSelectedCountry(null)
    setCitySearch('')
  }

  const cities = selectedCountry ? COUNTRIES[selectedCountry].cities.filter((c) =>
    citySearch === '' || c.toLowerCase().includes(citySearch.toLowerCase())
  ) : []

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm space-y-3">
        <h1 className="text-xl font-bold text-gray-900">Utforsk 🗺️</h1>

        {/* Lokasjon-velger */}
        <button
          onClick={() => { setShowPanel(!showPanel); setSelectedCountry(null); setCitySearch('') }}
          className="w-full flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-2xl px-4 py-2.5"
        >
          <MapPin size={15} className="text-pink-500 flex-shrink-0" />
          <span className="flex-1 text-sm font-medium text-gray-700 text-left truncate">{location}</span>
          <ChevronDown size={15} className={`text-gray-400 transition-transform flex-shrink-0 ${showPanel ? 'rotate-180' : ''}`} />
        </button>

        {/* Panel */}
        {showPanel && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">

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
                <div className="max-h-48 overflow-y-auto">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => selectCity(city, selectedCountry)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{city}</span>
                      {location === `${city}, ${selectedCountry}` && (
                        <span className="ml-auto text-xs text-pink-500 font-medium">Valgt</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Aktivitetssøk */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Søk etter aktiviteter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">

        {/* ─── Forslag til aktiviteter i valgt by ─── */}
        {(() => {
          const cityName = location.split(',')[0].trim()
          const suggestions = getSuggestionsForArea(location)
          return (
            <section>
              <h2 className="text-sm font-bold text-gray-800 mb-3">
                ✨ Ting å gjøre i {cityName}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                {suggestions.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => navigate(`/create-activity?title=${encodeURIComponent(s.title)}&emoji=${encodeURIComponent(s.emoji)}`)}
                    className="flex-shrink-0 w-36 bg-white rounded-2xl p-3 text-left shadow-sm border border-gray-50 active:scale-95 transition-transform"
                  >
                    <span className="text-3xl">{s.emoji}</span>
                    <p className="font-semibold text-gray-900 text-sm mt-2 leading-tight">{s.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          )
        })()}

        {/* ─── Aktive arrangementer ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800">Åpne arrangementer</h2>
            <span className="text-xs bg-pink-100 text-pink-600 font-medium px-2 py-0.5 rounded-full">
              📍 {location.split(',')[0].trim()}
            </span>
          </div>

        {openActivities.map((activity) => {
          const organizer = USERS.find((u) => u.id === activity.organizerId)
          const spotsLeft = activity.maxParticipants - activity.participants.length
          return (
            <button
              key={activity.id}
              onClick={() => { setActiveActivity(activity.id); navigate(`/activity/${activity.id}`) }}
              className="w-full bg-white rounded-2xl p-4 text-left shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl">{activity.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{activity.title}</p>
                    <span className="text-sm font-bold text-pink-500">
                      {activity.pricePerPerson + activity.travelCost} kr
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{activity.location}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">📅 {activity.date}</span>
                    <span className="text-xs text-gray-400">🕐 {activity.time}</span>
                    <span className="text-xs text-green-500 font-medium">{spotsLeft} plasser igjen</span>
                  </div>
                  {organizer && (
                    <p className="text-xs text-gray-400 mt-1">Arrangert av {organizer.name}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}

          {openActivities.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-3">🌍</p>
              <p className="text-sm">Ingen åpne arrangementer i {location.split(',')[0].trim()} ennå</p>
              <p className="text-xs mt-1">Vær den første — bruk forslagene over! 👆</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
