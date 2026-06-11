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
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const userId = data.user?.id
  if (!userId) throw new Error('Ingen bruker-ID etter registrering')

  // 2. Lagre profil i profiles-tabellen
  const { error: profileError } = await supabase.from('profiles').insert({
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
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}
