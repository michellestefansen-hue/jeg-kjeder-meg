// ─── Mine aktiviteter ─────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import BottomNav from '../../components/layout/BottomNav'

export default function MyActivities() {
  const navigate = useNavigate()
  const { currentUser, activities, setActiveActivity } = useAppStore()
  if (!currentUser) return null

  const mine = activities.filter((a) => a.participants.includes(currentUser.id))

  return (
    <div className="min-h-dvh pb-24">
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Mine aktiviteter 📅</h1>
      </div>

      <div className="px-4 py-4 space-y-3">
        {mine.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">😴</p>
            <p>Ingen aktiviteter ennå</p>
          </div>
        )}
        {mine.map((a) => (
          <button
            key={a.id}
            onClick={() => { setActiveActivity(a.id); navigate(`/activity/${a.id}`) }}
            className="w-full bg-white rounded-2xl p-4 text-left shadow-sm flex items-center gap-3"
          >
            <span className="text-4xl">{a.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{a.title}</p>
              <p className="text-sm text-gray-400">{a.date} · {a.time}</p>
            </div>
          </button>
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
