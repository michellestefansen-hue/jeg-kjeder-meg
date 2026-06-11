import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
