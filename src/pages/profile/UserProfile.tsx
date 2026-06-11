// ─── Se andres profil ─────────────────────────────────────────────────────────
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, UserPlus, UserCheck } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Header from '../../components/layout/Header'

export default function UserProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser, activities } = useAppStore()

  const user = USERS.find((u) => u.id === userId)
  const userIndex = USERS.findIndex((u) => u.id === userId)

  if (!user || !currentUser) return null

  const isFriend = currentUser.friends.includes(user.id)
  const isMe = user.id === currentUser.id

  // Felles aktiviteter
  const sharedActivities = activities.filter(
    (a) => a.participants.includes(user.id) && a.participants.includes(currentUser.id)
  )

  // Alle aktiviteter brukeren er med på (åpne)
  const userActivities = activities.filter(
    (a) => a.participants.includes(user.id) && a.type === 'open'
  )

  const userFriends = USERS.filter((u) => user.friends.includes(u.id))

  return (
    <div className="min-h-dvh bg-gray-50 pb-10">
      <Header title={user.name} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 px-4 pt-6 pb-8 text-white">
        <div className="flex items-center gap-4">
          <Avatar initial={user.avatar} size="lg" index={userIndex} />
          <div>
            <h1 className="text-2xl font-black">{user.name}</h1>
            <p className="text-pink-100 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {user.area}
            </p>
            <p className="text-pink-100 text-sm mt-0.5">{user.age} år</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <StatCard value={userActivities.length} label="Aktiviteter" />
          <StatCard value={userFriends.length} label="Venner" />
          <StatCard value={sharedActivities.length} label="Felles" />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Legg til venn / allerede venn */}
        {!isMe && (
          <button
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-colors ${
              isFriend
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-200'
            }`}
          >
            {isFriend ? (
              <><UserCheck size={16} /> Venner</>
            ) : (
              <><UserPlus size={16} /> Legg til venn</>
            )}
          </button>
        )}

        {/* Felles aktiviteter */}
        {sharedActivities.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              🤝 Felles aktiviteter
            </h3>
            <div className="space-y-2">
              {sharedActivities.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/activity/${a.id}`)}
                  className="w-full flex items-center gap-3 py-2 text-left"
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.date} · {a.location}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Åpne aktiviteter */}
        {userActivities.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              📅 {user.name}s aktiviteter
            </h3>
            <div className="space-y-2">
              {userActivities.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/activity/${a.id}`)}
                  className="w-full flex items-center gap-3 py-2 text-left"
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.date} · {a.location}</p>
                  </div>
                  <span className="text-xs text-pink-500 font-medium">
                    {a.pricePerPerson + a.travelCost} kr
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Venner */}
        {userFriends.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              👯 Venner
            </h3>
            <div className="flex flex-wrap gap-3">
              {userFriends.map((friend, i) => (
                <button
                  key={friend.id}
                  onClick={() => navigate(`/user/${friend.id}`)}
                  className="flex flex-col items-center gap-1"
                >
                  <Avatar initial={friend.avatar} size="sm" index={i} />
                  <span className="text-xs text-gray-500">{friend.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/20 rounded-2xl px-3 py-3 text-center">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-pink-100 text-xs">{label}</p>
    </div>
  )
}
