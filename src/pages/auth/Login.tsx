import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAppStore } from '../../store/useAppStore'
import { getProfile } from '../../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Naviger til hjem ETTER at React har rendret isLoggedIn=true
  useEffect(() => {
    if (isLoggedIn) navigate('/home', { replace: true })
  }, [isLoggedIn])

  const handleLogin = async () => {
    const e = email.trim()
    const p = password

    if (!e || !p) {
      setMsg('Fyll inn e-post og passord')
      return
    }

    setMsg('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: e,
        password: p,
      })

      if (error) {
        setMsg(`Feil: ${error.message}`)
        setLoading(false)
        return
      }

      if (!data.user) {
        setMsg('Ingen bruker funnet. Prøv igjen.')
        setLoading(false)
        return
      }

      // Hent profil (ignorerer feil — bruker fallback)
      let profile = null
      try { profile = await getProfile(data.user.id) } catch { /* ingen profil */ }

      login({
        id: data.user.id,
        name: profile?.name ?? e.split('@')[0],
        username: profile?.username ?? e.split('@')[0],
        age: profile?.age ?? 14,
        area: profile?.area ?? 'Norge',
        avatar: (profile?.name?.[0] ?? e[0]).toUpperCase(),
        friends: profile?.friends ?? [],
        photoUrl: profile?.photo_url,
        vippsNumber: profile?.vipps_number,
      })
      // useEffect over navigerer når isLoggedIn blir true

    } catch (err: unknown) {
      setMsg(`Uventet feil: ${err instanceof Error ? err.message : String(err)}`)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '24px', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px' }}>📍</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 4px' }}>Velkommen tilbake!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Logg inn for å se hva som skjer</p>
      </div>

      {msg && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
          {msg}
        </div>
      )}

      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>E-post</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@epost.no"
        autoComplete="email"
        style={{ padding: '14px', borderRadius: '16px', border: '2px solid #e5e7eb', fontSize: '16px', marginBottom: '16px', background: '#f9fafb', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />

      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Passord</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passordet ditt"
        autoComplete="current-password"
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        style={{ padding: '14px', borderRadius: '16px', border: '2px solid #e5e7eb', fontSize: '16px', marginBottom: '24px', background: '#f9fafb', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: '16px', borderRadius: '16px', background: loading ? '#9ca3af' : 'linear-gradient(to right, #ec4899, #8b5cf6)', color: 'white', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
      >
        {loading ? 'Logger inn...' : 'Logg inn'}
      </button>

      <a href="/register" style={{ textAlign: 'center', marginTop: '16px', color: '#ec4899', fontSize: '14px', display: 'block' }}>
        Har ikke konto? Registrer deg
      </a>
    </div>
  )
}
