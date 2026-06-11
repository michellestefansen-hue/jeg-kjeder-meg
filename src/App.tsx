// ─── App-ruting ───────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import { supabase } from './lib/supabase'
import { getProfile } from './lib/auth'

// Auth
import Welcome from './pages/auth/Welcome'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'

// Hjem
import Home from './pages/home/Home'
import Explore from './pages/home/Explore'
import MyActivities from './pages/home/MyActivities'

// Aktiviteter
import ActivityDetail from './pages/activity/ActivityDetail'
import CreateActivity from './pages/activity/CreateActivity'

// Avstemming & hjul
import Voting from './pages/voting/Voting'
import SpinWheel from './pages/voting/SpinWheel'

// Betaling
import Payment from './pages/payment/Payment'

// Reiserute
import TravelRoute from './pages/travel/TravelRoute'

// Chat
import Chat from './pages/chat/Chat'

// Profil
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import UserProfile from './pages/profile/UserProfile'
import Privacy from './pages/profile/Privacy'
import Help from './pages/profile/Help'
import AddFriends from './pages/profile/AddFriends'
import FriendRequests from './pages/profile/FriendRequests'
import Messages from './pages/chat/Messages'
import DirectChat from './pages/chat/DirectChat'
import CreateGroup from './pages/chat/CreateGroup'
import GroupChat from './pages/chat/GroupChat'

// Vurdering
import Rating from './pages/rating/Rating'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn)
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  const bgColor = useAppStore((s) => s.bgColor)
  const { login, logout } = useAppStore()
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    // Sjekk eksisterende session ved oppstart
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (session?.user) {
          try {
            const profile = await getProfile(session.user.id)
            login({
              id: session.user.id,
              name: profile.name,
              username: profile.username,
              age: profile.age,
              area: profile.area,
              avatar: profile.name[0].toUpperCase(),
              friends: profile.friends ?? [],
              photoUrl: profile.photo_url,
              vippsNumber: profile.vipps_number,
            })
          } catch { logout() }
        }
        setAuthReady(true)
      })
      .catch((err) => {
        console.error('Auth-feil:', err)
        setAuthReady(true) // Vis appen uansett
      })

    // Lytt på auth-endringer (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await getProfile(session.user.id)
          login({
            id: session.user.id,
            name: profile.name,
            username: profile.username,
            age: profile.age,
            area: profile.area,
            avatar: profile.name[0].toUpperCase(),
            friends: profile.friends ?? [],
            photoUrl: profile.photo_url,
            vippsNumber: profile.vipps_number,
          })
        } catch { /* profil ikke klar ennå */ }
      }
      if (event === 'SIGNED_OUT') logout()
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!authReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center space-y-3">
          <div className="text-5xl">📍</div>
          <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    // Mobil-wrapper: maks 430px, sentrert
    <div className="min-h-dvh bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-dvh relative overflow-hidden shadow-2xl" style={{ backgroundColor: bgColor }}>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/my-activities" element={<ProtectedRoute><MyActivities /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/add-friends" element={<ProtectedRoute><AddFriends /></ProtectedRoute>} />
            <Route path="/friend-requests" element={<ProtectedRoute><FriendRequests /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/direct/:userId" element={<ProtectedRoute><DirectChat /></ProtectedRoute>} />
            <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
            <Route path="/group/:groupId" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
            <Route path="/create-activity" element={<ProtectedRoute><CreateActivity /></ProtectedRoute>} />
            <Route path="/activity/:id" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
            <Route path="/voting/:id" element={<ProtectedRoute><Voting /></ProtectedRoute>} />
            <Route path="/spin/:id" element={<ProtectedRoute><SpinWheel /></ProtectedRoute>} />
            <Route path="/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/travel/:id" element={<ProtectedRoute><TravelRoute /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/rating/:id" element={<ProtectedRoute><Rating /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}
