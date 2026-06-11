// ─── Legg til venner via brukernavn ──────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, UserCheck, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Header from '../../components/layout/Header'

export default function AddFriends() {
  const navigate = useNavigate()
  const { currentUser, addFriend, blockedUsers } = useAppStore()
  const [query, setQuery] = useState('')
  const [justAdded, setJustAdded] = useState<string[]>([])

  if (!currentUser) return null

  const results = query.trim().length > 0
    ? USERS.filter((u) =>
        u.id !== currentUser.id &&
        !blockedUsers.includes(u.id) &&
        (
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    : []

  const atLimit = currentUser.friends.length >= 150

  const handleAdd = (userId: string) => {
    if (atLimit) return
    addFriend(userId)
    setJustAdded((prev) => [...prev, userId])
  }

  const isFriend = (userId: string) =>
    currentUser.friends.includes(userId) || justAdded.includes(userId)

  return (
    <div className="min-h-dvh">
      <Header title="Legg til venner" />

      <div className="px-4 py-5 space-y-5">
        {atLimit && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 text-sm text-yellow-700 text-center">
            Du har nådd grensen på 150 venner
          </div>
        )}
        {/* Søkefelt */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            autoFocus
            type="text"
            placeholder="Søk på brukernavn eller navn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-10 py-3.5 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={15} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Hint */}
        {query.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <p className="text-4xl">🔍</p>
            <p className="text-gray-500 text-sm">Skriv brukernavnet til en venn</p>
            <p className="text-gray-400 text-xs">F.eks. @emma_oslo eller @sofia14</p>
          </div>
        )}

        {/* Ingen treff */}
        {query.length > 0 && results.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <p className="text-4xl">😕</p>
            <p className="text-gray-500 text-sm">Ingen brukere funnet for "{query}"</p>
            <p className="text-gray-400 text-xs">Sjekk at brukernavnet er riktig skrevet</p>
          </div>
        )}

        {/* Resultater */}
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((user, i) => {
              const already = isFriend(user.id)
              return (
                <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <button onClick={() => navigate(`/user/${user.id}`)}>
                    <Avatar initial={user.avatar} size="md" index={i} />
                  </button>
                  <button onClick={() => navigate(`/user/${user.id}`)} className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-400">@{user.username} · {user.age} år</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user.area}</p>
                  </button>
                  <button
                    onClick={() => !already && handleAdd(user.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      already
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    }`}
                  >
                    {already ? (
                      <><UserCheck size={14} /> Venner</>
                    ) : (
                      <><UserPlus size={14} /> Legg til</>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
