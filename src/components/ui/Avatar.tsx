// ─── Avatar-komponent ─────────────────────────────────────────────────────────
const COLORS = [
  'bg-pink-400', 'bg-purple-400', 'bg-rose-400',
  'bg-fuchsia-400', 'bg-violet-400', 'bg-indigo-400',
]

interface AvatarProps {
  initial: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  index?: number
}

export default function Avatar({ initial, size = 'md', index = 0 }: AvatarProps) {
  const color = COLORS[index % COLORS.length]
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl' }
  return (
    <div className={`${color} ${sizes[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initial}
    </div>
  )
}
