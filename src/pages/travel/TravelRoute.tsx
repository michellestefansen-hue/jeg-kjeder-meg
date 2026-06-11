// ─── Reiserute med animert kart ───────────────────────────────────────────────
import { useParams } from 'react-router-dom'
import { Navigation, Clock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { TRAVEL_ROUTES } from '../../data/mockData'
import Header from '../../components/layout/Header'
import { useState, useEffect, useRef } from 'react'

export default function TravelRoute() {
  const { id } = useParams()
  const { activities, currentUser } = useAppStore()
  const activity = activities.find((a) => a.id === id)
  const routes = TRAVEL_ROUTES[id as keyof typeof TRAVEL_ROUTES]
  const [selectedOption, setSelectedOption] = useState(0)
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef<number>(0)

  if (!activity || !currentUser) return null

  const routeData = routes || {
    from: currentUser.area,
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

  // Animer ruten når transportvalg endres
  useEffect(() => {
    setAnimProgress(0)
    const start = performance.now()
    const duration = 1800

    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 2)
      setAnimProgress(eased)
      if (p < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [selectedOption])

  // Rutens kontrollpunkter (kurvet vei)
  const routePath = "M 60 160 C 100 120, 160 90, 220 100 C 280 110, 320 70, 360 50"
  const totalLength = 380 // estimert stiplingslengde

  const transportColor: Record<string, string> = {
    'Kollektivt': '#6366F1',
    'Sykkel':     '#10B981',
    'Gange':      '#F59E0B',
    'Bil':        '#EF4444',
  }
  const lineColor = transportColor[selected.type] ?? '#6366F1'

  return (
    <div className="min-h-dvh pb-10">
      <Header title="Reiserute" />

      {/* ─── Kart ─── */}
      <div className="relative bg-[#EAF2E8] overflow-hidden" style={{ height: 260 }}>

        {/* Kartbakgrunn: gatenett */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 420 260" preserveAspectRatio="none">
          {/* Horisontale gater */}
          {[40,80,120,160,200,240].map((y) => (
            <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#888" strokeWidth="1" />
          ))}
          {/* Vertikale gater */}
          {[60,120,180,240,300,360].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="260" stroke="#888" strokeWidth="1" />
          ))}
          {/* Litt bredere "hovedveier" */}
          <line x1="0" y1="100" x2="420" y2="100" stroke="#aaa" strokeWidth="3" />
          <line x1="180" y1="0" x2="180" y2="260" stroke="#aaa" strokeWidth="3" />
          {/* Grøntareal */}
          <rect x="240" y="130" width="80" height="60" rx="8" fill="#C6E6C3" />
          <rect x="60" y="30" width="60" height="40" rx="6" fill="#C6E6C3" />
        </svg>

        {/* Animert rutelinje */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 260">
          {/* Hvit bakgrunnslinje (veien) */}
          <path d={routePath} stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Farget rute, animert med stroke-dasharray */}
          <path
            d={routePath}
            stroke={lineColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${animProgress * totalLength} ${totalLength}`}
            opacity="0.9"
          />

          {/* Startpunkt — grønn sirkel */}
          <circle cx="60" cy="160" r="10" fill="#22C55E" stroke="white" strokeWidth="3" />
          <text x="60" y="165" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">A</text>

          {/* Endepunkt — rosa pin */}
          <circle cx="360" cy="50" r="12" fill="#EC4899" stroke="white" strokeWidth="3" />
          <text x="360" y="55" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">B</text>

          {/* Bevegelig ikon langs ruten */}
          {animProgress > 0.05 && (
            <text
              fontSize="18"
              textAnchor="middle"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            >
              <animateMotion dur="0s" fill="freeze">
                <mpath href="#routePath" />
              </animateMotion>
              <textPath href="#routePathDef" startOffset={`${animProgress * 95}%`}>
                {selected.type === 'Sykkel' ? '🚲' : selected.type === 'Gange' ? '🚶' : '🚌'}
              </textPath>
            </text>
          )}
        </svg>

        {/* Start-label */}
        <div className="absolute left-3 bottom-3 bg-white rounded-xl px-3 py-1.5 shadow text-xs font-medium flex items-center gap-1.5 max-w-[45%]">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0" />
          <span className="truncate">{routeData.from}</span>
        </div>

        {/* Mål-label */}
        <div className="absolute right-3 top-3 bg-white rounded-xl px-3 py-1.5 shadow text-xs font-medium flex items-center gap-1.5 max-w-[45%]">
          <span className="w-2.5 h-2.5 bg-pink-500 rounded-full flex-shrink-0" />
          <span className="truncate">{routeData.to}</span>
        </div>

        {/* Avstand */}
        <div className="absolute left-3 top-3 bg-white/90 rounded-xl px-2.5 py-1 text-xs text-gray-600 flex items-center gap-1 shadow">
          <Navigation size={11} className="text-indigo-500" />
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
              <p className="text-xs text-gray-400">Avgang</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-[80px] text-center">{routeData.from.split(',')[0]}</p>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 px-2">
              <div className="h-0.5 flex-1 bg-gray-200" />
              <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: lineColor + '22' }}>
                <Clock size={11} style={{ color: lineColor }} />
                <span className="text-xs font-medium" style={{ color: lineColor }}>{selected.duration}</span>
              </div>
              <div className="h-0.5 flex-1 bg-gray-200" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{selected.arrival}</p>
              <p className="text-xs text-gray-400">Ankomst</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-[80px] text-center">{routeData.to.split(',')[0]}</p>
            </div>
          </div>
          {selected.price > 0 && (
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <p className="text-sm font-semibold text-gray-700">Reisekostnad: {selected.price} kr/pers</p>
            </div>
          )}
        </div>

        {/* Steg-for-steg */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Veibeskrivelse</h3>

          {/* Startpunkt */}
          <div className="flex items-start gap-3 mb-1">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="w-0.5 h-4 bg-gray-200 mt-1" />
            </div>
            <div className="pt-1">
              <p className="text-sm font-semibold text-gray-800">{routeData.from}</p>
              <p className="text-xs text-gray-400">Startpunkt · kl. {selected.departure}</p>
            </div>
          </div>

          {/* Steg */}
          {selected.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-1">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200 bg-white">
                  <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                </div>
                <div className="w-0.5 h-4 bg-gray-200 mt-1" />
              </div>
              <p className="text-sm text-gray-600 leading-snug pt-1.5">{step}</p>
            </div>
          ))}

          {/* Endepunkt */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div className="pt-1">
              <p className="text-sm font-semibold text-pink-700">{routeData.to}</p>
              <p className="text-xs text-gray-400">Fremme · kl. {selected.arrival}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
