import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'premium' | 'certified' | 'mode' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    premium:   'bg-green text-white',
    certified: 'bg-surface text-green-dark',
    mode:      'bg-green text-white',
    default:   'bg-surface text-green-dark',
  }
  return (
    <span className={cn(
      'text-[10px] font-semibold px-2.5 py-1 rounded-[10px] tracking-[0.3px]',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
