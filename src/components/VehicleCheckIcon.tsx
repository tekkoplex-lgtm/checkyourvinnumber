import type { SVGProps } from 'react'

type Kind = 'theft' | 'mileage' | 'damage'
type Props = SVGProps<SVGSVGElement> & { kind: Kind }

/** Matching, accessible line icons for the three vehicle-history checks. */
export function VehicleCheckIcon({ kind, ...props }: Props) {
  return <svg viewBox="0 0 64 64" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    {kind === 'theft' && <>
      <path d="M8 37l5-13a7 7 0 0 1 6.5-4.5H40a7 7 0 0 1 6.5 4.5l3 8" />
      <path d="M12 37h34M12 37l-3 6v7h8v-5h22M17 37l3-7h19l3 7M16 43h5" />
      <circle cx="19" cy="42" r="1.4" fill="currentColor" stroke="none" />
      <path d="M41 41v-5a7 7 0 0 1 14 0v5M39 41h18v15H39z" />
      <circle cx="48" cy="47" r="1.7" fill="currentColor" stroke="none" /><path d="M48 49v3" />
    </>}
    {kind === 'mileage' && <>
      <path d="M11 47a25 25 0 1 1 42 0M14 47h36" />
      <path d="M32 12v5M15 24l4 3M49 24l-4 3M9 37l5 1M55 37l-5 1" />
      <path d="M32 40l12-17-7 20a6 6 0 1 1-5-3Z" />
      <path d="M23 52h18M28 57h8" />
    </>}
    {kind === 'damage' && <>
      <path d="M8 39l5-13a7 7 0 0 1 7-5h23a7 7 0 0 1 7 5l5 13v12h-8v-5H17v5H9V39Z" />
      <path d="M12 39h43M17 33l3-6h23l3 6M17 44h7M42 44h7" />
      <path d="M31 17l-5 12 7-2-4 12 11-15-8 2 4-9" strokeWidth="3.2" />
    </>}
  </svg>
}
