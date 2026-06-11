// ─── Se andres profil ─────────────────────────────────────────────────────────
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, UserPlus, UserCheck, ShieldOff, Shield } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Header from '../../components/layout/Header'

export default function UserProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser, activities, blockedUsers, blockUser, unblockUser } = useAppStore()
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)

  const user = USERS.find((u) => u.id === userId)
  const userIndex = USERS.findIndex((u) => u.id === userId)

  if (!user || !currentUser) return null

  const isFriend = currentUser.friends.includes(user.id)
  const isMe = user.id === currentUser.id
  const isBlocked = blockedUsers.includes(user.id)

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
    <div className="min-h-dvh pb-10">
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
        {!isMe && (
          <>
            {/* Legg til venn / allerede venn */}
            {!isBlocked && (
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

            {/* Blokker / opphev blokkering */}
            {!isBlocked ? (
              <button
                onClick={() => setShowBlockConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium text-gray-400 border border-gray-200"
              >
                <ShieldOff size={15} /> Blokker bruker
              </button>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-500">
                  <Shield size={16} />
                  <p className="text-sm font-semibold">Du har blokkert {user.name}</p>
                </div>
                <p className="text-xs text-red-400">
                  {user.name} kan ikke se profilen din, sende deg meldinger eller delta på aktivitetene dine.
                </p>
                <button
                  onClick={() => unblockUser(user.id)}
                  className="w-full py-2 rounded-xl bg-white border border-red-200 text-red-500 text-sm font-medium"
                >
                  Opphev blokkering
                </button>
              </div>
            )}
          </>
        )}

        {/* Bekreft blokker-dialog */}
        {showBlockConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowBlockConfirm(false)}>
            <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <ShieldOff size={22} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-gray-900">Blokker {user.name}?</h3>
                <p className="text-sm text-gray-500">
                  {user.name} vil ikke kunne se profilen din, skrive til deg eller delta på aktivitetene dine.
                </p>
              </div>
              <button
                onClick={() => { blockUser(user.id); setShowBlockConfirm(false); navigate(-1) }}
                className="w-full py-3 bg-red-500 text-white rounded-2xl font-semibold text-sm"
              >
                Ja, blokker {user.name}
              </button>
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold text-sm"
              >
                Avbryt
              </button>
            </div>
          </div>
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
