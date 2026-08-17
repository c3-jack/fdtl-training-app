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
    <div className="max-w-xl mx-auto p-8 pt-16 text-center page-in">
      <div className="flex items-center justify-center gap-2 mb-5">
        {([0, 1, 2, 3] as const).map((i) => (
          <div
            key={i}
            className="h-7 w-7 rounded-md shadow-lg transition-transform hover:scale-125 hover:-translate-y-1"
            style={{
              background: `var(--diff-${i})`,
              boxShadow: `0 6px 16px -4px color-mix(in srgb, var(--diff-${i}) 70%, transparent)`,
              animation: `bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both`,
            }}
          />
        ))}
      </div>
      <h1
        className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)] drop-shadow-sm"
        style={{ letterSpacing: '-0.02em' }}
      >
        Connections Maker
      </h1>
      <p className="text-[var(--text-dim)] mb-10">
        Build and share your own NYT-style Connections puzzles. 16 words, 4 groups, no account needed.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="glow-cta w-full py-4 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-[#111] font-semibold text-lg hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all mb-3"
      >
        Create a puzzle
      </button>
      <button
        type="button"
        onClick={onExample}
        className="w-full py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--accent)]/50 hover:-translate-y-0.5 transition-all"
      >
        Play an example
      </button>
      <div className="mt-10 text-left text-sm text-[var(--text-dim)] space-y-2 bg-[var(--surface)]/60 border border-[var(--border)] rounded-lg p-4 backdrop-blur-sm">
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
    <div className="max-w-xl mx-auto p-8 pt-16 text-center page-in">
      <div className="text-5xl mb-4 bounce-in">🤔</div>
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
