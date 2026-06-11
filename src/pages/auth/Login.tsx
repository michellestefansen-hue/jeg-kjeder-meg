import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.replace('/home')
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Logg inn</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <label style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>E-post</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@epost.no"
        style={{ padding: '14px', borderRadius: '16px', border: '2px solid #f3f4f6', fontSize: '16px', marginBottom: '16px', background: '#f9fafb' }}
      />

      <label style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>Passord</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passordet ditt"
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        style={{ padding: '14px', borderRadius: '16px', border: '2px solid #f3f4f6', fontSize: '16px', marginBottom: '24px', background: '#f9fafb' }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: '16px', borderRadius: '16px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', color: 'white', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Logger inn...' : 'Logg inn'}
      </button>

      <a href="/register" style={{ textAlign: 'center', marginTop: '16px', color: '#ec4899', fontSize: '14px' }}>
        Har ikke konto? Registrer deg
      </a>
    </div>
  )
}
