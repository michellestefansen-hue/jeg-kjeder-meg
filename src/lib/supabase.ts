import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rdiyqejysmlwcbwfxwtx.supabase.co'
const supabaseAnonKey = 'sb_publishable_1jWXp_Gcor-__X_GWF-fhA_1Z_OzHVY'

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
