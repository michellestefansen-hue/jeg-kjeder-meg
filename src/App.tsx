// ─── App-ruting ───────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'

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

// Vurdering
import Rating from './pages/rating/Rating'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn)
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  const bgColor = useAppStore((s) => s.bgColor)
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
