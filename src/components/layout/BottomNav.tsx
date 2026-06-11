// ─── Bunnnavigasjon ───────────────────────────────────────────────────────────
import { Home, Compass, MessageCircle, Calendar, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

const tabs = [
  { label: 'Hjem', icon: Home, path: '/home' },
  { label: 'Utforsk', icon: Compass, path: '/explore' },
  { label: 'Chat', icon: MessageCircle, path: '/messages' },
  { label: 'Mine', icon: Calendar, path: '/my-activities' },
  { label: 'Profil', icon: User, path: '/profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const unread = useAppStore((s) =>
    Object.values(s.directChats).filter((c) => c.unread > 0).length +
    Object.values(s.groupChats).filter((g) => g.unread > 0).length
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex safe-bottom z-50 max-w-md mx-auto">
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = location.pathname.startsWith(path)
        const showBadge = path === '/messages' && unread > 0
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              {showBadge && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
