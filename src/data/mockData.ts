// ─── Mock data for Lokka prototype ───────────────────────────────────────────

export interface User {
  id: string
  name: string
  username: string
  age: number
  area: string
  avatar: string
  friends: string[]
  photoUrl?: string
  vippsNumber?: string
}

export interface Activity {
  id: string
  title: string
  emoji: string
  type: 'open' | 'closed'
  location: string
  address: string
  date: string
  time: string
  pricePerPerson: number
  travelCost: number
  maxParticipants: number
  participants: string[]
  organizerId: string
  status: 'planning' | 'voting' | 'confirmed' | 'completed'
  allowSuggestions: boolean
  suggestions: Suggestion[]
  ageRange: [number, number]
  invitedFriends?: string[]
  distance?: number // km
}

export interface Suggestion {
  id: string
  title: string
  emoji: string
  votes: string[] // user IDs
  addedBy: string
}

export interface ChatMessage {
  id: string
  userId: string
  text: string
  time: string
}

export interface PaymentStatus {
  userId: string
  paid: boolean
  amount: number
  paidAt?: string
}

// ─── Brukere ─────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Sofia',
    username: 'sofia14',
    age: 14,
    area: 'Grünerløkka, Oslo',
    avatar: 'S',
    friends: ['u2', 'u3', 'u4', 'u5'],
  },
  {
    id: 'u2',
    name: 'Emma',
    username: 'emma_oslo',
    age: 14,
    area: 'Majorstuen, Oslo',
    avatar: 'E',
    friends: ['u1', 'u3', 'u5'],
  },
  {
    id: 'u3',
    name: 'Maja',
    username: 'maja.frogner',
    age: 14,
    area: 'Frogner, Oslo',
    avatar: 'M',
    friends: ['u1', 'u2', 'u4'],
  },
  {
    id: 'u4',
    name: 'Ida',
    username: 'idaaa14',
    age: 14,
    area: 'St. Hanshaugen, Oslo',
    avatar: 'I',
    friends: ['u1', 'u3'],
  },
  {
    id: 'u5',
    name: 'Thea',
    username: 'thea.bislett',
    age: 14,
    area: 'Bislett, Oslo',
    avatar: 'T',
    friends: ['u1', 'u2'],
  },
]

// ─── Aktiviteter ─────────────────────────────────────────────────────────────

export const ACTIVITIES: Activity[] = []

// ─── Invitasjoner (innboks) ───────────────────────────────────────────────────

export const INVITATIONS: { id: string; activityId: string; fromUserId: string; toUserId: string; message: string }[] = []

// ─── Chat-meldinger ───────────────────────────────────────────────────────────

export const CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  a1: [
    { id: 'm1', userId: 'u2', text: 'Gleder meg så mye!! 🎉', time: '10:32' },
    { id: 'm2', userId: 'u3', text: 'Skal vi møtes ved inngangen kl 14:45?', time: '10:35' },
    { id: 'm3', userId: 'u1', text: 'Ja, det høres bra ut! 👍', time: '10:38' },
    { id: 'm4', userId: 'u2', text: 'Kiosk først eller etter??', time: '10:40' },
    { id: 'm5', userId: 'u3', text: 'ALLTID kiosk først 🍿', time: '10:41' },
  ],
  a3: [
    { id: 'm6', userId: 'u3', text: 'Husk å ta med teppe!', time: '09:10' },
    { id: 'm7', userId: 'u5', text: 'Jeg tar med vafler 🧇', time: '09:15' },
  ],
}

// ─── Betalingsstatus ──────────────────────────────────────────────────────────

export const PAYMENT_STATUS: Record<string, PaymentStatus[]> = {
  a1: [
    { userId: 'u1', paid: true, amount: 170, paidAt: '10:05' },
    { userId: 'u2', paid: true, amount: 170, paidAt: '10:10' },
    { userId: 'u3', paid: false, amount: 170 },
  ],
  a3: [
    { userId: 'u1', paid: true, amount: 100, paidAt: '09:00' },
    { userId: 'u3', paid: true, amount: 100, paidAt: '09:02' },
    { userId: 'u5', paid: false, amount: 100 },
  ],
}

// ─── Reiseruter ───────────────────────────────────────────────────────────────

export const TRAVEL_ROUTES = {
  a1: {
    from: 'Grünerløkka, Oslo',
    to: 'CC Vest, Oslo',
    options: [
      {
        type: 'Kollektivt',
        icon: '🚌',
        duration: '28 min',
        departure: '14:30',
        arrival: '14:58',
        price: 40,
        steps: ['Gå til Olaf Ryes plass (3 min)', 'Buss 37 retning Helsfyr (6 stopp)', 'Bytt til T-bane linje 2 (4 stopp)', 'Gå til CC Vest (4 min)'],
      },
      {
        type: 'Sykkel',
        icon: '🚲',
        duration: '18 min',
        departure: '14:40',
        arrival: '14:58',
        price: 0,
        steps: ['Sykkel via Aker Brygge', 'Følg sykkelvei langs Drammensveien'],
      },
    ],
  },
}
