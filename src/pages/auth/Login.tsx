import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAppStore } from '../../store/useAppStore'
import { getProfile } from '../../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setMsg('Fyll inn e-post og passord'); return }
    setMsg(''); setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setMsg(error.message); setLoading(false); return }

      const user = data.user
      if (!user) { setMsg('Ingen bruker funnet'); setLoading(false); return }

      // Hent profil
      let profile = null
      try { profile = await getProfile(user.id) } catch { /* profil mangler */ }

      // Sett bruker i store
      login({
        id: user.id,
        name: profile?.name ?? email.split('@')[0],
        username: profile?.username ?? email.split('@')[0],
        age: profile?.age ?? 14,
        area: profile?.area ?? 'Norge',
        avatar: (profile?.name?.[0] ?? email[0]).toUpperCase(),
        friends: profile?.friends ?? [],
        photoUrl: profile?.photo_url,
        vippsNumber: profile?.vipps_number,
      })

      // Naviger uten page reload
      navigate('/home', { replace: true })
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Noe gikk galt')
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
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
          {msg}
        </div>
      )}

      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>E-post</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@epost.no"
        autoComplete="email"
        style={{ padding: '14px', borderRadius: '16px', border: '2px solid #f3f4f6', fontSize: '16px', marginBottom: '16px', background: '#f9fafb', outline: 'none' }}
      />

      <label style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>Passord</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passordet ditt"
        autoComplete="current-password"
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        style={{ padding: '14px', borderRadius: '16px', border: '2px solid #f3f4f6', fontSize: '16px', marginBottom: '24px', background: '#f9fafb', outline: 'none' }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: '16px', borderRadius: '16px', background: loading ? '#d1d5db' : 'linear-gradient(to right, #ec4899, #8b5cf6)', color: 'white', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Logger inn...' : 'Logg inn'}
      </button>

      <a href="/register" style={{ textAlign: 'center', marginTop: '16px', color: '#ec4899', fontSize: '14px' }}>
        Har ikke konto? Registrer deg
      </a>
    </div>
  )
}
