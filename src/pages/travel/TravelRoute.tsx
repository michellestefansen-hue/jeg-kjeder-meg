// ─── Reiserute med Google Maps-mock ───────────────────────────────────────────
import { useParams } from 'react-router-dom'
import { Navigation, Clock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { TRAVEL_ROUTES } from '../../data/mockData'
import Header from '../../components/layout/Header'
import { useState } from 'react'

export default function TravelRoute() {
  const { id } = useParams()
  const { activities } = useAppStore()
  const activity = activities.find((a) => a.id === id)
  const routes = TRAVEL_ROUTES[id as keyof typeof TRAVEL_ROUTES]

  const [selectedOption, setSelectedOption] = useState(0)

  if (!activity) return null

  const routeData = routes || {
    from: 'Din lokasjon',
    to: activity.location,
    options: [
      {
        type: 'Kollektivt',
        icon: '🚌',
        duration: '20 min',
        departure: '14:40',
        arrival: '15:00',
        price: 40,
        steps: ['Gå til nærmeste holdeplass', 'Ta bussen mot sentrum', 'Gå til destinasjonen'],
      },
    ],
  }

  const selected = routeData.options[selectedOption]

  return (
    <div className="min-h-dvh bg-gray-50 pb-10">
      <Header title="Reiserute" />

      {/* Google Maps-mock */}
      <div className="relative h-52 bg-[#e8f0e8] overflow-hidden">
        {/* Simulert kartbakgrunn */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-30">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-gray-300" />
          ))}
        </div>
        {/* Veier */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
          <path d="M 50 100 Q 150 60 200 100 Q 280 140 350 80" stroke="#fff" strokeWidth="8" fill="none" />
          <path d="M 50 100 Q 150 60 200 100 Q 280 140 350 80" stroke="#4A90D9" strokeWidth="4" fill="none" strokeDasharray="10 5" />
          <circle cx="50" cy="100" r="8" fill="#34D399" stroke="white" strokeWidth="2" />
          <circle cx="350" cy="80" r="8" fill="#F472B6" stroke="white" strokeWidth="2" />
        </svg>
        {/* Fra-til labels */}
        <div className="absolute bottom-2 left-2 bg-white rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {routeData.from}
        </div>
        <div className="absolute top-2 right-2 bg-white rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-pink-400 rounded-full" />
          {routeData.to}
        </div>
        <div className="absolute top-2 left-2 bg-white/80 rounded-xl px-3 py-1 text-xs text-gray-500 flex items-center gap-1">
          <Navigation size={10} />
          {activity.distance} km
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Transportvalg */}
        <div className="flex gap-2">
          {routeData.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(i)}
              className={`flex-1 py-3 px-3 rounded-2xl border-2 text-center transition-colors ${
                selectedOption === i ? 'border-pink-400 bg-pink-50' : 'border-gray-100 bg-white'
              }`}
            >
              <p className="text-2xl">{opt.icon}</p>
              <p className="text-xs font-semibold text-gray-700 mt-1">{opt.type}</p>
              <p className="text-xs text-gray-400">{opt.duration}</p>
            </button>
          ))}
        </div>

        {/* Avgangstider */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{selected.departure}</p>
              <p className="text-xs text-gray-400">Avgangstid</p>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1">
              <div className="h-0.5 flex-1 bg-gray-200" />
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                <Clock size={11} className="text-blue-400" />
                <span className="text-xs text-blue-500 font-medium">{selected.duration}</span>
              </div>
              <div className="h-0.5 flex-1 bg-gray-200" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{selected.arrival}</p>
              <p className="text-xs text-gray-400">Ankomst</p>
            </div>
          </div>
          {selected.price > 0 && (
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <p className="text-sm font-semibold text-gray-700">Reisekostnad: {selected.price} kr/pers</p>
            </div>
          )}
        </div>

        {/* Steg */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Veibeskrivelse</h3>
          <div className="space-y-3">
            {selected.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-pink-500">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-snug">{step}</p>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">📍</span>
              </div>
              <p className="text-sm font-semibold text-green-700">{routeData.to}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
