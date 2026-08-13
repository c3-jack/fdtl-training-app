/**
 * A single word tile. The shake animation is keyed by `shakeKey` so
 * we can retrigger it on every wrong guess without cloning the node.
 */
export function Tile({
  word,
  selected,
  shakeKey,
  onClick,
}: {
  word: string
  selected: boolean
  shakeKey: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      key={shakeKey} // force re-mount on shake so the animation replays
      onClick={onClick}
      className={`
        aspect-square flex items-center justify-center
        rounded-lg font-semibold uppercase tracking-wide text-center
        transition-all duration-100 select-none
        text-[0.7rem] sm:text-sm
        px-1
        ${
          selected
            ? 'bg-[var(--accent)] text-[#111] scale-95 shadow-inner'
            : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--color-bg-hover)] border border-[var(--border)]'
        }
      `}
      style={{ minHeight: '56px', animation: shakeKey > 0 ? 'tile-shake 0.4s ease-in-out' : undefined }}
    >
      <span className="leading-tight break-words">{word}</span>
    </button>
  )
}
