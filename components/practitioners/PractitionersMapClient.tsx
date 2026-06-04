'use client'
import dynamic from 'next/dynamic'
import type { Practitioner } from '@/lib/types'

const PractitionersMap = dynamic(
  () => import('@/components/practitioners/PractitionersMap'),
  { ssr: false, loading: () => <div className="h-[380px] bg-bg-alt rounded-xl animate-pulse" /> }
)

interface Props {
  practitioners: Practitioner[]
}

export default function PractitionersMapClient({ practitioners }: Props) {
  return <PractitionersMap practitioners={practitioners} />
}
