// ─── Innloggingsside ──────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'

export default function Login() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Mock-innlogging: logg inn som Sofia
    login(USERS[0])
    navigate('/home')
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
          className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-base focus:outline-none focus:border-pink-400 bg-gray-50"
        />
        <Button variant="primary" fullWidth size="lg" onClick={handleLogin}>
          Logg inn
        </Button>
        <button className="text-center text-pink-500 text-sm font-medium">Glemt passord?</button>
      </div>
    </div>
  )
}
