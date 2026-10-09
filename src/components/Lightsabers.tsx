// Decorative lightsabers flanking the page. Always rendered, but hidden by
// CSS unless the Star Wars Rebels theme is active (see themes.css), so the
// component doesn't need to know which theme is selected.

type SaberProps = {
  side: 'left' | 'right'
  color: 'blue' | 'green'
}

function Hilt() {
  return (
    <svg className="saber-hilt" viewBox="0 0 28 120" width="28" height="120" aria-hidden="true">
      <defs>
        <linearGradient id="saber-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5b616b" />
          <stop offset="0.35" stopColor="#e4e8ee" />
          <stop offset="0.6" stopColor="#a9b0bb" />
          <stop offset="1" stopColor="#4a4f57" />
        </linearGradient>
      </defs>
      {/* emitter shroud */}
      <rect x="2" y="0" width="24" height="16" rx="2" fill="url(#saber-metal)" />
      <rect x="2" y="12" width="24" height="3" fill="#2b2f36" />
      {/* neck */}
      <rect x="6" y="16" width="16" height="8" fill="url(#saber-metal)" />
      {/* activation box */}
      <rect x="4" y="24" width="20" height="18" rx="1.5" fill="url(#saber-metal)" />
      <rect className="saber-button" x="18" y="29" width="5" height="8" rx="1" />
      {/* grip ridges */}
      <rect x="5" y="42" width="18" height="56" fill="url(#saber-metal)" />
      {[46, 53, 60, 67, 74, 81, 88].map((y) => (
        <rect key={y} x="4" y={y} width="20" height="4" rx="1" fill="#16181d" />
      ))}
      {/* pommel */}
      <rect x="3" y="98" width="22" height="14" rx="2" fill="url(#saber-metal)" />
      <rect x="7" y="112" width="14" height="8" rx="2" fill="#2b2f36" />
    </svg>
  )
}

function Saber({ side, color }: SaberProps) {
  return (
    <div className={`saber saber-${side} saber-${color}`}>
      <div className="saber-blade" />
      <Hilt />
    </div>
  )
}

export function Lightsabers() {
  return (
    <div className="lightsabers" aria-hidden="true">
      <Saber side="left" color="blue" />
      <Saber side="right" color="green" />
    </div>
  )
}
