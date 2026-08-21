import { useEffect, useState } from 'react'

const THEMES = [
  { id: 'tokyo', label: 'Tokyo Night', color: '#73daca' },
  { id: 'miami', label: 'Miami', color: '#ff2d95' },
  { id: 'matcha', label: 'Matcha', color: '#8db660' },
  { id: 'gruvbox', label: 'Gruvbox', color: '#fb4934' },
] as const

type ThemeId = (typeof THEMES)[number]['id']
type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'connections-maker-theme'
const MODE_STORAGE_KEY = 'connections-maker-theme-mode'

export function ThemePicker() {
  const [active, setActive] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (stored && THEMES.some((t) => t.id === stored)) return stored
    return 'tokyo'
  })
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY)
    return stored === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', active)
    localStorage.setItem(STORAGE_KEY, active)
  }, [active])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    localStorage.setItem(MODE_STORAGE_KEY, mode)
  }, [mode])

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1.5" aria-label="Theme picker">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            title={theme.label}
            aria-label={`Switch to ${theme.label} theme`}
            onClick={() => setActive(theme.id)}
            style={{ backgroundColor: theme.color }}
            className={`h-4 w-4 rounded-full transition-transform hover:scale-110 focus:outline-none ${
              active === theme.id
                ? 'ring-2 ring-white/70 ring-offset-1 ring-offset-[var(--bg)] scale-110'
                : 'opacity-70 hover:opacity-100'
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
        className="h-6 w-6 flex items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--color-bg-hover)] transition-colors focus:outline-none"
      >
        {mode === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm7.5 2.5a1 1 0 0 1-1 1H17a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1Zm-14 0a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1ZM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1Zm6.02-9.02a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0ZM7.46 15.6a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0Zm10.14 1.42a1 1 0 0 1-1.42 0l-1.06-1.06a1 1 0 1 1 1.42-1.42l1.06 1.06a1 1 0 0 1 0 1.42ZM6.4 6.4a1 1 0 0 1-1.42 0L3.92 5.34a1 1 0 1 1 1.42-1.42L6.4 4.98a1 1 0 0 1 0 1.42Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
