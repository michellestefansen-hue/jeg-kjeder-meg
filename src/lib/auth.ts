// ─── Auth-funksjoner mot Supabase ─────────────────────────────────────────────
import { supabase } from './supabase'

export async function registerUser(
  email: string,
  password: string,
  name: string,
  username: string,
  age: number,
  area: string
) {
  // 1. Opprett bruker i Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Send ikke bekreftelses-e-post i prototype-modus
      emailRedirectTo: undefined,
    },
  })
  if (error) throw error

  const userId = data.user?.id
  if (!userId) throw new Error('Ingen bruker-ID etter registrering')

  // 2. Lagre profil — bruk upsert for å unngå race condition
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    name,
    username: username.toLowerCase(),
    age,
    area,
    friends: [],
    friend_requests: [],
    sent_requests: [],
    banner_color: '#ec4899',
    bg_color: '#ffffff',
  })
  if (profileError) throw profileError

  return data.user
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function logoutUser() {
  await supabase.auth.signOut()
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  })
  if (error) throw error
}

// Hent profil med retry (i tilfelle race condition etter registrering)
export async function getProfile(userId: string, retries = 3): Promise<Record<string, unknown>> {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) return data
    if (error && i < retries - 1) {
      // Vent litt og prøv igjen
      await new Promise((r) => setTimeout(r, 500))
    } else if (error) {
      throw error
    }
  }
  throw new Error('Kunne ikke hente profil')
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}
