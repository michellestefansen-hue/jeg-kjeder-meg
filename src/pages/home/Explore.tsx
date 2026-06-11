// ─── Utforsk-side med lokasjonssøk ───────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, X, ChevronDown } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import BottomNav from '../../components/layout/BottomNav'

const OSLO_AREAS = [
  'Grünerløkka', 'Majorstuen', 'Frogner', 'Bislett', 'St. Hanshaugen',
  'Grønland', 'Tøyen', 'Sagene', 'Vulkan', 'Aker Brygge',
  'Sentrum', 'Gamle Oslo', 'Løren', 'Sinsen', 'Carl Berner',
]

export default function Explore() {
  const navigate = useNavigate()
  const { currentUser, activities, setActiveActivity } = useAppStore()
  if (!currentUser) return null

  const [query, setQuery] = useState('')
  const [location, setLocation] = useState(currentUser.area)
  const [locationInput, setLocationInput] = useState('')
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  const suggestions = locationInput.length > 0
    ? OSLO_AREAS.filter((a) => a.toLowerCase().includes(locationInput.toLowerCase()))
    : OSLO_AREAS

  const openActivities = activities.filter(
    (a) =>
      a.type === 'open' &&
      a.ageRange[0] <= currentUser.age &&
      currentUser.age <= a.ageRange[1] &&
      (query === '' ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase()))
  )

  const selectLocation = (area: string) => {
    setLocation(area + ', Oslo')
    setLocationInput('')
    setShowLocationSearch(false)
  }

  return (
    <div className="min-h-dvh bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm space-y-3">
        <h1 className="text-xl font-bold text-gray-900">Utforsk 🗺️</h1>

        {/* Lokasjon-velger */}
        <button
          onClick={() => setShowLocationSearch(!showLocationSearch)}
          className="w-full flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-2xl px-4 py-2.5"
        >
          <MapPin size={15} className="text-pink-500 flex-shrink-0" />
          <span className="flex-1 text-sm font-medium text-gray-700 text-left truncate">{location}</span>
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform flex-shrink-0 ${showLocationSearch ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Lokasjonssøk-panel */}
        {showLocationSearch && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative p-2 border-b border-gray-50">
              <Search size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Søk etter bydel eller sted..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-gray-50 rounded-xl pl-8 pr-8 py-2.5 text-sm focus:outline-none"
              />
              {locationInput && (
                <button onClick={() => setLocationInput('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
            <div className="max-h-52 overflow-y-auto">
              {suggestions.map((area) => (
                <button
                  key={area}
                  onClick={() => selectLocation(area)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <MapPin size={14} className="text-pink-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{area}, Oslo</span>
                  {location.includes(area) && (
                    <span className="ml-auto text-xs text-pink-500 font-medium">Valgt</span>
                  )}
                </button>
              ))}
            </div>
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

      <div className="px-4 py-4 space-y-3">
        {/* Aktiv lokasjon-tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Viser aktiviteter nær</span>
          <span className="text-xs bg-pink-100 text-pink-600 font-medium px-2 py-0.5 rounded-full">
            📍 {location}
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
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🌍</p>
            <p>Ingen åpne aktiviteter nær {location}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
