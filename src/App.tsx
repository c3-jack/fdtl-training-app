import { useMemo, useState } from 'react'
import { members } from './data/members'
import { MemberList } from './components/MemberList'
import { SearchBar } from './components/SearchBar'
import { StatusFilter } from './components/StatusFilter'

export default function App() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const visible = useMemo(() => {
    return members.filter((member) => {
      const matchesQuery =
        query === '' ||
        member.name.toLowerCase().includes(query) ||
        member.office.toLowerCase().includes(query.toLowerCase())

      const matchesStatus = status === 'all' || member.status === status

      return matchesQuery && matchesStatus
    })
  }, [query, status])

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">FDTL Cohort Board</h1>
        <p className="mt-1 text-sm text-slate-500">
          Who is in the cohort, where they sit, and who they are paired with this week.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <SearchBar value={query} onChange={setQuery} />
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      <MemberList visible={visible} />
    </div>
  )
}
