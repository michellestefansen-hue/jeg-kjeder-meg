// ─── Aktivitetschat ───────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Header from '../../components/layout/Header'

export default function Chat() {
  const { id } = useParams()
  const { currentUser, activities, messages, sendMessage, payments } = useAppStore()
  const activity = activities.find((a) => a.id === id)
  const activityMessages = messages[id!] || []

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sjekk om brukeren har betalt
  const activityPayments = payments[id!] || []
  const hasPaid = activityPayments.find((p) => p.userId === currentUser?.id)?.paid === true
  const isParticipant = activity?.participants.includes(currentUser?.id ?? '') ?? false

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activityMessages.length])

  if (!activity || !currentUser) return null

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(id!, input.trim())
    setInput('')
  }

  const canChat = isParticipant && hasPaid

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <Header title={`${activity.emoji} ${activity.title}`} />

      {/* Deltakere-stripe */}
      <div className="bg-white px-4 py-2 flex items-center gap-1.5 border-b border-gray-100">
        {activity.participants.slice(0, 6).map((uid, i) => {
          const u = USERS.find((x) => x.id === uid)
          return u ? <Avatar key={uid} initial={u.avatar} size="xs" index={i} /> : null
        })}
        <span className="text-xs text-gray-400 ml-1">{activity.participants.length} deltakere</span>
      </div>

      {/* Meldinger */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {activityMessages.map((msg) => {
          const sender = USERS.find((u) => u.id === msg.userId)
          const isMe = msg.userId === currentUser.id
          const idx = USERS.findIndex((u) => u.id === msg.userId)

          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && sender && <Avatar initial={sender.avatar} size="xs" index={idx} />}
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMe && sender && (
                  <span className="text-xs text-gray-400 mb-1 ml-1">{sender.name}</span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 mx-1">{msg.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Inputfelt */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 max-w-md mx-auto">
        {canChat ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Skriv noe..."
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
        ) : (
          <div className="text-center py-2 text-sm text-gray-400">
            🔒 Betal for å få tilgang til chatten
          </div>
        )}
      </div>
    </div>
  )
}
