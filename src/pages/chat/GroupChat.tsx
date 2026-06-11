// ─── Gruppechat ───────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'

export default function GroupChat() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { currentUser, groupChats, sendGroupMessage, markGroupRead } = useAppStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const group = groupChats[groupId!]

  useEffect(() => { markGroupRead(groupId!) }, [groupId])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [group?.messages.length])

  if (!group || !currentUser) return null

  const handleSend = () => {
    if (!input.trim()) return
    sendGroupMessage(groupId!, input.trim())
    setInput('')
  }

  const members = group.members.map((id) => USERS.find((u) => u.id === id)).filter(Boolean) as typeof USERS

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-40 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl p-1 -ml-1">‹</button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-xl flex-shrink-0">
          {group.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{group.name}</p>
          <p className="text-xs text-gray-400">{group.members.length} deltakere</p>
        </div>
        {/* Vis deltakere */}
        <button
          onClick={() => {/* TODO: vis info */}}
          className="flex -space-x-1"
        >
          {members.slice(0, 3).map((u) => u ? (
            <div key={u.id} className="w-6 h-6 rounded-full border-2 border-white bg-pink-300 flex items-center justify-center text-[9px] font-bold text-white">
              {u.avatar}
            </div>
          ) : null)}
          {group.members.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
              +{group.members.length - 3}
            </div>
          )}
        </button>
      </div>

      {/* Meldinger */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {/* Gruppe-intro */}
        {group.messages.length === 0 && (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-3xl mx-auto">
              {group.emoji}
            </div>
            <p className="font-bold text-gray-800">{group.name}</p>
            <div className="flex justify-center gap-1 flex-wrap px-4">
              {members.map((u) => u ? (
                <span key={u.id} className="text-xs bg-white border border-gray-100 rounded-full px-2 py-0.5 text-gray-500 shadow-sm">
                  {u.name}
                </span>
              ) : null)}
            </div>
            <p className="text-sm text-gray-400">Gruppen er opprettet! Si hei 👋</p>
          </div>
        )}

        {group.messages.map((msg) => {
          const isMe = msg.from === currentUser.id
          const sender = USERS.find((u) => u.id === msg.from)
          const senderIdx = USERS.findIndex((u) => u.id === msg.from)

          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && sender && <Avatar initial={sender.avatar} size="xs" index={senderIdx} />}
              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && sender && (
                  <span className="text-xs text-gray-400 mb-0.5 ml-1">{sender.name}</span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 mx-1">{msg.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 max-w-md mx-auto">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={`Skriv til ${group.name}...`}
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
      </div>
    </div>
  )
}
