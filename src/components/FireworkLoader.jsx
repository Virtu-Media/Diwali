import { useEffect, useState } from 'react'

const COLORS = ['#ffd27f', '#ff9a5e', '#ff7597', '#c78bff', '#fff0c4']

function shards(count, reach, seed) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.sin(i * 3.7 + seed) * 0.18
    const dist = reach * (0.55 + (Math.abs(Math.sin(i * 12.9898 + seed)) % 1) * 0.45)
    return {
      tx: `${(Math.cos(angle) * dist).toFixed(1)}px`,
      ty: `${(Math.sin(angle) * dist * 1.08).toFixed(1)}px`,
      size: 3 + (i % 3),
      color: COLORS[(i + seed) % COLORS.length],
      delay: 0.98 + (i % 4) * 0.015,
    }
  })
}

const BURST_A = shards(24, 150, 1)
const BURST_B = shards(16, 78, 4)

export default function FireworkLoader({ onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('is-booting')
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = quiet ? 500 : 2450
    const fade = window.setTimeout(() => setLeaving(true), hold)
    const done = window.setTimeout(() => {
      document.documentElement.classList.remove('is-booting')
      onDone()
    }, hold + 620)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
      document.documentElement.classList.remove('is-booting')
    }
  }, [onDone])

  return (
    <div className={`loader${leaving ? ' loader--out' : ''}`} aria-hidden="true">
      <div className="loader__stage">
        <div className="rocket">
          <span className="rocket__trail" />
          <span className="rocket__head" />
        </div>

        <div className="flash" />

        <div className="boom">
          {BURST_A.map((s, i) => (
            <span
              key={i}
              className="shard"
              style={{
                '--tx': s.tx,
                '--ty': s.ty,
                '--c': s.color,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="boom boom--inner">
          {BURST_B.map((s, i) => (
            <span
              key={i}
              className="shard"
              style={{
                '--tx': s.tx,
                '--ty': s.ty,
                '--c': s.color,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay + 0.42}s`,
              }}
            />
          ))}
        </div>

        <p className="loader__word">Shubh Deepavali</p>
      </div>
    </div>
  )
}
