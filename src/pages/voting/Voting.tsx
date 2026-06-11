// ─── Forslag og avstemming ────────────────────────────────────────────────────
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'

const EMOJI_OPTIONS = ['🎬', '🎳', '☕', '🛍️', '🧺', '🥾', '🎮', '🍕', '🎡', '🏊']

export default function Voting() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, activities, vote, addSuggestion } = useAppStore()

  const activity = activities.find((a) => a.id === id)
  if (!activity || !currentUser) return null

  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newEmoji, setNewEmoji] = useState('🎉')

  const totalVotes = activity.suggestions.reduce((sum, s) => sum + s.votes.length, 0)

  const handleAdd = () => {
    if (!newTitle.trim()) return
    addSuggestion(id!, newTitle, newEmoji)
    setNewTitle('')
    setShowAddForm(false)
  }

  const sortedSuggestions = [...activity.suggestions].sort((a, b) => b.votes.length - a.votes.length)

  return (
    <div className="min-h-dvh bg-gray-50 pb-32">
      <Header title="Forslag & avstemming" />

      <div className="px-4 py-5 space-y-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Stem på det du vil gjøre 🗳️</p>
          <p className="text-xs text-gray-400 mt-1">{totalVotes} stemmer totalt</p>
        </div>

        {/* Forslag */}
        <div className="space-y-2">
          {sortedSuggestions.map((suggestion) => {
            const hasVoted = suggestion.votes.includes(currentUser.id)
            const percentage = totalVotes > 0 ? (suggestion.votes.length / totalVotes) * 100 : 0
            return (
              <button
                key={suggestion.id}
                onClick={() => vote(id!, suggestion.id)}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 transition-all text-left ${
                  hasVoted ? 'border-pink-400 bg-pink-50' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{suggestion.emoji}</span>
                    <span className="font-semibold text-gray-900">{suggestion.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-600">{suggestion.votes.length}</span>
                    <span className={`text-xl transition-transform ${hasVoted ? 'scale-125' : ''}`}>
                      {hasVoted ? '❤️' : '🤍'}
                    </span>
                  </div>
                </div>
                {/* Stemme-bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round(percentage)}% av stemmene</p>
              </button>
            )
          })}
        </div>

        {/* Legg til forslag */}
        {activity.allowSuggestions && (
          <div>
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400"
              >
                <Plus size={18} />
                <span className="text-sm">Legg til forslag</span>
              </button>
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-800">Nytt forslag</h3>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setNewEmoji(e)}
                      className={`text-2xl p-1.5 rounded-xl ${newEmoji === e ? 'bg-pink-100' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Hva vil du gjøre?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
                />
                <div className="flex gap-2">
                  <Button variant="secondary" fullWidth onClick={() => setShowAddForm(false)}>Avbryt</Button>
                  <Button variant="primary" fullWidth onClick={handleAdd} disabled={!newTitle.trim()}>Legg til</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spin the Wheel-knapp */}
      {activity.suggestions.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto">
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate(`/spin/${activity.id}`)}>
            🎡 Spin the Wheel!
          </Button>
        </div>
      )}
    </div>
  )
}
