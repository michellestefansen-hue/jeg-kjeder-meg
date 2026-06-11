// ─── Gruppechat med kasse og gjøremål ────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, Plus, X, Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'

type Tab = 'chat' | 'kasse' | 'todos'

export default function GroupChat() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { currentUser, groupChats, sendGroupMessage, markGroupRead, addToGroupKasse, addGroupTodo, toggleGroupTodo, removeGroupTodo } = useAppStore()
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<Tab>('chat')
  const [addAmount, setAddAmount] = useState('')
  const [newTodo, setNewTodo] = useState('')
  const [showTodoInput, setShowTodoInput] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [seenBy, setSeenBy] = useState<string[]>([])
  const [seenMsgId, setSeenMsgId] = useState<string | null>(null)

  const group = groupChats[groupId!]

  useEffect(() => { markGroupRead(groupId!) }, [groupId])
  useEffect(() => {
    if (tab === 'chat') bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [group?.messages.length, typingUsers.length, tab])

  const members = group ? group.members.map((id) => USERS.find((u) => u.id === id)).filter(Boolean) as typeof USERS : []
  const otherMembers = members.filter((u) => u.id !== currentUser?.id)

  useEffect(() => {
    if (!group || !currentUser) return
    const myMessages = group.messages.filter((m) => m.from === currentUser.id)
    if (myMessages.length === 0) return
    const lastMy = myMessages[myMessages.length - 1]
    if (seenMsgId === lastMy.id) return
    const typers = otherMembers.slice(0, 1 + Math.floor(Math.random() * Math.min(2, otherMembers.length)))
    const delay = 800 + Math.random() * 800
    const t1 = setTimeout(() => setTypingUsers(typers.map((u) => u.id)), delay)
    const t2 = setTimeout(() => { setTypingUsers([]); setSeenBy(typers.map((u) => u.id)); setSeenMsgId(lastMy.id) }, delay + 1200 + Math.random() * 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [group?.messages.length])

  if (!group || !currentUser) return null

  const handleSend = () => {
    if (!input.trim()) return
    sendGroupMessage(groupId!, input.trim())
    setInput('')
  }

  const handleAddKasse = () => {
    const amt = parseInt(addAmount)
    if (!amt || amt <= 0) return
    addToGroupKasse(groupId!, amt)
    setAddAmount('')
  }

  const handleAddTodo = () => {
    if (!newTodo.trim()) return
    addGroupTodo(groupId!, newTodo.trim())
    setNewTodo('')
    setShowTodoInput(false)
  }

  const doneTodos = group.todos.filter((t) => t.done)
  const pendingTodos = group.todos.filter((t) => !t.done)

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 pb-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl p-1 -ml-1 leading-none">‹</button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-xl flex-shrink-0">
            {group.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{group.name}</p>
            <p className="text-xs text-gray-400">{group.members.length} deltakere</p>
          </div>
          <div className="flex -space-x-1">
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
          </div>
        </div>

        {/* Faner */}
        <div className="flex border-t border-gray-100">
          {(['chat', 'kasse', 'todos'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { chat: '💬 Chat', kasse: '💰 Kasse', todos: '✅ Gjøremål' }
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  tab === t ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'
                }`}
              >
                {labels[t]}
                {t === 'kasse' && group.kasse > 0 && (
                  <span className="ml-1 text-[10px] bg-pink-100 text-pink-500 px-1.5 py-0.5 rounded-full">{group.kasse} kr</span>
                )}
                {t === 'todos' && pendingTodos.length > 0 && (
                  <span className="ml-1 text-[10px] bg-purple-100 text-purple-500 px-1.5 py-0.5 rounded-full">{pendingTodos.length}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Chat-fane ─── */}
      {tab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
            {group.messages.length === 0 && (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-3xl mx-auto">{group.emoji}</div>
                <p className="font-bold text-gray-800">{group.name}</p>
                <div className="flex justify-center gap-1 flex-wrap px-4">
                  {members.map((u) => u ? (
                    <span key={u.id} className="text-xs bg-white border border-gray-100 rounded-full px-2 py-0.5 text-gray-500 shadow-sm">{u.name}</span>
                  ) : null)}
                </div>
                <p className="text-sm text-gray-400">Gruppen er opprettet! Si hei 👋</p>
              </div>
            )}
            {group.messages.map((msg, idx) => {
              const isMe = msg.from === currentUser.id
              const sender = USERS.find((u) => u.id === msg.from)
              const senderIdx = USERS.findIndex((u) => u.id === msg.from)
              const isLast = idx === group.messages.length - 1
              const showSeen = isMe && isLast && seenBy.length > 0 && seenMsgId === msg.id
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && sender && <Avatar initial={sender.avatar} size="xs" index={senderIdx} />}
                    <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && sender && <span className="text-xs text-gray-400 mb-0.5 ml-1">{sender.name}</span>}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 mx-1">{msg.time}</span>
                    </div>
                  </div>
                  {showSeen && (
                    <div className="flex items-center gap-1 mt-0.5 mr-1">
                      {seenBy.map((uid) => { const u = USERS.find((x) => x.id === uid); const i = USERS.findIndex((x) => x.id === uid); return u ? <Avatar key={uid} initial={u.avatar} size="xs" index={i} /> : null })}
                      <span className="text-[10px] text-gray-400">Sett</span>
                    </div>
                  )}
                </div>
              )
            })}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {typingUsers.map((uid) => { const u = USERS.find((x) => x.id === uid); const i = USERS.findIndex((x) => x.id === uid); return u ? <Avatar key={uid} initial={u.avatar} size="xs" index={i} /> : null })}
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 max-w-md mx-auto">
            <div className="flex gap-2 items-center">
              <input type="text" placeholder={`Skriv til ${group.name}...`} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-pink-200" />
              <button onClick={handleSend} disabled={!input.trim()} className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform flex-shrink-0">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Kasse-fane ─── */}
      {tab === 'kasse' && (
        <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-24">
          {/* Saldo */}
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl p-6 text-white text-center space-y-1">
            <p className="text-sm text-white/70">Felles kasse</p>
            <p className="text-5xl font-black">{group.kasse} kr</p>
            <p className="text-xs text-white/60">{group.name}</p>
          </div>

          {/* Legg til penger */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Legg til i kassen</h3>
            <div className="flex gap-2">
              {[50, 100, 200].map((amt) => (
                <button key={amt} onClick={() => setAddAmount(String(amt))}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-colors ${addAmount === String(amt) ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-600'}`}>
                  {amt} kr
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="Annet beløp..." value={addAmount} onChange={(e) => setAddAmount(e.target.value)}
                className="flex-1 border-2 border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-gray-50" />
              <button onClick={handleAddKasse} disabled={!addAmount || parseInt(addAmount) <= 0}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl text-sm font-semibold disabled:opacity-50">
                + Legg til
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-400 text-center leading-relaxed">
            Pengene i kassen brukes til å gjøre aktiviteter billigere for alle i gruppen 🎉
          </div>
        </div>
      )}

      {/* ─── Gjøremål-fane ─── */}
      {tab === 'todos' && (
        <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-10">
          {/* Legg til */}
          {showTodoInput ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <input autoFocus type="text" placeholder="Hva skal gjøres?" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 bg-gray-50" />
              <div className="flex gap-2">
                <button onClick={() => setShowTodoInput(false)} className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-500">Avbryt</button>
                <button onClick={handleAddTodo} disabled={!newTodo.trim()} className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold disabled:opacity-50">Legg til</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowTodoInput(true)} className="w-full flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-gray-400 text-sm">
              <Plus size={16} /> Legg til gjøremål
            </button>
          )}

          {/* Åpne */}
          {pendingTodos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Gjenstår ({pendingTodos.length})</p>
              {pendingTodos.map((todo) => (
                <div key={todo.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <button onClick={() => toggleGroupTodo(groupId!, todo.id)}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 hover:border-pink-400 transition-colors" />
                  <span className="flex-1 text-sm text-gray-800">{todo.text}</span>
                  <button onClick={() => removeGroupTodo(groupId!, todo.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Fullførte */}
          {doneTodos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ferdig ({doneTodos.length})</p>
              {doneTodos.map((todo) => (
                <div key={todo.id} className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3 opacity-60">
                  <button onClick={() => toggleGroupTodo(groupId!, todo.id)}
                    className="w-6 h-6 rounded-full bg-green-400 border-2 border-green-400 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </button>
                  <span className="flex-1 text-sm text-gray-500 line-through">{todo.text}</span>
                  <button onClick={() => removeGroupTodo(groupId!, todo.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {group.todos.length === 0 && (
            <div className="text-center py-10 text-gray-400 space-y-2">
              <p className="text-4xl">✅</p>
              <p className="text-sm">Ingen gjøremål ennå</p>
              <p className="text-xs">Legg til ting gruppen skal huske</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
