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
  updateProfile: (updates: Partial<{ name: string; area: string; vippsNumber: string }>) => void
  updateProfilePhoto: (photoUrl: string) => void

  // Venneforespørsler
  friendRequests: string[]   // bruker-IDer som har sendt forespørsel til meg
  sentRequests: string[]     // bruker-IDer jeg har sendt forespørsel til
  sendFriendRequest: (userId: string) => void
  acceptFriendRequest: (userId: string) => void
  declineFriendRequest: (userId: string) => void

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

  // Vennekasse
  vennekasse: Record<string, number>   // activityId → saldo i kr
  addToVennekasse: (activityId: string, amount: number) => void

  // Blokkering
  blockedUsers: string[]
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void

  // Direktemeldinger
  directChats: Record<string, { messages: { id: string; from: string; text: string; time: string }[]; unread: number }>
  sendDirect: (toUserId: string, text: string) => void
  markRead: (userId: string) => void

  // Gruppechat
  groupChats: Record<string, {
    name: string; emoji: string; members: string[]
    messages: { id: string; from: string; text: string; time: string }[]
    unread: number
    kasse: number
    // Lykkehjul
    wheel: {
      items: { id: string; text: string; emoji: string; votes: string[]; addedBy: string }[]
      phase: 'adding' | 'voting' | 'runoff' | 'spinning' | 'done'
      runoffIds: string[]
      winner: string | null
      spunOnce: boolean
    }
    // Fullført
    completedBy: string[]
  }>
  createGroup: (name: string, emoji: string, memberIds: string[]) => string
  sendGroupMessage: (groupId: string, text: string) => void
  markGroupRead: (groupId: string) => void
  addToGroupKasse: (groupId: string, amount: number) => void
  // Lykkehjul
  addWheelItem: (groupId: string, text: string, emoji: string) => void
  removeWheelItem: (groupId: string, itemId: string) => void
  voteWheelItem: (groupId: string, itemId: string) => void
  startVoting: (groupId: string) => void
  finishVoting: (groupId: string) => void
  setWheelWinner: (groupId: string, winnerId: string) => void
  resetWheel: (groupId: string) => void
  // Fullført
  markDone: (groupId: string) => void

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

  updateProfilePhoto: (photoUrl) => {
    const { currentUser } = get()
    if (!currentUser) return
    set({ currentUser: { ...currentUser, photoUrl } })
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
    if (currentUser.friends.length >= 150) return
    set({ currentUser: { ...currentUser, friends: [...currentUser.friends, userId] } })
  },

  // ─── Venneforespørsler ────────────────────────────────────────────────────
  friendRequests: ['u4', 'u5'], // mock: Ida og Thea har sendt forespørsel
  sentRequests: [],

  sendFriendRequest: (userId) => {
    const { currentUser, sentRequests, friendRequests } = get()
    if (!currentUser) return
    if (currentUser.friends.includes(userId)) return
    if (sentRequests.includes(userId)) return
    // Hvis de allerede har sendt forespørsel til meg — godta automatisk
    if (friendRequests.includes(userId)) {
      get().acceptFriendRequest(userId)
      return
    }
    set({ sentRequests: [...sentRequests, userId] })
  },

  acceptFriendRequest: (userId) => {
    const { currentUser, friendRequests } = get()
    if (!currentUser) return
    set({
      currentUser: { ...currentUser, friends: [...currentUser.friends, userId] },
      friendRequests: friendRequests.filter((id) => id !== userId),
    })
  },

  declineFriendRequest: (userId) => {
    set((s) => ({ friendRequests: s.friendRequests.filter((id) => id !== userId) }))
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

  // ─── Vennekasse ───────────────────────────────────────────────────────────
  vennekasse: { a1: 85, a3: 50 }, // mock: litt penger fra avbestillinger
  addToVennekasse: (activityId, amount) =>
    set((s) => ({ vennekasse: { ...s.vennekasse, [activityId]: (s.vennekasse[activityId] ?? 0) + amount } })),

  // ─── Blokkering ───────────────────────────────────────────────────────────
  blockedUsers: [],
  blockUser: (userId) => set((s) => ({ blockedUsers: [...s.blockedUsers, userId] })),
  unblockUser: (userId) => set((s) => ({ blockedUsers: s.blockedUsers.filter((id) => id !== userId) })),

  // ─── Helpers ──────────────────────────────────────────────────────────────
  // ─── Gruppechat ───────────────────────────────────────────────────────────
  groupChats: {},
  createGroup: (name, emoji, memberIds) => {
    const { currentUser } = get()
    if (!currentUser) return ''
    const id = `g_${Date.now()}`
    const emptyWheel = { items: [], phase: 'adding' as const, runoffIds: [], winner: null, spunOnce: false }
    set((s) => ({
      groupChats: {
        ...s.groupChats,
        [id]: { name, emoji, members: [currentUser.id, ...memberIds], messages: [], unread: 0, kasse: 0, wheel: emptyWheel, completedBy: [] },
      },
    }))
    return id
  },
  sendGroupMessage: (groupId, text) => {
    const { currentUser, groupChats } = get()
    if (!currentUser) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const msg = { id: `gm_${Date.now()}`, from: currentUser.id, text, time }
    const g = groupChats[groupId]
    if (!g) return
    set((s) => ({ groupChats: { ...s.groupChats, [groupId]: { ...g, messages: [...g.messages, msg] } } }))
  },
  markGroupRead: (groupId) => {
    set((s) => { const g = s.groupChats[groupId]; if (!g) return s; return { groupChats: { ...s.groupChats, [groupId]: { ...g, unread: 0 } } } })
  },
  addToGroupKasse: (groupId, amount) => {
    set((s) => { const g = s.groupChats[groupId]; if (!g) return s; return { groupChats: { ...s.groupChats, [groupId]: { ...g, kasse: g.kasse + amount } } } })
  },

  // ─── Lykkehjul ────────────────────────────────────────────────────────────
  addWheelItem: (groupId, text, emoji) => {
    const { currentUser } = get()
    if (!currentUser) return
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      const item = { id: `wi_${Date.now()}`, text, emoji, votes: [], addedBy: currentUser.id }
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, items: [...g.wheel.items, item] } } } }
    })
  },
  removeWheelItem: (groupId, itemId) => {
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, items: g.wheel.items.filter((i) => i.id !== itemId) } } } }
    })
  },
  voteWheelItem: (groupId, itemId) => {
    const { currentUser } = get()
    if (!currentUser) return
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      const items = g.wheel.items.map((item) => {
        if (item.id !== itemId) return item
        const hasVoted = item.votes.includes(currentUser.id)
        return { ...item, votes: hasVoted ? item.votes.filter((v) => v !== currentUser.id) : [...item.votes, currentUser.id] }
      })
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, items } } } }
    })
  },
  startVoting: (groupId) => {
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, phase: 'voting' } } } }
    })
  },
  finishVoting: (groupId) => {
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      const isRunoff = g.wheel.phase === 'runoff'
      const candidates = isRunoff
        ? g.wheel.items.filter((i) => g.wheel.runoffIds.includes(i.id))
        : g.wheel.items
      const maxVotes = Math.max(...candidates.map((i) => i.votes.length))
      const tied = candidates.filter((i) => i.votes.length === maxVotes)
      if (tied.length === 1) {
        // Klar vinner
        return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, phase: 'done', winner: tied[0].id } } } }
      }
      if (!isRunoff) {
        // Første uavgjort → omgang
        return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, phase: 'runoff', runoffIds: tied.map((i) => i.id), items: g.wheel.items.map((i) => ({ ...i, votes: [] })) } } } }
      }
      // Andre uavgjort → Spin the Wheel
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, phase: 'spinning', runoffIds: tied.map((i) => i.id) } } } }
    })
  },
  setWheelWinner: (groupId, winnerId) => {
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: { ...g.wheel, phase: 'done', winner: winnerId, spunOnce: true } } } }
    })
  },
  resetWheel: (groupId) => {
    const emptyWheel = { items: [], phase: 'adding' as const, runoffIds: [], winner: null, spunOnce: false }
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, wheel: emptyWheel } } }
    })
  },

  // ─── Fullført ─────────────────────────────────────────────────────────────
  markDone: (groupId) => {
    const { currentUser } = get()
    if (!currentUser) return
    set((s) => {
      const g = s.groupChats[groupId]; if (!g) return s
      if (g.completedBy.includes(currentUser.id)) return s
      const completedBy = [...g.completedBy, currentUser.id]
      // Alle har fullført → slett gruppen
      if (completedBy.length >= g.members.length) {
        const { [groupId]: _, ...rest } = s.groupChats
        return { groupChats: rest }
      }
      return { groupChats: { ...s.groupChats, [groupId]: { ...g, completedBy } } }
    })
  },

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
