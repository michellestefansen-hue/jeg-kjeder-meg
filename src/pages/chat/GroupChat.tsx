// ─── Gruppechat med kasse, lykkehjul og fullført ─────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, Plus, X, Trash2 } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'

type Tab = 'chat' | 'kasse' | 'hjul' | 'gjort'

const EMOJIS = ['🎬', '🎳', '☕', '🛍️', '🧺', '🥾', '🎮', '🍕', '🎵', '🏊', '🎡', '🎤']

// ─── Spin the Wheel (canvas) ──────────────────────────────────────────────────
const COLORS = ['#F472B6', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#C084FC', '#38BDF8']

function WheelCanvas({ items, onSpin, spunOnce }: {
  items: { id: string; text: string; emoji: string }[]
  onSpin: (winnerId: string) => void
  spunOnce: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const rotRef = useRef(0)
  const animRef = useRef(0)
  const segAngle = (2 * Math.PI) / items.length

  const draw = (rot: number) => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 8
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    items.forEach((seg, i) => {
      const start = rot + i * segAngle - Math.PI / 2
      ctx.beginPath(); ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, start + segAngle)
      ctx.closePath(); ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + segAngle / 2)
      ctx.textAlign = 'right'; ctx.font = '13px system-ui'; ctx.fillStyle = '#fff'
      ctx.fillText(`${seg.emoji} ${seg.text.slice(0, 8)}`, r - 10, 5)
      ctx.restore()
    })
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#e9d5ff'; ctx.lineWidth = 3; ctx.stroke()
  }

  useEffect(() => { draw(rotRef.current) }, [items.length])

  const spin = () => {
    if (spinning || winner || spunOnce) return
    setSpinning(true)
    const total = (5 + Math.random() * 5) * 2 * Math.PI + Math.random() * 2 * Math.PI
    const dur = 4000; const start = performance.now(); const startRot = rotRef.current
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const rot = startRot + total * eased
      rotRef.current = rot; draw(rot)
      if (p < 1) { animRef.current = requestAnimationFrame(animate) }
      else {
        const norm = ((-rot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const idx = Math.floor(norm / segAngle) % items.length
        const w = items[idx]
        setWinner(w.text); setSpinning(false); onSpin(w.id)
      }
    }
    animRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl z-10">▼</div>
        <canvas ref={canvasRef} width={260} height={260} className="rounded-full shadow-xl shadow-pink-200" />
      </div>
      {winner ? (
        <div className="bg-white rounded-2xl px-6 py-4 shadow text-center">
          <p className="text-3xl mb-1">🎉</p>
          <p className="font-black text-gray-900 text-lg">{winner}</p>
          <p className="text-xs text-gray-400 mt-1">Hjulet har bestemt!</p>
        </div>
      ) : (
        <button
          onClick={spin}
          disabled={spinning || spunOnce}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl text-sm disabled:opacity-50"
        >
          {spinning ? '🎡 Snurrer...' : spunOnce ? 'Allerede snurret' : '🎡 Snurr hjulet!'}
        </button>
      )}
    </div>
  )
}

// ─── Hoved-komponent ──────────────────────────────────────────────────────────
export default function GroupChat() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const store = useAppStore()
  const { currentUser, groupChats, sendGroupMessage, markGroupRead, addToGroupKasse,
    addWheelItem, removeWheelItem, voteWheelItem, startVoting, finishVoting, setWheelWinner, resetWheel, markDone } = store

  const [input, setInput] = useState('')
  const [tab, setTab] = useState<Tab>('chat')
  const [addAmount, setAddAmount] = useState('')
  const [newItem, setNewItem] = useState('')
  const [newEmoji, setNewEmoji] = useState('🎉')
  const [showAddItem, setShowAddItem] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [seenBy, setSeenBy] = useState<string[]>([])
  const [seenMsgId, setSeenMsgId] = useState<string | null>(null)

  const group = groupChats[groupId!]
  useEffect(() => { markGroupRead(groupId!) }, [groupId])
  useEffect(() => { if (tab === 'chat') bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [group?.messages.length, typingUsers.length, tab])

  if (!group || !currentUser) return (
    <div className="min-h-dvh flex items-center justify-center text-gray-400">
      <div className="text-center space-y-2">
        <p className="text-4xl">✅</p>
        <p className="font-semibold text-gray-700">Aktiviteten er fullført!</p>
        <p className="text-sm">Gruppen ble slettet</p>
        <button onClick={() => navigate('/messages')} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-2xl text-sm font-medium">Tilbake</button>
      </div>
    </div>
  )

  const members = group.members.map((id) => USERS.find((u) => u.id === id)).filter(Boolean) as typeof USERS
  const otherMembers = members.filter((u) => u.id !== currentUser.id)
  const wheel = group.wheel
  const activeItems = wheel.phase === 'runoff' || wheel.phase === 'spinning'
    ? wheel.items.filter((i) => wheel.runoffIds.includes(i.id))
    : wheel.items

  // ─── Sim skriveindikator ──────────────────────────────────────────────────
  useEffect(() => {
    if (!group || !currentUser) return
    const myMsgs = group.messages.filter((m) => m.from === currentUser.id)
    if (!myMsgs.length) return
    const last = myMsgs[myMsgs.length - 1]
    if (seenMsgId === last.id) return
    const typers = otherMembers.slice(0, 1 + Math.floor(Math.random() * Math.min(2, otherMembers.length)))
    const d = 800 + Math.random() * 800
    const t1 = setTimeout(() => setTypingUsers(typers.map((u) => u.id)), d)
    const t2 = setTimeout(() => { setTypingUsers([]); setSeenBy(typers.map((u) => u.id)); setSeenMsgId(last.id) }, d + 1500 + Math.random() * 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [group.messages.length])

  const handleSend = () => { if (!input.trim()) return; sendGroupMessage(groupId!, input.trim()); setInput('') }
  const handleAddKasse = () => { const a = parseInt(addAmount); if (!a || a <= 0) return; addToGroupKasse(groupId!, a); setAddAmount('') }
  const handleAddItem = () => {
    if (!newItem.trim()) return
    addWheelItem(groupId!, newItem.trim(), newEmoji)
    setNewItem(''); setShowAddItem(false)
  }

  const myDone = group.completedBy.includes(currentUser.id)
  const doneCount = group.completedBy.length
  const totalCount = group.members.length
  const donePercent = Math.round((doneCount / totalCount) * 100)

  const TABS: { key: Tab; label: string }[] = [
    { key: 'chat', label: '💬' },
    { key: 'kasse', label: '💰' },
    { key: 'hjul', label: '🎡' },
    { key: 'gjort', label: '✅' },
  ]

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 pb-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl p-1 -ml-1 leading-none">‹</button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-xl flex-shrink-0">{group.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{group.name}</p>
            <p className="text-xs text-gray-400">{group.members.length} deltakere</p>
          </div>
          <div className="flex -space-x-1">
            {members.slice(0, 3).map((u) => u ? <div key={u.id} className="w-6 h-6 rounded-full border-2 border-white bg-pink-300 flex items-center justify-center text-[9px] font-bold text-white">{u.avatar}</div> : null)}
          </div>
        </div>
        <div className="flex border-t border-gray-100">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-base transition-colors ${tab === key ? 'border-b-2 border-pink-500' : 'text-gray-400'}`}>
              {label}
              {key === 'kasse' && group.kasse > 0 && <span className="ml-0.5 text-[9px] bg-pink-100 text-pink-500 px-1 rounded-full">{group.kasse}</span>}
              {key === 'gjort' && doneCount > 0 && <span className="ml-0.5 text-[9px] bg-green-100 text-green-600 px-1 rounded-full">{doneCount}/{totalCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CHAT ─── */}
      {tab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
            {group.messages.length === 0 && (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-3xl mx-auto">{group.emoji}</div>
                <p className="font-bold text-gray-800">{group.name}</p>
                <p className="text-sm text-gray-400">Gruppen er klar! Si hei 👋</p>
              </div>
            )}
            {group.messages.map((msg, idx) => {
              const isMe = msg.from === currentUser.id
              const sender = USERS.find((u) => u.id === msg.from)
              const sIdx = USERS.findIndex((u) => u.id === msg.from)
              const isLast = idx === group.messages.length - 1
              const showSeen = isMe && isLast && seenBy.length > 0 && seenMsgId === msg.id
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && sender && <Avatar initial={sender.avatar} size="xs" index={sIdx} />}
                    <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && sender && <span className="text-xs text-gray-400 mb-0.5 ml-1">{sender.name}</span>}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>{msg.text}</div>
                      <span className="text-[10px] text-gray-400 mt-0.5 mx-1">{msg.time}</span>
                    </div>
                  </div>
                  {showSeen && <div className="flex items-center gap-1 mt-0.5 mr-1">{seenBy.map((uid) => { const u = USERS.find((x) => x.id === uid); const i = USERS.findIndex((x) => x.id === uid); return u ? <Avatar key={uid} initial={u.avatar} size="xs" index={i} /> : null })}<span className="text-[10px] text-gray-400">Sett</span></div>}
                </div>
              )
            })}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">{typingUsers.map((uid) => { const u = USERS.find((x) => x.id === uid); const i = USERS.findIndex((x) => x.id === uid); return u ? <Avatar key={uid} initial={u.avatar} size="xs" index={i} /> : null })}</div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1">
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
              <input type="text" placeholder={`Skriv til ${group.name}...`} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              <button onClick={handleSend} disabled={!input.trim()} className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center disabled:opacity-50 flex-shrink-0"><Send size={16} className="text-white" /></button>
            </div>
          </div>
        </>
      )}

      {/* ─── KASSE ─── */}
      {tab === 'kasse' && (
        <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-10">
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl p-6 text-white text-center space-y-1">
            <p className="text-sm text-white/70">Felles kasse</p>
            <p className="text-5xl font-black">{group.kasse} kr</p>
            <p className="text-xs text-white/60">{group.name}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Legg til</h3>
            <div className="flex gap-2">{[50, 100, 200].map((a) => <button key={a} onClick={() => setAddAmount(String(a))} className={`flex-1 py-2 rounded-xl border text-sm font-semibold ${addAmount === String(a) ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-600'}`}>{a} kr</button>)}</div>
            <div className="flex gap-2">
              <input type="number" placeholder="Annet beløp..." value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="flex-1 border-2 border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-gray-50" />
              <button onClick={handleAddKasse} disabled={!addAmount || parseInt(addAmount) <= 0} className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl text-sm font-semibold disabled:opacity-50">+ Legg til</button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">Brukes til å gjøre aktiviteter billigere for alle 🎉</p>
        </div>
      )}

      {/* ─── LYKKEHJUL ─── */}
      {tab === 'hjul' && (
        <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-10">

          {/* Fase: legge til forslag */}
          {wheel.phase === 'adding' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">🎡 Lykkehjul</h2>
                {wheel.items.length >= 2 && (
                  <button onClick={() => startVoting(groupId!)} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-2xl">
                    Start avstemming →
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">Alle legger til aktiviteter de vil gjøre. Deretter stemmer dere!</p>
              {wheel.items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{item.text}</span>
                  {item.addedBy === currentUser.id && (
                    <button onClick={() => removeWheelItem(groupId!, item.id)} className="text-gray-300 hover:text-red-400"><X size={15} /></button>
                  )}
                </div>
              ))}
              {showAddItem ? (
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex flex-wrap gap-1.5">{EMOJIS.map((e) => <button key={e} onClick={() => setNewEmoji(e)} className={`text-xl p-1.5 rounded-xl ${newEmoji === e ? 'bg-pink-100' : ''}`}>{e}</button>)}</div>
                  <input autoFocus type="text" placeholder="Hva vil du gjøre?" value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddItem()} className="w-full border-2 border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-gray-50" />
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddItem(false)} className="flex-1 py-2 rounded-2xl border text-sm text-gray-500">Avbryt</button>
                    <button onClick={handleAddItem} disabled={!newItem.trim()} className="flex-1 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold disabled:opacity-50">Legg til</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddItem(true)} className="w-full flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-gray-400 text-sm">
                  <Plus size={16} /> Legg til forslag
                </button>
              )}
            </>
          )}

          {/* Fase: stemming (inkl. omgang) */}
          {(wheel.phase === 'voting' || wheel.phase === 'runoff') && (
            <>
              <div className="text-center space-y-1">
                <h2 className="font-bold text-gray-900">{wheel.phase === 'runoff' ? '🔁 Omgang — uavgjort!' : '🗳️ Stem!'}</h2>
                <p className="text-xs text-gray-400">{wheel.phase === 'runoff' ? 'Stem på nytt mellom de som var uavgjort' : 'Trykk på det du vil gjøre'}</p>
              </div>
              {activeItems.map((item) => {
                const voted = item.votes.includes(currentUser.id)
                const pct = wheel.items.reduce((s, i) => s + i.votes.length, 0) > 0
                  ? Math.round((item.votes.length / wheel.items.reduce((s, i) => s + i.votes.length, 0)) * 100) : 0
                return (
                  <button key={item.id} onClick={() => voteWheelItem(groupId!, item.id)}
                    className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 text-left transition-all ${voted ? 'border-pink-400 bg-pink-50' : 'border-transparent'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><span className="text-2xl">{item.emoji}</span><span className="font-semibold text-gray-900">{item.text}</span></div>
                      <span className="text-xl">{voted ? '❤️' : '🤍'}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.votes.length} stemmer</p>
                  </button>
                )
              })}
              <button onClick={() => finishVoting(groupId!)} className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl text-sm">
                Avslutt stemming →
              </button>
            </>
          )}

          {/* Fase: Spin the Wheel (etter to uavgjort) */}
          {wheel.phase === 'spinning' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="font-bold text-gray-900">🎡 Spin the Wheel!</h2>
                <p className="text-xs text-gray-400">To ganger uavgjort — hjulet avgjør nå. Kan kun snurres én gang!</p>
              </div>
              <WheelCanvas
                items={wheel.items.filter((i) => wheel.runoffIds.includes(i.id))}
                onSpin={(wId) => setWheelWinner(groupId!, wId)}
                spunOnce={wheel.spunOnce}
              />
            </div>
          )}

          {/* Fase: Vinner! */}
          {wheel.phase === 'done' && (
            <div className="space-y-4">
              {(() => {
                const w = wheel.items.find((i) => i.id === wheel.winner)
                return w ? (
                  <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl p-8 text-white text-center space-y-2">
                    <p className="text-5xl">{w.emoji}</p>
                    <p className="text-2xl font-black">{w.text}</p>
                    <p className="text-white/70 text-sm">🎉 Det ble valgt!</p>
                  </div>
                ) : null
              })()}
              <button onClick={() => resetWheel(groupId!)} className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl text-sm text-gray-500">
                <Trash2 size={14} /> Start på nytt
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── FULLFØRT ─── */}
      {tab === 'gjort' && (
        <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-10">
          {/* Progress */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Har dere gjort aktiviteten?</h3>
              <span className="text-sm font-bold text-gray-600">{doneCount}/{totalCount}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${donePercent}%` }} />
            </div>
            <p className="text-xs text-gray-400 text-center">
              Når alle har krysset av, slettes gruppen automatisk 🗑️
            </p>
          </div>

          {/* Deltakere */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            {members.map((u, i) => {
              const done = group.completedBy.includes(u.id)
              return (
                <div key={u.id} className={`flex items-center gap-3 p-2 rounded-xl ${done ? 'opacity-60' : ''}`}>
                  <Avatar initial={u.avatar} size="sm" index={i} />
                  <span className={`flex-1 text-sm font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{u.name}</span>
                  {done ? <span className="text-green-500 font-bold text-lg">✓</span> : <span className="text-gray-300 text-lg">○</span>}
                </div>
              )
            })}
          </div>

          {/* Kryss av-knapp */}
          {!myDone ? (
            <button
              onClick={() => markDone(groupId!)}
              className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-2xl text-base shadow-md shadow-green-200 active:scale-95 transition-transform"
            >
              ✅ Jeg har gjort det!
            </button>
          ) : (
            <div className="text-center py-3 text-green-600 font-semibold text-sm">
              ✓ Du har allerede krysset av
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-3 text-xs text-yellow-700 text-center">
            ⚠️ Når alle krysser av, slettes hele gruppechatten permanent
          </div>
        </div>
      )}
    </div>
  )
}
