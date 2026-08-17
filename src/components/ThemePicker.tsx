import { useEffect, useState } from 'react'

const THEMES = [
  { id: 'dark', label: 'Dark', color: '#1a1a1a' },
  { id: 'light', label: 'Light', color: '#ffffff' },
] as const

type ThemeId = (typeof THEMES)[number]['id']

const STORAGE_KEY = 'connections-maker-theme'

export function ThemePicker() {
  const [active, setActive] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (stored && THEMES.some((t) => t.id === stored)) return stored
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', active)
    localStorage.setItem(STORAGE_KEY, active)
  }, [active])

  return (
    <div className="flex items-center gap-1.5" aria-label="Theme picker">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          title={theme.label}
          aria-label={`Switch to ${theme.label} theme`}
          onClick={() => setActive(theme.id)}
          style={{ backgroundColor: theme.color }}
          className={`h-4 w-4 rounded-full border border-[var(--border)] transition-transform hover:scale-110 focus:outline-none ${
            active === theme.id
              ? 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg)] scale-110'
              : 'opacity-70 hover:opacity-100'
          }`}
        />
      ))}
    </div>
  )
}
