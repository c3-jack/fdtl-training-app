import type { MemberStatus } from '../types'

const chipStyles: Partial<Record<MemberStatus, string>> = {
  Active: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  Alumni: 'bg-slate-100 text-slate-700 ring-slate-500/20',
}

const labels: Record<MemberStatus, string> = {
  Active: 'Active',
  OnLeave: 'On leave',
  Alumni: 'Alumni',
}

export function StatusChip({ status }: { status: MemberStatus }) {
  const style = chipStyles[status] ?? ''

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {labels[status]}
    </span>
  )
}
