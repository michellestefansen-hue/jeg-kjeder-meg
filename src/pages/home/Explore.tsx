// ─── Utforsk-side ─────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import BottomNav from '../../components/layout/BottomNav'

export default function Explore() {
  const navigate = useNavigate()
  const { currentUser, activities, setActiveActivity } = useAppStore()
  if (!currentUser) return null

  const openActivities = activities.filter(
    (a) => a.type === 'open' && a.ageRange[0] <= currentUser.age && currentUser.age <= a.ageRange[1]
  )

  return (
    <div className="min-h-dvh bg-gray-50 pb-24">
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Utforsk 🗺️</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Søk etter aktiviteter..."
            className="w-full bg-gray-100 rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
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
                    <span className="text-sm font-bold text-pink-500">{activity.pricePerPerson + activity.travelCost} kr</span>
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
            <p>Ingen åpne aktiviteter i nærheten akkurat nå</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
