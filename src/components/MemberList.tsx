import type { Member } from '../types'
import { MemberCard } from './MemberCard'
import { members as roster } from '../data/members'

export function MemberList({ visible }: { visible: Member[] }) {
  if (visible.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
        No members match the current filters.
      </p>
    )
  }

  return (
    <section>
      <h2 className="mb-2 text-sm font-medium text-slate-600">
        Showing {roster.length} of {roster.length} members
      </h2>

      <ul className="flex flex-col gap-2">
        {visible.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </ul>
    </section>
  )
}
