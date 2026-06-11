// ─── Direktechat med en bruker ────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, UserCircle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'

export default function DirectChat() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser, directChats, sendDirect, markRead, blockedUsers } = useAppStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const other = USERS.find((u) => u.id === userId)
  const otherIndex = USERS.findIndex((u) => u.id === userId)
  const chat = directChats[userId!] || { messages: [], unread: 0 }
  const isBlocked = blockedUsers.includes(userId ?? '')

  useEffect(() => {
    markRead(userId!)
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages.length])

  if (!other || !currentUser) return null

  const handleSend = () => {
    if (!input.trim() || isBlocked) return
    sendDirect(userId!, input.trim())
    setInput('')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header med profil-info */}
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-40 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 p-1 -ml-1">
          ‹
        </button>
        <button onClick={() => navigate(`/user/${other.id}`)} className="flex items-center gap-3 flex-1">
          <Avatar initial={other.avatar} size="sm" index={otherIndex} />
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{other.name}</p>
            <p className="text-xs text-gray-400">@{other.username}</p>
          </div>
        </button>
        <button onClick={() => navigate(`/user/${other.id}`)} className="text-gray-400">
          <UserCircle size={22} />
        </button>
      </div>

      {/* Meldinger */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {chat.messages.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Avatar initial={other.avatar} size="lg" index={otherIndex} />
            <p className="text-gray-700 font-semibold mt-3">{other.name}</p>
            <p className="text-xs text-gray-400">@{other.username} · {other.age} år · {other.area}</p>
            <p className="text-sm text-gray-400 mt-4">Start en samtale med {other.name} 👋</p>
          </div>
        )}

        {chat.messages.map((msg) => {
          const isMe = msg.from === currentUser.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-0.5`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mx-1">{msg.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Inputfelt */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 max-w-md mx-auto">
        {isBlocked ? (
          <p className="text-center text-sm text-gray-400 py-1">Du har blokkert denne brukeren</p>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder={`Skriv til ${other.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-pink-200"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform flex-shrink-0"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
