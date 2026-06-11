// ─── Meldingsoversikt ─────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import BottomNav from '../../components/layout/BottomNav'
import { UserPlus, Plus } from 'lucide-react'

export default function Messages() {
  const navigate = useNavigate()
  const { currentUser, directChats, groupChats, blockedUsers } = useAppStore()
  if (!currentUser) return null

  const conversations = Object.entries(directChats)
    .filter(([userId]) => !blockedUsers.includes(userId))
    .map(([userId, chat]) => {
      const user = USERS.find((u) => u.id === userId)
      const last = chat.messages[chat.messages.length - 1]
      return { userId, user, last, unread: chat.unread }
    })
    .filter((c) => c.user)
    .sort((a, b) => (b.last?.time ?? '').localeCompare(a.last?.time ?? ''))

  const friends = USERS.filter(
    (u) => currentUser.friends.includes(u.id) && !blockedUsers.includes(u.id)
  )

  return (
    <div className="min-h-dvh pb-24">
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Meldinger 💬</h1>
        <button
          onClick={() => navigate('/create-group')}
          className="flex items-center gap-1.5 bg-pink-50 text-pink-500 text-xs font-semibold px-3 py-2 rounded-full"
        >
          <Plus size={14} /> Ny gruppe
        </button>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Venner — hurtigstart chat */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Venner</p>
          <div className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4">
            {friends.map((u, i) => (
              <button
                key={u.id}
                onClick={() => navigate(`/direct/${u.id}`)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className="relative">
                  <Avatar initial={u.avatar} size="md" index={i} />
                  {directChats[u.id]?.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="text-[11px] text-gray-500 max-w-[52px] truncate">{u.name}</span>
              </button>
            ))}
            <button
              onClick={() => navigate('/add-friends')}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <UserPlus size={16} className="text-gray-400" />
              </div>
              <span className="text-[11px] text-gray-400">Legg til</span>
            </button>
          </div>
        </div>

        {/* Samtaler */}
        {conversations.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Samtaler</p>
            <div className="space-y-1">
              {conversations.map(({ userId, user, last, unread }, i) => (
                <button
                  key={userId}
                  onClick={() => navigate(`/direct/${userId}`)}
                  className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm text-left"
                >
                  <Avatar initial={user!.avatar} size="md" index={i} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {user!.name}
                      </p>
                      <span className="text-[10px] text-gray-400">{last?.time}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${unread > 0 ? 'text-pink-500 font-semibold' : 'text-gray-400'}`}>
                      {last?.from === currentUser.id ? 'Du: ' : ''}{last?.text}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grupper */}
        {Object.keys(groupChats).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Grupper</p>
            <div className="space-y-1">
              {Object.entries(groupChats).map(([gid, g]) => {
                const last = g.messages[g.messages.length - 1]
                const lastSender = last ? USERS.find((u) => u.id === last.from) : null
                return (
                  <button
                    key={gid}
                    onClick={() => navigate(`/group/${gid}`)}
                    className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-xl flex-shrink-0">
                      {g.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${g.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                          {g.name}
                        </p>
                        <span className="text-[10px] text-gray-400">{last?.time}</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${g.unread > 0 ? 'text-pink-500 font-semibold' : 'text-gray-400'}`}>
                        {last
                          ? `${last.from === currentUser.id ? 'Du' : lastSender?.name ?? ''}: ${last.text}`
                          : `${g.members.length} deltakere`}
                      </p>
                    </div>
                    {g.unread > 0 && (
                      <span className="w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {g.unread}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {conversations.length === 0 && Object.keys(groupChats).length === 0 && (
          <div className="text-center py-16 space-y-2 text-gray-400">
            <p className="text-4xl">💬</p>
            <p className="text-sm">Ingen samtaler ennå</p>
            <p className="text-xs">Trykk på en venn for å chatte, eller opprett en gruppe</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
