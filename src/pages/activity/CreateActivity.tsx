// ─── Opprett aktivitet ────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Globe, Users, MapPin, ChevronDown, ChevronLeft, Search, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'

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

const ACTIVITY_SUGGESTIONS = [
  { emoji: '🎬', title: 'Kino' },
  { emoji: '🎳', title: 'Bowling' },
  { emoji: '☕', title: 'Kafé' },
  { emoji: '🛍️', title: 'Shopping' },
  { emoji: '🧺', title: 'Piknik' },
  { emoji: '🥾', title: 'Tur' },
  { emoji: '🎮', title: 'Gaming' },
  { emoji: '🍕', title: 'Pizza' },
]

export default function CreateActivity() {
  const navigate = useNavigate()
  const { currentUser, createActivity } = useAppStore()
  if (!currentUser) return null

  const friends = USERS.filter((u) => currentUser.friends.includes(u.id))

  const [step, setStep] = useState(1)
  const [type, setType] = useState<'open' | 'closed'>('open')
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('🎉')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(6)
  const [budget, setBudget] = useState('')
  const [travelCost, setTravelCost] = useState(30)
  const [allowSuggestions, setAllowSuggestions] = useState(true)
  const [invitedFriends, setInvitedFriends] = useState<string[]>([])
  const [showLocationPanel, setShowLocationPanel] = useState(false)
  const [locationCountry, setLocationCountry] = useState<string | null>(null)
  const [citySearch, setCitySearch] = useState('')

  const toggleFriend = (uid: string) => {
    setInvitedFriends((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    )
  }

  const handleCreate = () => {
    createActivity({
      title: title || 'Ny aktivitet',
      emoji,
      type,
      location,
      address: location,
      date,
      time,
      pricePerPerson: parseInt(budget) || 0,
      travelCost,
      maxParticipants,
      organizerId: currentUser.id,
      allowSuggestions,
      suggestions: [],
      ageRange: [currentUser.age - 1, currentUser.age + 1],
      invitedFriends: type === 'closed' ? invitedFriends : undefined,
      distance: 1.2,
    })
    navigate('/home')
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <Header title="Ny aktivitet" />

      {/* Fremdrift */}
      <div className="flex gap-1.5 px-4 pt-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-pink-400' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {/* ─── Steg 1: Type og tittel ─── */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hva slags arrangement? 🎉</h2>
            </div>

            {/* Type */}
            <div className="grid grid-cols-2 gap-3">
              <TypeCard
                selected={type === 'open'}
                onClick={() => setType('open')}
                icon={<Globe size={24} className="text-blue-500" />}
                title="Åpent"
                desc="Alle i nærheten kan bli med"
              />
              <TypeCard
                selected={type === 'closed'}
                onClick={() => setType('closed')}
                icon={<Lock size={24} className="text-purple-500" />}
                title="Lukket"
                desc="Kun de du inviterer"
              />
            </div>

            {/* Emoji-velger */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Emoji</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_SUGGESTIONS.map((s) => (
                  <button
                    key={s.emoji}
                    onClick={() => { setEmoji(s.emoji); setTitle(s.title) }}
                    className={`px-3 py-2 rounded-2xl border text-sm flex items-center gap-1.5 transition-colors ${
                      emoji === s.emoji ? 'bg-pink-50 border-pink-300 text-pink-600' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {s.emoji} {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Tittel */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Tittel</label>
              <input
                type="text"
                placeholder="F.eks. Kino på CC Vest"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
              />
            </div>

            <Button variant="primary" fullWidth size="lg" disabled={!title} onClick={() => setStep(2)}>
              Neste
            </Button>
          </>
        )}

        {/* ─── Steg 2: Sted, tid, deltakere ─── */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Praktisk info 📋</h2>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">📍 By</label>
              <button
                type="button"
                onClick={() => { setShowLocationPanel(!showLocationPanel); setLocationCountry(null); setCitySearch('') }}
                className={`w-full flex items-center gap-2 border-2 rounded-2xl px-4 py-3 text-left transition-colors ${location ? 'border-pink-300 bg-pink-50' : 'border-gray-100 bg-gray-50'}`}
              >
                <MapPin size={15} className="text-pink-400 flex-shrink-0" />
                <span className={`flex-1 text-base ${location ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {location || 'Velg by...'}
                </span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${showLocationPanel ? 'rotate-180' : ''}`} />
              </button>

              {showLocationPanel && (
                <div className="mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                  {!locationCountry ? (
                    <>
                      <p className="text-xs text-gray-400 font-medium px-4 pt-3 pb-2">Velg land</p>
                      {Object.entries(COUNTRIES).map(([country, { flag }]) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => setLocationCountry(country)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-t border-gray-50"
                        >
                          <span className="text-2xl">{flag}</span>
                          <span className="text-sm font-medium text-gray-800">{country}</span>
                          <ChevronDown size={14} className="ml-auto text-gray-300 -rotate-90" />
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-gray-50">
                        <button type="button" onClick={() => { setLocationCountry(null); setCitySearch('') }} className="p-1 text-gray-400">
                          <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-semibold text-gray-800">
                          {COUNTRIES[locationCountry].flag} {locationCountry}
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
                          <button type="button" onClick={() => setCitySearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                            <X size={13} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {COUNTRIES[locationCountry].cities
                          .filter((c) => !citySearch || c.toLowerCase().includes(citySearch.toLowerCase()))
                          .map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setLocation(`${city}, ${locationCountry}`)
                                setShowLocationPanel(false)
                                setLocationCountry(null)
                                setCitySearch('')
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{city}</span>
                              {location === `${city}, ${locationCountry}` && (
                                <span className="ml-auto text-xs text-pink-500 font-medium">Valgt</span>
                              )}
                            </button>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">📅 Dato</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:border-pink-400 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">🕐 Tid</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:border-pink-400 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                <Users size={14} className="inline mr-1" />
                Maks deltakere: {maxParticipants}
              </label>
              <input
                type="range"
                min={2}
                max={20}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">💰 Budsjett (kr/pers)</label>
                <input
                  type="number"
                  placeholder="150"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">🚌 Reisekostnad</label>
                <input
                  type="number"
                  value={travelCost}
                  onChange={(e) => setTravelCost(parseInt(e.target.value))}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
                />
              </div>
            </div>

            {/* Forslag fra andre */}
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Tillat forslag fra deltakere</p>
                <p className="text-xs text-gray-400">Andre kan legge til aktivitetsideer</p>
              </div>
              <button
                onClick={() => setAllowSuggestions(!allowSuggestions)}
                className={`w-11 h-6 rounded-full transition-colors ${allowSuggestions ? 'bg-pink-400' : 'bg-gray-200'}`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${allowSuggestions ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <Button variant="primary" fullWidth size="lg" disabled={!location || !date || !time} onClick={() => setStep(3)}>
              Neste
            </Button>
          </>
        )}

        {/* ─── Steg 3: Inviter venner (lukket) ─── */}
        {step === 3 && (
          <>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {type === 'closed' ? 'Inviter venner 💌' : 'Alt klart! 🎉'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {type === 'closed'
                  ? 'Velg hvem du vil ha med'
                  : 'Aktiviteten din blir synlig for jenter i nærheten på samme alder'}
              </p>
            </div>

            {type === 'closed' && (
              <div className="space-y-2">
                {friends.map((friend, i) => (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      invitedFriends.includes(friend.id)
                        ? 'bg-pink-50 border-pink-200'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <Avatar initial={friend.avatar} size="sm" index={i} />
                    <span className="flex-1 text-sm font-medium text-left text-gray-800">{friend.name}</span>
                    <span className="text-sm">{invitedFriends.includes(friend.id) ? '✓' : '+'}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Oppsummering */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 space-y-1 text-sm">
              <p className="font-semibold text-gray-800">{emoji} {title}</p>
              <p className="text-gray-500">{location} · {date} kl. {time}</p>
              <p className="text-gray-500">{maxParticipants} plasser · {budget || 0} kr/pers + {travelCost} kr reise</p>
            </div>

            <Button variant="primary" fullWidth size="lg" onClick={handleCreate}>
              Opprett aktivitet 🚀
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function TypeCard({
  selected, onClick, icon, title, desc,
}: {
  selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 text-left transition-all ${
        selected ? 'border-pink-400 bg-pink-50' : 'border-gray-100 bg-gray-50'
      }`}
    >
      {icon}
      <p className="font-semibold text-gray-900 mt-2">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </button>
  )
}
