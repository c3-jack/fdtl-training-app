import type { Member } from '../types'
import { StatusChip } from './StatusChip'

export function MemberCard({ member }: { member: Member }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{member.name}</p>
        <p className="truncate text-sm text-slate-500">{member.office}</p>
      </div>

      <StatusChip status={member.status} />
    </li>
  )
}
