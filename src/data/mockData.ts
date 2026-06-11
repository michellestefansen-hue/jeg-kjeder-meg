// ─── Mock data for Lokka prototype ───────────────────────────────────────────

export interface User {
  id: string
  name: string
  username: string
  age: number
  area: string
  avatar: string
  friends: string[]
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

export const ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: 'Kino på CC Vest',
    emoji: '🎬',
    type: 'closed',
    location: 'CC Vest, Oslo',
    address: 'Lilleakerveien 16, 0283 Oslo',
    date: '2026-06-14',
    time: '15:00',
    pricePerPerson: 130,
    travelCost: 40,
    maxParticipants: 5,
    participants: ['u1', 'u2', 'u3'],
    organizerId: 'u1',
    status: 'voting',
    allowSuggestions: true,
    ageRange: [13, 15],
    distance: 3.2,
    invitedFriends: ['u2', 'u3', 'u4'],
    suggestions: [
      { id: 's1', title: 'Mission Impossible', emoji: '🎬', votes: ['u1', 'u2', 'u3', 'u4', 'u5'], addedBy: 'u1' },
      { id: 's2', title: 'Inside Out 2', emoji: '😭', votes: ['u2', 'u3'], addedBy: 'u2' },
      { id: 's3', title: 'Minecraft filmen', emoji: '⛏️', votes: ['u4'], addedBy: 'u3' },
    ],
  },
  {
    id: 'a2',
    title: 'Bowling i Vika',
    emoji: '🎳',
    type: 'open',
    location: 'Oslo Mekaniske Verksteder',
    address: 'Vulkan 5, 0178 Oslo',
    date: '2026-06-15',
    time: '17:00',
    pricePerPerson: 160,
    travelCost: 30,
    maxParticipants: 8,
    participants: ['u2', 'u4'],
    organizerId: 'u2',
    status: 'planning',
    allowSuggestions: false,
    ageRange: [13, 15],
    distance: 1.5,
    suggestions: [],
  },
  {
    id: 'a3',
    title: 'Piknik i Frognerparken',
    emoji: '🧺',
    type: 'open',
    location: 'Frognerparken',
    address: 'Frognerparken, 0263 Oslo',
    date: '2026-06-20',
    time: '13:00',
    pricePerPerson: 80,
    travelCost: 20,
    maxParticipants: 10,
    participants: ['u1', 'u3', 'u5'],
    organizerId: 'u3',
    status: 'confirmed',
    allowSuggestions: true,
    ageRange: [13, 15],
    distance: 2.1,
    suggestions: [
      { id: 's4', title: 'Tur i parken', emoji: '🌳', votes: ['u1', 'u3', 'u5'], addedBy: 'u3' },
      { id: 's5', title: 'Kafé etterpå', emoji: '☕', votes: ['u1', 'u5'], addedBy: 'u1' },
    ],
  },
]

// ─── Invitasjoner (innboks) ───────────────────────────────────────────────────

export const INVITATIONS = [
  { id: 'inv1', activityId: 'a1', fromUserId: 'u2', toUserId: 'u1', message: 'Kom på kino med oss! 🎬' },
]

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
