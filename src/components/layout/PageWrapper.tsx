// ─── Sidewrapper som bruker valgt bakgrunnsfarge ──────────────────────────────
import { useAppStore } from '../../store/useAppStore'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  const bgColor = useAppStore((s) => s.bgColor)
  return (
    <div className={`min-h-dvh ${className}`} style={{ backgroundColor: bgColor }}>
      {children}
    </div>
  )
}
