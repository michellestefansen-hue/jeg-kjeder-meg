// ─── Bunnnavigasjon ───────────────────────────────────────────────────────────
import { Home, Compass, Calendar, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { label: 'Hjem', icon: Home, path: '/home' },
  { label: 'Utforsk', icon: Compass, path: '/explore' },
  { label: 'Mine', icon: Calendar, path: '/my-activities' },
  { label: 'Profil', icon: User, path: '/profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex safe-bottom z-50 max-w-md mx-auto">
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
