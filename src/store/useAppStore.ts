// ─── Global app state med Zustand ────────────────────────────────────────────
import { create } from 'zustand'
import {
  ACTIVITIES, CHAT_MESSAGES, PAYMENT_STATUS,
} from '../data/mockData'
import type { Activity, User, ChatMessage, PaymentStatus } from '../data/mockData'

interface AppState {
  // Auth
  currentUser: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  register: (name: string, username: string, age: number, area: string) => void
  addFriend: (userId: string) => void
  updateProfile: (updates: Partial<{ name: string; area: string }>) => void

  // Aktiviteter
  activities: Activity[]
  joinActivity: (activityId: string) => void
  createActivity: (activity: Omit<Activity, 'id' | 'participants' | 'status'>) => void
  vote: (activityId: string, suggestionId: string) => void
  addSuggestion: (activityId: string, title: string, emoji: string) => void

  // Betaling
  payments: Record<string, PaymentStatus[]>
  payForActivity: (activityId: string) => void

  // Chat
  messages: Record<string, ChatMessage[]>
  sendMessage: (activityId: string, text: string) => void

  // Vurdering
  ratings: Record<string, number>
  rateActivity: (activityId: string, score: number) => void

  // Navigasjon
  activeActivityId: string | null
  setActiveActivity: (id: string | null) => void

  // Blokkering
  blockedUsers: string[]
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void

  // Direktemeldinger
  directChats: Record<string, { messages: { id: string; from: string; text: string; time: string }[]; unread: number }>
  sendDirect: (toUserId: string, text: string) => void
  markRead: (userId: string) => void

  // Tema
  bgColor: string
  setBgColor: (color: string) => void
  bannerColor: string
  setBannerColor: (color: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // ─── Auth ─────────────────────────────────────────────────────────────────
  currentUser: null,
  isLoggedIn: false,

  login: (user) => set({ currentUser: user, isLoggedIn: true }),
  logout: () => set({ currentUser: null, isLoggedIn: false }),

  updateProfile: (updates) => {
    const { currentUser } = get()
    if (!currentUser) return
    set({ currentUser: { ...currentUser, ...updates } })
  },

  register: (name, username, age, area) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      username: username || name.toLowerCase().replace(/\s/g, ''),
      age,
      area,
      avatar: name[0].toUpperCase(),
      friends: ['u2', 'u3', 'u4', 'u5'],
    }
    set({ currentUser: newUser, isLoggedIn: true })
  },

  addFriend: (userId) => {
    const { currentUser } = get()
    if (!currentUser || currentUser.friends.includes(userId)) return
    if (currentUser.friends.length >= 150) return // maks 150 venner
    set({ currentUser: { ...currentUser, friends: [...currentUser.friends, userId] } })
  },

  // ─── Aktiviteter ─────────────────────────────────────────────────────────
  activities: ACTIVITIES,

  joinActivity: (activityId) => {
    const { currentUser, activities } = get()
    if (!currentUser) return
    set({
      activities: activities.map((a) =>
        a.id === activityId && !a.participants.includes(currentUser.id)
          ? { ...a, participants: [...a.participants, currentUser.id] }
          : a
      ),
    })
  },

  createActivity: (activity) => {
    const { currentUser, activities } = get()
    if (!currentUser) return
    const newActivity: Activity = {
      ...activity,
      id: `a_${Date.now()}`,
      participants: [currentUser.id],
      status: 'planning',
    }
    set({ activities: [newActivity, ...activities] })
  },

  vote: (activityId, suggestionId) => {
    const { currentUser, activities } = get()
    if (!currentUser) return
    set({
      activities: activities.map((a) => {
        if (a.id !== activityId) return a
        return {
          ...a,
          suggestions: a.suggestions.map((s) =>
            s.id === suggestionId
              ? s.votes.includes(currentUser.id)
                ? { ...s, votes: s.votes.filter((v) => v !== currentUser.id) }
                : { ...s, votes: [...s.votes, currentUser.id] }
              : s
          ),
        }
      }),
    })
  },

  addSuggestion: (activityId, title, emoji) => {
    const { currentUser, activities } = get()
    if (!currentUser) return
    set({
      activities: activities.map((a) =>
        a.id === activityId
          ? {
              ...a,
              suggestions: [
                ...a.suggestions,
                { id: `s_${Date.now()}`, title, emoji, votes: [], addedBy: currentUser.id },
              ],
            }
          : a
      ),
    })
  },

  // ─── Betaling ─────────────────────────────────────────────────────────────
  payments: PAYMENT_STATUS,

  payForActivity: (activityId) => {
    const { currentUser, payments, activities } = get()
    if (!currentUser) return
    const activity = activities.find((a) => a.id === activityId)
    if (!activity) return
    const amount = activity.pricePerPerson + activity.travelCost
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const existing = payments[activityId] || []
    const updated = existing.some((p) => p.userId === currentUser.id)
      ? existing.map((p) =>
          p.userId === currentUser.id ? { ...p, paid: true, paidAt: timeStr } : p
        )
      : [...existing, { userId: currentUser.id, paid: true, amount, paidAt: timeStr }]
    set({ payments: { ...payments, [activityId]: updated } })
  },

  // ─── Chat ─────────────────────────────────────────────────────────────────
  messages: CHAT_MESSAGES,

  sendMessage: (activityId, text) => {
    const { currentUser, messages } = get()
    if (!currentUser) return
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      userId: currentUser.id,
      text,
      time: timeStr,
    }
    set({
      messages: {
        ...messages,
        [activityId]: [...(messages[activityId] || []), newMsg],
      },
    })
  },

  // ─── Vurdering ────────────────────────────────────────────────────────────
  ratings: {},
  rateActivity: (activityId, score) => {
    set((s) => ({ ratings: { ...s.ratings, [activityId]: score } }))
  },

  // ─── Navigasjon ───────────────────────────────────────────────────────────
  activeActivityId: null,
  setActiveActivity: (id) => set({ activeActivityId: id }),

  // ─── Blokkering ───────────────────────────────────────────────────────────
  blockedUsers: [],
  blockUser: (userId) => set((s) => ({ blockedUsers: [...s.blockedUsers, userId] })),
  unblockUser: (userId) => set((s) => ({ blockedUsers: s.blockedUsers.filter((id) => id !== userId) })),

  // ─── Direktemeldinger ─────────────────────────────────────────────────────
  directChats: {},
  sendDirect: (toUserId, text) => {
    const { currentUser, directChats } = get()
    if (!currentUser) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const msg = { id: `dm_${Date.now()}`, from: currentUser.id, text, time }
    const existing = directChats[toUserId] || { messages: [], unread: 0 }
    set({
      directChats: {
        ...directChats,
        [toUserId]: { messages: [...existing.messages, msg], unread: existing.unread },
      },
    })
  },
  markRead: (userId) => {
    const { directChats } = get()
    const existing = directChats[userId]
    if (!existing) return
    set({ directChats: { ...directChats, [userId]: { ...existing, unread: 0 } } })
  },

  // ─── Tema ─────────────────────────────────────────────────────────────────
  bgColor: '#ffffff',
  setBgColor: (color) => set({ bgColor: color }),

  bannerColor: '#ec4899',
  setBannerColor: (color) => set({ bannerColor: color }),
}))
