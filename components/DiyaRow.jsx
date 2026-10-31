export default function DiyaRow() {
  return (
    <div className="diyas" aria-hidden="true">
      <div className="diyas__row">
        <div className="diya">
          <FlameLamp delay={0} duration={2.1} />
        </div>
        <div className="diya">
          <FlameLamp delay={0.7} duration={2.6} />
        </div>
      </div>
    </div>
  )
}

function FlameLamp({ delay, duration }) {
  const flicker = { animationDelay: `${delay}s`, animationDuration: `${duration}s` }
  return (
    <svg className="diya__svg" viewBox="-50 -66 100 100">
      <circle className="diya__halo" cx="0" cy="-34" r="42" fill="url(#flameHalo)" style={flicker} />

      {/* flame */}
      <g className="diya__flame" style={flicker}>
        <path d="M0 -8C10 -20 9 -36 0 -55C-9 -36 -10 -20 0 -8Z" fill="url(#flame)" />
        <path d="M0 -10C5 -18 4.5 -28 0 -38C-4.5 -28 -5 -18 0 -10Z" fill="#fff8dd" />
      </g>

      {/* bowl */}
      <path d="M-38 -6C-35 15 -17 27 0 27C17 27 35 15 38 -6Z" fill="url(#clay)" />
      <path d="M36 -11L49 -5L36 2Z" fill="url(#clay)" opacity="0.95" />
      <ellipse cx="0" cy="-6" rx="38" ry="9.5" fill="url(#clayRim)" />
      <ellipse cx="0" cy="-6" rx="30" ry="6.6" fill="url(#oil)" />
      <ellipse
        cx="0"
        cy="-6"
        rx="38"
        ry="9.5"
        fill="none"
        stroke="#ffd9a1"
        strokeWidth="1.1"
        opacity="0.5"
      />
      <rect x="-2.2" y="-16" width="4.4" height="11" rx="2.2" fill="#3a2016" />
    </svg>
  )
}
