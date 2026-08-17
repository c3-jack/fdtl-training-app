import { useEffect, useState } from 'react'
import { ThemePicker } from './components/ThemePicker'
import { CreatePanel } from './components/CreatePanel'
import { PlayPanel } from './components/PlayPanel'
import { modePath, readMode } from './lib/share'
import type { Mode } from './lib/share'
import { pickExample } from './data/examples'
import { track } from './lib/analytics'

/**
 * Push a new URL onto history without reloading, then rerender by
 * re-reading the URL into mode. We listen to popstate so back/forward
 * from the browser also rerenders.
 */
function navigate(path: string, setMode: (m: Mode) => void) {
  window.history.pushState(null, '', path)
  setMode(readMode())
}

export default function App() {
  const [mode, setMode] = useState<Mode>(() => readMode())

  // The one number that says whether this thing is spreading: someone arrived
  // holding a puzzle another person made. Read once, on mount, before any
  // in-app navigation can turn 'home' into 'play'.
  useEffect(() => {
    const initial = readMode()
    if (initial.kind === 'play') {
      track('puzzle-opened-from-share-link', {
        referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
      })
    }
  }, [])

  useEffect(() => {
    const onPop = () => setMode(readMode())
    window.addEventListener('popstate', onPop)
    // Keep the legacy hashchange listener alive for anyone still using
    // an old `#p=` link that gets edited in the address bar.
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  function goHome() {
    navigate(modePath('home'), setMode)
  }
  function goCreate() {
    navigate(modePath('create'), setMode)
  }
  function playExample() {
    track('example-played')
    navigate(modePath({ play: pickExample() }), setMode)
  }

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <ThemePicker />
      </div>

      {mode.kind === 'home' && <HomeScreen onCreate={goCreate} onExample={playExample} />}
      {mode.kind === 'create' && <CreatePanel onBack={goHome} />}
      {mode.kind === 'play' && <PlayPanel puzzle={mode.puzzle} onBack={goHome} onCreate={goCreate} />}
      {mode.kind === 'invalid' && <InvalidScreen onBack={goHome} onCreate={goCreate} />}
    </div>
  )
}

function HomeScreen({ onCreate, onExample }: { onCreate: () => void; onExample: () => void }) {
  return (
    <div className="max-w-xl mx-auto p-8 pt-16 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-6 w-6 rounded" style={{ background: 'var(--diff-0)' }} />
        <div className="h-6 w-6 rounded" style={{ background: 'var(--diff-1)' }} />
        <div className="h-6 w-6 rounded" style={{ background: 'var(--diff-2)' }} />
        <div className="h-6 w-6 rounded" style={{ background: 'var(--diff-3)' }} />
      </div>
      <h1 className="text-4xl font-bold text-[var(--text)] mb-2">Connections Maker</h1>
      <p className="text-[var(--text-dim)] mb-10">
        Build and share your own NYT-style Connections puzzles. 16 words, 4 groups, no account needed.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="w-full py-4 rounded-lg bg-[var(--accent)] text-[#111] font-semibold text-lg hover:brightness-110 transition-all mb-3"
      >
        Create a puzzle
      </button>
      <button
        type="button"
        onClick={onExample}
        className="w-full py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)] transition-all"
      >
        Play an example
      </button>
      <div className="mt-10 text-left text-sm text-[var(--text-dim)] space-y-2">
        <p className="font-semibold text-[var(--text)]">How it works</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Pick 16 words you can split into 4 groups of 4.</li>
          <li>Give each group a theme title and a color.</li>
          <li>Copy the generated share link and send it to friends.</li>
          <li>They solve it in their browser -- no install, no account.</li>
        </ol>
      </div>
      <p className="text-[var(--text-dim)] text-xs mt-8">
        Puzzles live entirely in the share link -- no accounts, no database, nothing tracked.
      </p>
    </div>
  )
}

function InvalidScreen({ onBack, onCreate }: { onBack: () => void; onCreate: () => void }) {
  return (
    <div className="max-w-xl mx-auto p-8 pt-16 text-center">
      <div className="text-5xl mb-4">🤔</div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-2">That link isn't a valid puzzle</h1>
      <p className="text-[var(--text-dim)] mb-6">
        It might be truncated by the chat app that sent it, or the puzzle format has changed.
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onCreate}
          className="w-full py-3 rounded-lg bg-[var(--accent)] text-[#111] font-semibold"
        >
          Create a new puzzle
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-[var(--text-dim)]"
        >
          Home
        </button>
      </div>
    </div>
  )
}
