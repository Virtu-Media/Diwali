const COUNT = 22

// Stable pseudo-random field so the embers never reshuffle on re-render.
const EMBERS = Array.from({ length: COUNT }, (_, i) => {
  const s = Math.sin(i * 12.9898) * 43758.5453
  const r = s - Math.floor(s)
  const t = Math.sin(i * 78.233) * 12543.21
  const q = t - Math.floor(t)
  return {
    left: `${(r * 100).toFixed(2)}%`,
    size: 2 + q * 3,
    delay: -(r * 14).toFixed(2),
    duration: 13 + q * 11,
    drift: (q - 0.5) * 90,
    warm: i % 3,
  }
})

export default function Embers() {
  return (
    <div className="embers" aria-hidden="true">
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className={`embers__i embers__i--${e.warm}`}
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            '--drift': `${e.drift.toFixed(1)}px`,
          }}
        />
      ))}
    </div>
  )
}
