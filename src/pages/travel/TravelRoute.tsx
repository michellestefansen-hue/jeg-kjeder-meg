// ─── Reiserute med OpenStreetMap via Leaflet ─────────────────────────────────
import { useParams } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { TRAVEL_ROUTES } from '../../data/mockData'
import Header from '../../components/layout/Header'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// ─── Fikse manglende Leaflet-ikoner ──────────────────────────────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const startIcon = new L.DivIcon({
  html: `<div style="background:#22C55E;color:white;width:28px;height:28px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">A</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const endIcon = new L.DivIcon({
  html: `<div style="background:#EC4899;color:white;width:28px;height:28px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">B</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// ─── Koordinater for norske byer og kjente steder ────────────────────────────
const COORDS: Record<string, [number, number]> = {
  // Oslo-området
  'oslo': [59.9139, 10.7522],
  'grünerløkka': [59.9226, 10.7617],
  'majorstuen': [59.9296, 10.7158],
  'frogner': [59.9194, 10.7083],
  'bislett': [59.9256, 10.7319],
  'grønland': [59.9083, 10.7669],
  'vulkan': [59.9228, 10.7513],
  'aker brygge': [59.9086, 10.7264],
  'sentrum': [59.9139, 10.7522],
  'cc vest': [59.9295, 10.6403],
  'lilleakerveien': [59.9295, 10.6403],
  'tusenfryd': [59.7861, 10.8197],
  'vinterbro': [59.7861, 10.8197],
  'frognerparken': [59.9270, 10.6994],
  'frognerbadet': [59.9244, 10.6948],
  'tj': [59.9139, 10.7522],
  // Andre byer
  'bergen': [60.3913, 5.3221],
  'trondheim': [63.4305, 10.3951],
  'stavanger': [58.9700, 5.7331],
  'tromsø': [69.6492, 18.9553],
  'kristiansand': [58.1467, 7.9956],
  'drammen': [59.7440, 10.2045],
  'fredrikstad': [59.2181, 10.9298],
  'bodø': [67.2804, 14.4049],
  'ålesund': [62.4722, 6.1549],
  'haugesund': [59.4135, 5.2680],
  'hamar': [60.7945, 11.0675],
  'lillehammer': [61.1153, 10.4662],
  'moss': [59.4343, 10.6578],
  'sarpsborg': [59.2841, 11.1099],
  'halden': [59.1220, 11.3878],
  'jessheim': [60.1426, 11.1731],
  'lillestrøm': [59.9561, 11.0498],
  'ski': [59.7236, 10.8367],
}

function getCoords(location: string): [number, number] {
  const lower = location.toLowerCase()
  for (const [key, coords] of Object.entries(COORDS)) {
    if (lower.includes(key)) return coords
  }
  return [59.9139, 10.7522] // fallback: Oslo sentrum
}

// ─── Tilpass kart-bounds til markørene ───────────────────────────────────────
function FitBounds({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds([from, to])
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [from[0], from[1], to[0], to[1]])
  return null
}

export default function TravelRoute() {
  const { id } = useParams()
  const { activities, currentUser } = useAppStore()
  const activity = activities.find((a) => a.id === id)
  const routes = TRAVEL_ROUTES[id as keyof typeof TRAVEL_ROUTES]
  const [selectedOption, setSelectedOption] = useState(0)

  if (!activity || !currentUser) return null

  const fromCity = currentUser.area.split(',')[0].trim()
  const toCity = (activity.location || activity.address || 'Oslo').split(',')[0].trim()
  const isSameCity = fromCity.toLowerCase() === toCity.toLowerCase()

  const routeData = routes || {
    from: currentUser.area,
    to: activity.location || activity.address || activity.title,
    options: [
      {
        type: 'Kollektivt',
        icon: '🚌',
        duration: isSameCity ? '20 min' : '1 t 45 min',
        departure: '13:00',
        arrival: isSameCity ? '13:20' : '14:45',
        price: isSameCity ? 40 : 249,
        steps: isSameCity
          ? [`Gå til nærmeste holdeplass i ${fromCity}`, `Ta bussen mot ${toCity}`, `Gå til ${activity.title}`]
          : [`Gå til togstasjonen i ${fromCity}`, `Ta toget til ${toCity} (ca. 1 t 30 min)`, `Ta buss eller drosje til ${activity.title}`],
      },
      {
        type: 'Bil',
        icon: '🚗',
        duration: isSameCity ? '15 min' : '1 t 20 min',
        departure: '13:00',
        arrival: isSameCity ? '13:15' : '14:20',
        price: 0,
        steps: isSameCity
          ? [`Kjør mot ${toCity} sentrum`, `Følg veien til ${activity.title}`]
          : [`Kjør ut av ${fromCity}`, `Ta E6 / riksveien mot ${toCity}`, `Følg skilting til ${activity.title}`],
      },
    ],
  }

  const selected = routeData.options[selectedOption]

  const fromCoords = getCoords(routeData.from)
  const toCoords = getCoords(routeData.to)

  const transportColor: Record<string, string> = {
    'Kollektivt': '#6366F1',
    'Sykkel': '#10B981',
    'Gange': '#F59E0B',
    'Bil': '#EF4444',
  }
  const lineColor = transportColor[selected.type] ?? '#6366F1'

  return (
    <div className="min-h-dvh pb-10">
      <Header title="Reiserute" />

      {/* ─── OpenStreetMap ─── */}
      <div style={{ height: 260 }} className="relative">
        <MapContainer
          center={fromCoords}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Tilpass bounds automatisk */}
          <FitBounds from={fromCoords} to={toCoords} />

          {/* Rute-linje */}
          <Polyline
            positions={[fromCoords, toCoords]}
            pathOptions={{ color: lineColor, weight: 5, opacity: 0.85, dashArray: selected.type === 'Kollektivt' ? '10 6' : undefined }}
          />

          {/* Startpunkt A */}
          <Marker position={fromCoords} icon={startIcon}>
            <Popup>{routeData.from}</Popup>
          </Marker>

          {/* Endepunkt B */}
          <Marker position={toCoords} icon={endIcon}>
            <Popup>{routeData.to}</Popup>
          </Marker>
        </MapContainer>

        {/* Avstand-badge */}
        <div className="absolute top-2 left-2 z-[1000] bg-white/90 rounded-xl px-2.5 py-1 text-xs text-gray-600 flex items-center gap-1 shadow">
          📍 {activity.distance ?? '?'} km
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
