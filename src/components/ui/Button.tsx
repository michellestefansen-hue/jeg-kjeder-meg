// ─── Gjenbrukbar knapp-komponent ─────────────────────────────────────────────
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'vipps' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-200',
    secondary: 'bg-pink-50 text-pink-600 border border-pink-200',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-50',
    vipps: 'bg-[#FF5B24] text-white shadow-md shadow-orange-200',
    danger: 'bg-red-50 text-red-500 border border-red-200',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
