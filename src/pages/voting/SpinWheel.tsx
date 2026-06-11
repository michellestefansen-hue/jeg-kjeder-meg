// ─── Spin the Wheel ───────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'

const COLORS = ['#F472B6', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#C084FC', '#38BDF8']

export default function SpinWheel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activities } = useAppStore()
  const activity = activities.find((a) => a.id === id)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const animRef = useRef<number>(0)

  if (!activity) return null

  // Bygg hjulsegmenter basert på stemmer (vektet)
  const segments = activity.suggestions.flatMap((s) => {
    const count = Math.max(s.votes.length, 1)
    return Array(count).fill({ title: s.title, emoji: s.emoji })
  })

  const totalSegments = segments.length
  const segmentAngle = (2 * Math.PI) / totalSegments

  // Tegn hjulet
  const drawWheel = (rot: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = cx - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    segments.forEach((seg, i) => {
      const startAngle = rot + i * segmentAngle - Math.PI / 2
      const endAngle = startAngle + segmentAngle

      // Segment
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Tekst / emoji
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(startAngle + segmentAngle / 2)
      ctx.textAlign = 'right'
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#fff'
      ctx.fillText(seg.emoji + ' ' + (seg.title.length > 8 ? seg.title.slice(0, 7) + '…' : seg.title), radius - 12, 5)
      ctx.restore()
    })

    // Midtpunkt
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#e9d5ff'
    ctx.lineWidth = 3
    ctx.stroke()
  }

  useEffect(() => {
    drawWheel(rotation)
  }, [rotation, segments.length])

  const spin = () => {
    if (spinning || winner) return
    setSpinning(true)

    const extraSpins = 5 + Math.random() * 5 // 5-10 rotasjoner
    const randomAngle = Math.random() * 2 * Math.PI
    const totalAngle = extraSpins * 2 * Math.PI + randomAngle
    const duration = 4000
    const startTime = performance.now()
    const startRot = rotation

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentRot = startRot + totalAngle * eased
      setRotation(currentRot)
      drawWheel(currentRot)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        // Finn vinner: pil peker opp (3 o'clock = 0, top = -PI/2)
        const normalised = ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const pointerAngle = (2 * Math.PI - normalised + Math.PI * 1.5) % (2 * Math.PI)
        const winnerIndex = Math.floor(pointerAngle / segmentAngle) % totalSegments
        setWinner(segments[winnerIndex].emoji + ' ' + segments[winnerIndex].title)
        setSpinning(false)
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      <Header title="Spin the Wheel 🎡" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <p className="text-gray-500 text-sm text-center">
          Aktiviteter med flere stemmer har større sjanse! 🍀
        </p>

        {/* Hjul + pil */}
        <div className="relative">
          {/* Pil */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-3xl drop-shadow-md">▼</div>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-full shadow-2xl shadow-pink-200"
          />
        </div>

        {/* Stemme-oversikt */}
        <div className="flex flex-wrap gap-2 justify-center">
          {activity.suggestions.map((s) => (
            <span key={s.id} className="bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
              {s.emoji} {s.title}: {s.votes.length} 🗳️
            </span>
          ))}
        </div>

        {/* Resultat */}
        {winner && (
          <div className="bg-white rounded-3xl px-8 py-6 shadow-lg text-center animate-bounce">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-xl font-black text-gray-900">{winner}</p>
            <p className="text-gray-500 text-sm mt-1">Hjulet har bestemt!</p>
          </div>
        )}

        <div className="w-full max-w-sm space-y-3">
          {!winner ? (
            <Button variant="primary" fullWidth size="lg" onClick={spin} disabled={spinning}>
              {spinning ? '🎡 Snurrer...' : '🎡 Snurr hjulet!'}
            </Button>
          ) : (
            <>
              <Button variant="primary" fullWidth size="lg" onClick={() => navigate(-1)}>
                Tilbake til aktiviteten ✓
              </Button>
              <Button variant="secondary" fullWidth onClick={() => { setWinner(null) }}>
                Snurr igjen
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
