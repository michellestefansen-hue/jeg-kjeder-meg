// ─── Innkommende venneforespørsler ────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { UserCheck, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Header from '../../components/layout/Header'

export default function FriendRequests() {
  const navigate = useNavigate()
  const { friendRequests, acceptFriendRequest, declineFriendRequest } = useAppStore()

  const requestUsers = friendRequests
    .map((id) => USERS.find((u) => u.id === id))
    .filter(Boolean) as typeof USERS

  return (
    <div className="min-h-dvh">
      <Header title="Venneforespørsler" />

      <div className="px-4 py-5 space-y-3">
        {requestUsers.length === 0 && (
          <div className="text-center py-16 space-y-2 text-gray-400">
            <p className="text-4xl">🤝</p>
            <p className="text-sm">Ingen forespørsler akkurat nå</p>
          </div>
        )}

        {requestUsers.map((user, i) => (
          <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/user/${user.id}`)}>
                <Avatar initial={user.avatar} size="md" index={i} />
              </button>
              <button onClick={() => navigate(`/user/${user.id}`)} className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-400">@{user.username} · {user.age} år</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.area}</p>
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => acceptFriendRequest(user.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl text-sm font-semibold"
              >
                <UserCheck size={15} /> Godta
              </button>
              <button
                onClick={() => declineFriendRequest(user.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 text-gray-500 rounded-2xl text-sm font-semibold"
              >
                <X size={15} /> Avslå
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
