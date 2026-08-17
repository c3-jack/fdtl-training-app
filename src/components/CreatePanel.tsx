import { useEffect, useMemo, useState } from 'react'
import type { Difficulty, Puzzle } from '../types/puzzle'
import { DIFFICULTY_LABELS } from '../types/puzzle'
import { validatePuzzle } from '../lib/puzzle'
import { modePath, shareUrl, copyToClipboard, getShortUrl } from '../lib/share'
import { track } from '../lib/analytics'
import {
  deleteDraft,
  exportSinglePuzzle,
  loadDrafts,
  newDraftId,
  parseImport,
  saveDraft,
  type StoredDraft,
} from '../lib/drafts'
import { pickRandomFiller } from '../data/filler-groups'

/**
 * Shape of the in-progress form. Looser than Puzzle (strings instead of
 * tuples, optional difficulty) so the user can build the puzzle
 * incrementally without type gymnastics.
 */
interface DraftGroup {
  title: string
  words: string[] // always length 4
  difficulty: Difficulty | null
}

interface Draft {
  title: string
  author: string
  groups: DraftGroup[] // always length 4
}

function hasAnyContent(d: Draft): boolean {
  if (d.title.trim() || d.author.trim()) return true
  return d.groups.some((g) => g.title.trim() || g.words.some((w) => w.trim()))
}

function emptyDraft(): Draft {
  return {
    title: '',
    author: '',
    groups: [0, 1, 2, 3].map((i) => ({
      title: '',
      words: ['', '', '', ''],
      difficulty: i as Difficulty, // pre-assign distinct difficulties so it's valid from the start
    })),
  }
}

function draftToPuzzle(d: Draft): unknown {
  return {
    v: 1,
    title: d.title.trim() || undefined,
    author: d.author.trim() || undefined,
    groups: d.groups.map((g) => ({
      title: g.title,
      words: g.words,
      difficulty: g.difficulty,
    })),
  }
}

const DIFFICULTY_OPTIONS: Difficulty[] = [0, 1, 2, 3]

export function CreatePanel({ onBack, initialPuzzle }: { onBack: () => void; initialPuzzle?: Puzzle }) {
  const [draft, setDraft] = useState<Draft>(() => {
    if (!initialPuzzle) return emptyDraft()
    return {
      title: initialPuzzle.title ?? '',
      author: initialPuzzle.author ?? '',
      groups: initialPuzzle.groups.map((g) => ({
        title: g.title,
        words: [...g.words],
        difficulty: g.difficulty,
      })),
    }
  })
  const [draftId] = useState<string>(() => newDraftId())
  const [showShareFor, setShowShareFor] = useState<Puzzle | null>(null)
  const [drafts, setDrafts] = useState<StoredDraft[]>(() => loadDrafts())
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [exportBanner, setExportBanner] = useState<'copied' | 'failed' | null>(null)

  // Autosave on any change. Tiny debounce via microtask isn't needed --
  // localStorage writes are fast and the draft object is small. We don't
  // re-read `drafts` state here because the dropdown filters out the
  // current draft anyway -- autosaves don't affect what it shows.
  useEffect(() => {
    if (!hasAnyContent(draft)) return
    saveDraft({
      id: draftId,
      savedAt: Date.now(),
      title: draft.title,
      author: draft.author,
      groups: draft.groups.map((g) => ({
        title: g.title,
        words: g.words,
        difficulty: g.difficulty,
      })),
    })
  }, [draft, draftId])

  const validation = useMemo(() => validatePuzzle(draftToPuzzle(draft)), [draft])

  const wordsFilled = draft.groups.reduce(
    (n, g) => n + g.words.filter((w) => w.trim()).length,
    0,
  )

  function updateGroup(i: number, patch: Partial<DraftGroup>) {
    setDraft((d) => ({
      ...d,
      groups: d.groups.map((g, gi) => (gi === i ? { ...g, ...patch } : g)),
    }))
  }

  function updateWord(gi: number, wi: number, value: string) {
    setDraft((d) => ({
      ...d,
      groups: d.groups.map((g, i) =>
        i === gi ? { ...g, words: g.words.map((w, j) => (j === wi ? value : w)) } : g,
      ),
    }))
  }

  // Swap a random pre-built filler into one group slot, keeping the current
  // color so we don't break the "4 distinct difficulties" invariant. Any word
  // already used in another group is avoided.
  function randomFillGroup(gi: number) {
    setDraft((d) => {
      const otherWords = new Set<string>()
      d.groups.forEach((g, i) => {
        if (i === gi) return
        g.words.forEach((w) => {
          const t = w.trim()
          if (t) otherWords.add(t)
        })
      })
      const current = d.groups[gi]
      const filler = pickRandomFiller(otherWords, current.difficulty)
      return {
        ...d,
        groups: d.groups.map((g, i) =>
          i === gi
            ? { title: filler.title, words: [...filler.words], difficulty: current.difficulty ?? filler.difficulty }
            : g,
        ),
      }
    })
  }

  function handleGenerate() {
    if (!validation.ok) return
    // A finished puzzle is the supply side of the loop; opens of that link are
    // the demand side, counted in App.
    track('puzzle-created')
    setShowShareFor(validation.puzzle)
    // pushState (not assignment) so the URL reflects the puzzle without
    // forcing a reload; the Share screen reads shareUrl() for display.
    window.history.pushState(null, '', modePath({ play: validation.puzzle }))
    // Finished puzzles don't need to clutter the drafts list.
    deleteDraft(draftId)
  }

  async function handleExport() {
    if (!validation.ok) return
    const name = validation.puzzle.title || 'connections-puzzle'
    const json = exportSinglePuzzle(validation.puzzle, name)
    const ok = await copyToClipboard(json)
    setExportBanner(ok ? 'copied' : 'failed')
    setTimeout(() => setExportBanner(null), 2500)
  }

  function handleImportOpen() {
    setImportError(null)
    setImportText('')
    setImportOpen(true)
  }

  function handleImportSubmit() {
    setImportError(null)
    try {
      const items = parseImport(importText)
      if (items.length === 0) throw new Error('No puzzles found')
      const first = validatePuzzle(items[0])
      if (!first.ok) throw new Error(first.error)
      const p = first.puzzle
      setDraft({
        title: p.title ?? '',
        author: p.author ?? '',
        groups: p.groups.map((g) => ({
          title: g.title,
          words: [...g.words],
          difficulty: g.difficulty,
        })),
      })
      setImportOpen(false)
      setImportText('')
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Could not parse JSON')
    }
  }

  function handleLoadDraft(d: StoredDraft) {
    setDraft({
      title: d.title,
      author: d.author,
      groups: d.groups.map((g) => ({
        title: g.title,
        words: g.words.length === 4 ? g.words : ['', '', '', ''],
        difficulty: (g.difficulty === 0 || g.difficulty === 1 || g.difficulty === 2 || g.difficulty === 3)
          ? (g.difficulty as Difficulty)
          : null,
      })),
    })
  }

  function handleDeleteDraft(id: string) {
    deleteDraft(id)
    setDrafts(loadDrafts())
  }

  if (showShareFor) {
    return <ShareScreen puzzle={showShareFor} onEdit={() => setShowShareFor(null)} onBack={onBack} />
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 page-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-[var(--text-dim)] hover:text-[var(--text)] text-sm"
          type="button"
        >
          ← Home
        </button>
        <h1 className="text-2xl font-bold text-[var(--text)]">Create puzzle</h1>
        <div className="w-12" />
      </div>

      <div className="bg-[var(--surface)] rounded-lg p-4 mb-4 border border-[var(--border)]">
        <input
          type="text"
          placeholder="Puzzle title (optional)"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          className="w-full bg-transparent text-xl font-semibold text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none"
          maxLength={80}
        />
        <input
          type="text"
          placeholder="Your name (optional)"
          value={draft.author}
          onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
          className="w-full bg-transparent text-sm text-[var(--text-dim)] placeholder:text-[var(--text-dim)] focus:outline-none mt-1"
          maxLength={40}
        />
      </div>

      {/* Drafts + import/export toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          type="button"
          onClick={handleImportOpen}
          className="px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs hover:bg-[var(--color-bg-hover)]"
        >
          Import JSON
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={!validation.ok}
          className="px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs hover:bg-[var(--color-bg-hover)] disabled:opacity-40"
          title={validation.ok ? 'Copy puzzle JSON to clipboard' : 'Finish the puzzle to export'}
        >
          Export JSON
        </button>
        {drafts.filter((d) => d.id !== draftId).length > 0 && (
          <DraftsDropdown
            drafts={drafts.filter((d) => d.id !== draftId)}
            onLoad={handleLoadDraft}
            onDelete={handleDeleteDraft}
          />
        )}
      </div>

      {exportBanner === 'copied' && (
        <div className="px-3 py-2 rounded-md bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent)] text-sm mb-3">
          Puzzle JSON copied to clipboard.
        </div>
      )}
      {exportBanner === 'failed' && (
        <div className="px-3 py-2 rounded-md bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--text)] text-sm mb-3">
          Clipboard copy failed. Try again, or use the share link instead.
        </div>
      )}

      {importOpen && (
        <ImportModal
          text={importText}
          error={importError}
          onChange={setImportText}
          onSubmit={handleImportSubmit}
          onClose={() => setImportOpen(false)}
        />
      )}

      <ValidationPill validation={validation} wordsFilled={wordsFilled} />

      <div className="space-y-4 mt-4">
        {draft.groups.map((g, gi) => (
          <GroupEditor
            key={gi}
            index={gi}
            group={g}
            usedDifficulties={draft.groups.filter((_, i) => i !== gi).map((x) => x.difficulty)}
            onUpdate={(patch) => updateGroup(gi, patch)}
            onWordChange={(wi, value) => updateWord(gi, wi, value)}
            onRandomFill={() => randomFillGroup(gi)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!validation.ok}
        className={`mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-[#111] font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--border)] hover:brightness-110 hover:scale-[1.005] active:scale-[0.995] transition-all ${validation.ok ? 'glow-cta' : ''}`}
      >
        Generate share link
      </button>
    </div>
  )
}

function ValidationPill({
  validation,
  wordsFilled,
}: {
  validation: ReturnType<typeof validatePuzzle>
  wordsFilled: number
}) {
  if (validation.ok) {
    return (
      <div className="px-3 py-2 rounded-md bg-[var(--accent)]/20 text-[var(--accent)] text-sm border border-[var(--accent)]/40">
        Ready to share — all 16 words, 4 groups, 4 colors ✓
      </div>
    )
  }
  const msg = wordsFilled < 16 ? `${wordsFilled}/16 words entered` : validation.error
  return (
    <div className="px-3 py-2 rounded-md bg-[var(--color-danger)]/10 text-[var(--text)] text-sm border border-[var(--border)]">
      {msg}
    </div>
  )
}

function GroupEditor({
  index,
  group,
  usedDifficulties,
  onUpdate,
  onWordChange,
  onRandomFill,
}: {
  index: number
  group: DraftGroup
  usedDifficulties: (Difficulty | null)[]
  onUpdate: (patch: Partial<DraftGroup>) => void
  onWordChange: (wi: number, value: string) => void
  onRandomFill: () => void
}) {
  const bandColor = group.difficulty !== null ? `var(--diff-${group.difficulty})` : 'var(--border)'
  const rollTitle = group.difficulty !== null
    ? `Random ${DIFFICULTY_LABELS[group.difficulty].toLowerCase()} filler`
    : 'Random filler'
  return (
    <div
      className="bg-[var(--surface)] rounded-lg border border-[var(--border)] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={group.difficulty !== null ? { boxShadow: `0 4px 16px -8px color-mix(in srgb, ${bandColor} 50%, transparent)` } : undefined}
    >
      <div className="h-1.5" style={{ background: bandColor }} />
      <div className="p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <span className="text-[var(--text-dim)] text-sm font-mono w-6">{index + 1}.</span>
          <input
            type="text"
            placeholder="Category title (e.g. Types of bread)"
            value={group.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="flex-1 bg-transparent text-[var(--text)] font-medium placeholder:text-[var(--text-dim)] focus:outline-none"
            maxLength={60}
          />
          <button
            type="button"
            onClick={onRandomFill}
            title={rollTitle}
            aria-label={rollTitle}
            className="px-2 py-1 text-base rounded border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            🎲
          </button>
          <select
            value={group.difficulty ?? ''}
            onChange={(e) => {
              const v = e.target.value
              onUpdate({ difficulty: v === '' ? null : (Number(v) as Difficulty) })
            }}
            className="bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text)]"
          >
            <option value="">Color...</option>
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d} value={(d + 1) % 4} disabled={usedDifficulties.includes(d) && group.difficulty !== d}>
                {DIFFICULTY_LABELS[d]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {group.words.map((w, wi) => (
            <input
              key={wi}
              type="text"
              placeholder={`Word ${wi + 1}`}
              value={w}
              onChange={(e) => onWordChange(wi, e.target.value)}
              className="bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1.5 text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]"
              maxLength={30}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ImportModal({
  text,
  error,
  onChange,
  onSubmit,
  onClose,
}: {
  text: string
  error: string | null
  onChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Import puzzle JSON</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-[var(--text)] text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-[var(--text-dim)] mb-3">
          Paste a puzzle bundle or a bare puzzle object below.
        </p>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder='{"v":1,"groups":[...]}'
          className="w-full h-48 bg-[var(--bg)] border border-[var(--border)] rounded p-2 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] resize-y"
          autoFocus
        />
        {error && (
          <div className="mt-2 px-3 py-2 rounded-md bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--text)] text-sm">
            Import failed: {error}
          </div>
        )}
        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm hover:bg-[var(--color-bg-hover)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!text.trim()}
            className="px-3 py-1.5 rounded-md bg-[var(--accent)] text-[#111] text-sm font-semibold disabled:opacity-40 hover:brightness-110"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}

function DraftsDropdown({
  drafts,
  onLoad,
  onDelete,
}: {
  drafts: StoredDraft[]
  onLoad: (d: StoredDraft) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs hover:bg-[var(--color-bg-hover)]"
      >
        Drafts ({drafts.length})
      </button>
      {open && (
        <>
          {/* Backdrop closes on outside click */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-lg">
            {drafts.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--color-bg-hover)]"
              >
                <button
                  type="button"
                  onClick={() => {
                    onLoad(d)
                    setOpen(false)
                  }}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="text-sm text-[var(--text)] truncate">
                    {d.title.trim() || '(untitled)'}
                  </div>
                  <div className="text-xs text-[var(--text-dim)]">
                    {formatRelative(d.savedAt)}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(d.id)}
                  className="text-[var(--text-dim)] hover:text-[var(--text)] text-xs px-1"
                  title="Delete draft"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  return `${days}d ago`
}

function ShareScreen({ puzzle, onEdit, onBack }: { puzzle: Puzzle; onEdit: () => void; onBack: () => void }) {
  const fullUrl = shareUrl(puzzle)
  // Shorten on mount so the displayed URL is already the short one by the
  // time the user goes to copy it. Falls back to full URL on failure.
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [shortening, setShortening] = useState(true)
  // null = idle, 'short'/'full' after copy.
  const [copyState, setCopyState] = useState<null | 'short' | 'full'>(null)

  useEffect(() => {
    let cancelled = false
    getShortUrl(fullUrl).then((short) => {
      if (cancelled) return
      setShortUrl(short)
      setShortening(false)
    })
    return () => {
      cancelled = true
    }
  }, [fullUrl])

  const displayUrl = shortUrl ?? fullUrl

  async function handleCopy() {
    const ok = await copyToClipboard(displayUrl)
    if (!ok) return
    setCopyState(shortUrl ? 'short' : 'full')
    setTimeout(() => setCopyState(null), 2500)
  }

  function handlePlay() {
    // URL is already set via pushState -- reload so App re-reads mode and enters Play.
    window.location.reload()
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-center page-in">
      <div className="text-6xl mb-4 bounce-in">🎉</div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Puzzle ready</h1>
      <p className="text-[var(--text-dim)] mb-6">
        Share this link. Anyone who opens it plays your puzzle -- no account, no app install.
      </p>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 mb-4">
        <div className="text-xs text-[var(--text-dim)] mb-1">
          Share URL{shortening ? ' (shortening…)' : shortUrl ? '' : ' (shortener unavailable)'}
        </div>
        <div className="text-sm font-mono break-all text-[var(--text)] select-all">{displayUrl}</div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={shortening}
          className="glow-cta w-full py-3 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-[#111] font-semibold hover:brightness-110 hover:scale-[1.005] active:scale-[0.995] transition-all disabled:opacity-60"
        >
          {shortening
            ? 'Shortening…'
            : copyState === 'short'
              ? 'Short link copied!'
              : copyState === 'full'
                ? 'Copied (full link)'
                : 'Copy link'}
        </button>
        <button
          type="button"
          onClick={handlePlay}
          className="w-full py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)] transition-all"
        >
          Play my puzzle
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="w-full py-2 text-[var(--text-dim)] hover:text-[var(--text)] text-sm"
        >
          ← Edit
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-[var(--text-dim)] hover:text-[var(--text)] text-sm"
        >
          Home
        </button>
      </div>
    </div>
  )
}
