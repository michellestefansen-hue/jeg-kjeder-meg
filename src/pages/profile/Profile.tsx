// ─── Profilside ───────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { MapPin, LogOut, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import Avatar from '../../components/ui/Avatar'
import BottomNav from '../../components/layout/BottomNav'
import { USERS } from '../../data/mockData'


export default function Profile() {
  const navigate = useNavigate()
  const { currentUser, activities, logout, bgColor, setBgColor } = useAppStore()
  if (!currentUser) { navigate('/'); return null }

  const myActivities = activities.filter((a) => a.participants.includes(currentUser.id))
  const completedActivities = activities.filter((a) => a.status === 'completed' && a.participants.includes(currentUser.id))
  const friends = USERS.filter((u) => currentUser.friends.includes(u.id))

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 px-4 pt-12 pb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-4xl font-black text-white">{currentUser.avatar}</span>
          </div>
          <div>
            <h1 className="text-2xl font-black">{currentUser.name}</h1>
            <p className="text-pink-100 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {currentUser.area}
            </p>
            <p className="text-pink-100 text-sm mt-0.5">{currentUser.age} år</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <StatCard value={myActivities.length} label="Aktiviteter" />
          <StatCard value={friends.length} label="Venner" />
          <StatCard value={completedActivities.length} label="Fullført" />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Venner */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">👯 Venner</h3>
          <div className="space-y-2">
            {friends.map((friend, i) => (
              <button key={friend.id} onClick={() => navigate(`/user/${friend.id}`)} className="w-full flex items-center gap-3 text-left">
                <Avatar initial={friend.avatar} size="sm" index={i} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{friend.name}</p>
                  <p className="text-xs text-gray-400">{friend.area}</p>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Bakgrunnsfarge */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">🎨 Bakgrunnsfarge</h3>
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className="w-14 h-14 rounded-2xl border-2 border-gray-200 shadow-sm flex-shrink-0 overflow-hidden relative"
              style={{ backgroundColor: bgColor }}
            >
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Velg farge</p>
              <p className="text-xs text-gray-400 mt-0.5">{bgColor}</p>
            </div>
          </label>
        </div>

        {/* Innstillinger */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { label: 'Rediger profil', emoji: '✏️', path: '/edit-profile' },
            { label: 'Varsler', emoji: '🔔', path: null },
            { label: 'Personvern', emoji: '🔒', path: null },
            { label: 'Hjelp', emoji: '❓', path: null },
          ].map(({ label, emoji, path }) => (
            <button
              key={label}
              onClick={() => path && navigate(path)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span>{emoji}</span>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Logg ut */}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center justify-center gap-2 py-4 text-red-400 text-sm font-medium"
        >
          <LogOut size={16} />
          Logg ut
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/20 rounded-2xl px-3 py-3 text-center">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-pink-100 text-xs">{label}</p>
    </div>
  )
}
