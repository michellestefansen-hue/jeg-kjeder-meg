// ─── Profilside ───────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { MapPin, LogOut, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import Avatar from '../../components/ui/Avatar'
import BottomNav from '../../components/layout/BottomNav'
import { USERS } from '../../data/mockData'


export default function Profile() {
  const navigate = useNavigate()
  const { currentUser, activities, logout, bgColor, setBgColor, bannerColor, setBannerColor, blockedUsers, friendRequests } = useAppStore()
  if (!currentUser) { navigate('/'); return null }

  const myActivities = activities.filter((a) => a.participants.includes(currentUser.id))
  const completedActivities = activities.filter((a) => a.status === 'completed' && a.participants.includes(currentUser.id))
  const friends = USERS.filter((u) => currentUser.friends.includes(u.id) && !blockedUsers.includes(u.id))

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-8 text-white" style={{ backgroundColor: bannerColor }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/edit-profile')} className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/40">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{currentUser.avatar}</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-[9px] text-white font-bold">✏️</span>
            </div>
          </button>
          <div>
            <h1 className="text-2xl font-black">{currentUser.name}</h1>
            <p className="text-white/70 text-sm font-medium mt-0.5">@{currentUser.username}</p>
            <p className="text-pink-100 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {currentUser.area}
            </p>
            <p className="text-pink-100 text-sm mt-0.5">{currentUser.age} år</p>
            {currentUser.vippsNumber && (
              <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                <span className="font-black text-[#FF5B24] bg-white/10 px-1.5 py-0.5 rounded text-[10px]">vipps</span>
                +47 {currentUser.vippsNumber}
              </p>
            )}
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">👯 Venner</h3>
            <div className="flex gap-2">
              {/* Forespørsler-knapp med badge */}
              <button
                onClick={() => navigate('/friend-requests')}
                className="relative flex items-center gap-1 text-xs font-semibold text-purple-500 bg-purple-50 px-3 py-1.5 rounded-full"
              >
                Forespørsler
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/add-friends')}
                className="flex items-center gap-1 text-xs font-semibold text-pink-500 bg-pink-50 px-3 py-1.5 rounded-full"
              >
                + Legg til
              </button>
            </div>
          </div>
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

        {/* Farger */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">🎨 Farger</h3>

          <ColorPicker label="Bakgrunnsfarge" value={bgColor} onChange={setBgColor} />
          <ColorPicker label="Bannerfarge" value={bannerColor} onChange={setBannerColor} />
        </div>

        {/* Innstillinger */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { label: 'Rediger profil', emoji: '✏️', path: '/edit-profile' },
            { label: 'Personvern', emoji: '🔒', path: '/privacy' },
            { label: 'Hjelp', emoji: '❓', path: '/help' },
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

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (c: string) => void }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer">
      <div
        className="w-12 h-12 rounded-2xl border-2 border-gray-200 shadow-sm flex-shrink-0 overflow-hidden relative"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{value}</p>
      </div>
    </label>
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
