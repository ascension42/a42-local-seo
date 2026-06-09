'use client'
import dynamic from 'next/dynamic'
import type { Practitioner } from '@/lib/types'

const PractitionerProfileMap = dynamic(
  () => import('@/components/practitioners/PractitionerProfileMap'),
  {
    ssr: false,
    loading: () => <div className="h-[200px] bg-bg-alt rounded-xl animate-pulse border border-border" />,
  }
)

export default function PractitionerProfileMapWrapper({ practitioner }: { practitioner: Practitioner }) {
  return <PractitionerProfileMap practitioner={practitioner} />
}
