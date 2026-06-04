import type { ConsultationMode } from '@/lib/types'
import { cn } from '@/lib/utils'

const labels: Record<ConsultationMode, string> = {
  cabinet: 'Cabinet uniquement',
  online:  'En ligne uniquement',
  both:    'Cabinet & En ligne',
}

const styles: Record<ConsultationMode, string> = {
  cabinet: 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]',
  online:  'bg-[#f0fdf4] text-[#15803d] border border-[#86efac]',
  both:    'bg-surface text-green-dark border border-green-light',
}

export default function ModeTag({ mode }: { mode: ConsultationMode }) {
  return (
    <span className={cn('text-[9px] font-semibold px-2 py-1 rounded-[8px] whitespace-nowrap', styles[mode])}>
      {labels[mode]}
    </span>
  )
}
