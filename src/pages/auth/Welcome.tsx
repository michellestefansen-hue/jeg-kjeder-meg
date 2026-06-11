// ─── Velkomstside ─────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh flex flex-col items-center justify-between bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8">
      {/* Logo + tagline */}
      <div />
      <div className="text-center space-y-6">
        <div className="text-8xl mb-2">📍</div>
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
            Lokka
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Planlegg gøye ting med vennene dine 💕</p>
        </div>

        {/* Feature-prikker */}
        <div className="space-y-3 text-left max-w-xs mx-auto mt-8">
          {[
            ['🗺️', 'Finn aktiviteter i nærheten'],
            ['👯', 'Planlegg med vennene dine'],
            ['🗳️', 'Stem på hva dere vil gjøre'],
          ].map(([emoji, text]) => (
            <div key={text} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
              <span className="text-2xl">{emoji}</span>
              <span className="text-gray-700 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Knapper */}
      <div className="w-full max-w-sm space-y-3">
        <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/register')}>
          Kom i gang 🚀
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate('/login')}>
          Jeg har allerede en konto
        </Button>
      </div>
    </div>
  )
}
