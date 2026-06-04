interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-7">
      <p className="text-[10px] font-bold text-green uppercase tracking-[2px] mb-1.5">{eyebrow}</p>
      <h2 className="text-[22px] font-extrabold text-green-dark tracking-tight">{title}</h2>
      {subtitle && <p className="text-[13px] text-muted mt-1">{subtitle}</p>}
    </div>
  )
}
