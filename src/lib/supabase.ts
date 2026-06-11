import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Mangler Supabase env-variabler:', { supabaseUrl, supabaseAnonKey })
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export type Profile = {
  id: string
  name: string
  username: string
  age: number
  area: string
  vipps_number?: string
  photo_url?: string
  friends: string[]
  friend_requests: string[]
  sent_requests: string[]
  banner_color: string
  bg_color: string
  created_at: string
}
