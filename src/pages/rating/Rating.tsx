// ─── Vurdering etter aktivitet ────────────────────────────────────────────────
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import Button from '../../components/ui/Button'

const EMOJI_RATINGS = ['😫', '😕', '😐', '😊', '🤩']

export default function Rating() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activities, rateActivity } = useAppStore()
  const activity = activities.find((a) => a.id === id)

  const [score, setScore] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!activity) return null

  const handleSubmit = () => {
    if (score === null) return
    rateActivity(id!, score)
    setSubmitted(true)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      {!submitted ? (
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg space-y-6 text-center">
          <span className="text-5xl">{activity.emoji}</span>
          <div>
            <h2 className="text-xl font-black text-gray-900">Hvordan var {activity.title}?</h2>
            <p className="text-gray-400 text-sm mt-1">Din tilbakemelding hjelper oss å foreslå bedre aktiviteter</p>
          </div>

          <div className="flex justify-between">
            {EMOJI_RATINGS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setScore(i + 1)}
                className={`text-4xl transition-transform ${score === i + 1 ? 'scale-125' : 'opacity-50 scale-90'}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {score && (
            <p className="text-sm text-gray-500">
              {['Ikke bra 😬', 'Ganske ok', 'Ok', 'Bra! 👍', 'Kjempegøy!! 🎉'][score - 1]}
            </p>
          )}

          <Button variant="primary" fullWidth size="lg" disabled={score === null} onClick={handleSubmit}>
            Send vurdering
          </Button>
          <button onClick={() => navigate('/home')} className="text-sm text-gray-400">
            Hopp over
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg space-y-4 text-center">
          <span className="text-6xl">🙏</span>
          <h2 className="text-xl font-black text-gray-900">Takk!</h2>
          <p className="text-gray-500 text-sm">Vi bruker tilbakemeldingen din til å finne bedre aktiviteter for deg</p>
          <Button variant="primary" fullWidth onClick={() => navigate('/home')}>
            Tilbake til forsiden
          </Button>
        </div>
      )}
    </div>
  )
}
