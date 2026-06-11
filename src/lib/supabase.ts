import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rdiyqejysmlwcbwfxwtx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaXlxZWp5c21sd2Nid2Z4d3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzczMzIsImV4cCI6MjA5Njc1MzMzMn0._YGhBnIdh3M7ihLd-yLJPVnbMWeSzf2Npk2SswmdGaE'

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
