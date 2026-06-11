// ─── Innloggingsside med Supabase ─────────────────────────────────────────────
import { useState } from 'react'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'
import { loginUser, sendPasswordReset } from '../../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      await loginUser(email, password)
      // App.tsx lytter på auth-endringer og navigerer automatisk
    } catch (e: unknown) {
      setError('Feil e-post eller passord. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Skriv inn e-posten din først'); return }
    try {
      await sendPasswordReset(email)
      setResetSent(true)
    } catch {
      setError('Kunne ikke sende tilbakestillingslenke')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="Logg inn" />
      <div className="flex-1 p-6 flex flex-col gap-6 justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">📍</div>
          <h2 className="text-2xl font-bold text-gray-900">Velkommen tilbake!</h2>
          <p className="text-gray-500 mt-1">Logg inn for å se hva som skjer</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-600 text-center">
            ✓ Sjekk e-posten din for tilbakestillingslenke
          </div>
        )}

        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
        />
        <input
          type="password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
        />
        <Button
          variant="primary"
          fullWidth
          size="lg"
          disabled={loading || !email || !password}
          onClick={handleLogin}
        >
          {loading ? 'Logger inn...' : 'Logg inn'}
        </Button>
        <button
          onClick={handleForgotPassword}
          className="text-center text-pink-500 text-sm font-medium"
        >
          Glemt passord?
        </button>
      </div>
    </div>
  )
}
