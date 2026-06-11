// ─── Startside ────────────────────────────────────────────────────────────────
import { Plus, Bell, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { USERS, INVITATIONS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import BottomNav from '../../components/layout/BottomNav'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'

export default function Home() {
  const navigate = useNavigate()
  const { currentUser, activities, setActiveActivity } = useAppStore()

  if (!currentUser) { navigate('/'); return null }

  // Aktiviteter brukeren er med på (kommende)
  const myActivities = activities.filter(
    (a) => a.participants.includes(currentUser.id) && a.status !== 'completed'
  )

  // Brukerens by (første del av area, f.eks. "Grünerløkka" fra "Grünerløkka, Oslo")
  const userCity = currentUser.area.split(',')[0].trim().toLowerCase()

  // Eksakt ordmatch for by — "oslo" skal ikke matche "grünerløkka" eller andre byer
  const cityMatch = (text: string, city: string) =>
    text.toLowerCase().split(/[\s,]+/).includes(city)

  // Aktiviteter i nærheten — filtrerer på by i tillegg til alder
  const nearbyActivities = activities.filter(
    (a) =>
      !a.participants.includes(currentUser.id) &&
      a.type === 'open' &&
      a.ageRange[0] <= currentUser.age &&
      currentUser.age <= a.ageRange[1] &&
      (cityMatch(a.location, userCity) || cityMatch(a.address, userCity))
  )

  const openActivity = (id: string) => {
    setActiveActivity(id)
    navigate(`/activity/${id}`)
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd. MMM', { locale: nb })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-5 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Hei, {currentUser.name}! 👋</p>
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Lokka
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 bg-pink-50 rounded-full">
              <Bell size={20} className="text-pink-500" />
              {INVITATIONS.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
              )}
            </button>
            <Avatar initial={currentUser.avatar} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-gray-400 text-xs">
          <MapPin size={12} />
          <span>{currentUser.area}</span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">

        {/* Invitasjoner */}
        {INVITATIONS.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">📬 Invitasjoner</h2>
            <div className="space-y-2">
              {INVITATIONS.map((inv) => {
                const activity = activities.find((a) => a.id === inv.activityId)
                const fromUser = USERS.find((u) => u.id === inv.fromUserId)
                if (!activity || !fromUser) return null
                return (
                  <button
                    key={inv.id}
                    onClick={() => openActivity(activity.id)}
                    className="w-full bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activity.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{fromUser.name} inviterer deg · {formatDate(activity.date)}</p>
                      </div>
                      <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">Ny!</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Kommende aktiviteter */}
        {myActivities.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">📅 Dine kommende</h2>
            <div className="space-y-2">
              {myActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => openActivity(activity.id)}
                  className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{formatDate(activity.date)} kl. {activity.time} · {activity.location}</p>
                    </div>
                    <StatusBadge status={activity.status} />
                  </div>
                  {/* Deltakere */}
                  <div className="flex items-center gap-1 mt-3 pl-12">
                    {activity.participants.slice(0, 4).map((uid, i) => {
                      const u = USERS.find((u) => u.id === uid)
                      return u ? <Avatar key={uid} initial={u.avatar} size="xs" index={i} /> : null
                    })}
                    <span className="text-xs text-gray-400 ml-1">{activity.participants.length}/{activity.maxParticipants}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* I nærheten */}
        {nearbyActivities.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">🗺️ I nærheten</h2>
            <div className="space-y-2">
              {nearbyActivities.map((activity) => {
                const organizer = USERS.find((u) => u.id === activity.organizerId)
                return (
                  <button
                    key={activity.id}
                    onClick={() => openActivity(activity.id)}
                    className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activity.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">
                          {activity.distance} km unna · {organizer?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-pink-500">{activity.pricePerPerson} kr</p>
                        <p className="text-xs text-gray-400">{activity.participants.length}/{activity.maxParticipants} med</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* FAB: Opprett aktivitet */}
      <button
        onClick={() => navigate('/create-activity')}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-pink-300 active:scale-95 transition-transform z-40"
      >
        <Plus size={28} />
      </button>

      <BottomNav />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    planning: ['Planlegger', 'bg-blue-50 text-blue-500'],
    voting: ['Avstemming', 'bg-yellow-50 text-yellow-600'],
    confirmed: ['Bekreftet ✓', 'bg-green-50 text-green-600'],
    completed: ['Ferdig', 'bg-gray-100 text-gray-400'],
  }
  const [label, cls] = map[status] || ['Ukjent', 'bg-gray-100']
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${cls}`}>{label}</span>
}
