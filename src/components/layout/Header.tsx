// ─── Topptekst med tilbakeknapp ───────────────────────────────────────────────
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function Header({ title, showBack = true, right }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-40 border-b border-gray-50">
      {showBack ? (
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-500">
          <ChevronLeft size={26} />
        </button>
      ) : (
        <div className="w-8" />
      )}
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="w-8 flex justify-end">{right}</div>
    </header>
  )
}
