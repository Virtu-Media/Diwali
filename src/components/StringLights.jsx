import { useMemo } from 'react'
import useViewportWidth from '../hooks/useViewportWidth.js'

const BULBS = ['#ffd27f', '#ffab5e', '#ff8f6b', '#ff7597', '#c78bff', '#ffe7ae']

const HEIGHT = 150

/** Build one draped strand: a run of U-shaped scallops plus the bulbs hanging off it. */
function strand({ width, baseY, dip, period, perScallop, r, dim, seed }) {
  const count = Math.ceil((width + period * 2) / period)
  const wire = []
  const bulbs = []

  for (let i = 0; i < count; i++) {
    const x0 = -period + i * period
    const x1 = x0 + period
    const cx = (x0 + x1) / 2
    const cy = baseY + dip * 2
    wire.push(`M ${x0.toFixed(1)} ${baseY} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${baseY}`)

    for (let b = 1; b <= perScallop; b++) {
      const t = b / (perScallop + 1)
      const mt = 1 - t
      const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1
      const y = mt * mt * baseY + 2 * mt * t * cy + t * t * baseY
      const n = i * 7 + b * 3 + seed
      bulbs.push({
        key: `${seed}-${i}-${b}`,
        x,
        y,
        r,
        dim,
        color: BULBS[n % BULBS.length],
        delay: (n % 11) * 0.24,
        swing: 2.6 + (n % 5) * 0.5,
      })
    }
  }

  return { path: wire.join(' '), bulbs }
}

export default function StringLights() {
  const width = useViewportWidth()

  const { back, front } = useMemo(() => {
    // Two or three drapes on a phone, up to seven across a wide desktop.
    const scallops = Math.min(7, Math.max(2, Math.round(width / 230)))
    const period = width / scallops
    return {
      back: strand({
        width,
        baseY: -10,
        dip: 30,
        period: period * 0.78,
        perScallop: 3,
        r: 4,
        dim: 0.55,
        seed: 2,
      }),
      front: strand({
        width,
        baseY: 16,
        dip: Math.min(62, period * 0.34),
        period,
        perScallop: 4,
        r: 6.5,
        dim: 1,
        seed: 0,
      }),
    }
  }, [width])

  return (
    <div className="lights" aria-hidden="true">
      <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`}>
        <g className="strand strand--back">
          <path d={back.path} fill="none" />
          {back.bulbs.map((b) => (
            <Bulb key={b.key} {...b} />
          ))}
        </g>
        <g className="strand strand--front">
          <path d={front.path} fill="none" />
          {front.bulbs.map((b) => (
            <Bulb key={b.key} {...b} />
          ))}
        </g>
      </svg>
      <div className="lights__wash" />
    </div>
  )
}

function Bulb({ x, y, r, color, delay, swing, dim }) {
  const stem = r * 0.9
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <line className="stem" y2={stem} />
      <g
        className="bulb"
        style={{
          '--glow': color,
          '--dim': dim,
          animationDelay: `${delay}s`,
          animationDuration: `${swing}s`,
        }}
        transform={`translate(0 ${stem})`}
      >
        <circle className="bulb__halo" r={r * 2.6} fill={color} />
        <circle r={r} fill={color} />
        <circle r={r * 0.42} cx={-r * 0.24} cy={-r * 0.24} fill="#fffdf6" opacity="0.85" />
      </g>
    </g>
  )
}
