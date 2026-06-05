export default function PatientsBadge({ accepting }: { accepting: boolean }) {
  if (accepting) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-[8px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] inline-block" />
        Accepte de nouveaux patients
      </span>
    )
  }
  return null
}
