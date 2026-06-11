// ─── Opprett gruppechat ───────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'

const EMOJIS = ['👯', '🎉', '🌟', '🔥', '💕', '🎮', '🍕', '🎬', '🧺', '⚽', '🎵', '✈️']

export default function CreateGroup() {
  const navigate = useNavigate()
  const { currentUser, createGroup, blockedUsers } = useAppStore()
  if (!currentUser) return null

  const friends = USERS.filter(
    (u) => currentUser.friends.includes(u.id) && !blockedUsers.includes(u.id)
  )

  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const [emoji, setEmoji] = useState('👯')

  const toggle = (uid: string) => {
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    )
  }

  const handleCreate = () => {
    if (!groupName.trim() || selected.length === 0) return
    const id = createGroup(groupName.trim(), emoji, selected)
    navigate(`/group/${id}`, { replace: true })
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="Ny gruppe" />

      {/* Fremdrift */}
      <div className="flex gap-1.5 px-4 pt-3">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-pink-400' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {/* Steg 1: velg venner */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hvem vil du ha med? 👥</h2>
              <p className="text-gray-400 text-sm mt-1">Velg minst én venn</p>
            </div>

            <div className="space-y-2">
              {friends.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">Legg til venner først for å opprette en gruppe</p>
              )}
              {friends.map((friend, i) => {
                const isSelected = selected.includes(friend.id)
                return (
                  <button
                    key={friend.id}
                    onClick={() => toggle(friend.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                      isSelected ? 'border-pink-400 bg-pink-50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <Avatar initial={friend.avatar} size="sm" index={i} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-800">{friend.name}</p>
                      <p className="text-xs text-gray-400">@{friend.username}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-pink-400 border-pink-400' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check size={13} className="text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={selected.length === 0}
              onClick={() => setStep(2)}
            >
              Neste ({selected.length} valgt)
            </Button>
          </>
        )}

        {/* Steg 2: navn og emoji */}
        {step === 2 && (
          <>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gi gruppen et navn 🏷️</h2>
              <p className="text-gray-400 text-sm mt-1">{selected.length + 1} deltakere</p>
            </div>

            {/* Valgte venner preview */}
            <div className="flex gap-2 flex-wrap">
              {selected.map((uid, i) => {
                const u = USERS.find((x) => x.id === uid)
                return u ? (
                  <div key={uid} className="flex items-center gap-1.5 bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
                    <Avatar initial={u.avatar} size="xs" index={i} />
                    <span className="text-xs font-medium text-pink-700">{u.name}</span>
                  </div>
                ) : null
              })}
            </div>

            {/* Emoji */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Gruppe-emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-2xl transition-colors ${emoji === e ? 'bg-pink-100 scale-110' : 'bg-gray-50'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Gruppenavn */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Gruppenavn</label>
              <div className="flex items-center gap-3 border-2 border-gray-100 rounded-2xl px-4 py-3 bg-gray-50 focus-within:border-pink-400">
                <span className="text-2xl">{emoji}</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="F.eks. Gjengen 🔥"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={30}
                  className="flex-1 bg-transparent text-base focus:outline-none text-gray-800"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setStep(1)}>Tilbake</Button>
              <Button variant="primary" fullWidth disabled={!groupName.trim()} onClick={handleCreate}>
                Opprett gruppe
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
