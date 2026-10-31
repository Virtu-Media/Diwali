export default function SvgDefs() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a4553a" />
          <stop offset="45%" stopColor="#7c3623" />
          <stop offset="100%" stopColor="#40190f" />
        </linearGradient>

        <linearGradient id="clayRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5d2718" />
          <stop offset="50%" stopColor="#c4744b" />
          <stop offset="100%" stopColor="#5d2718" />
        </linearGradient>

        <linearGradient id="oil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2b45c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#b8621f" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff8a2b" />
          <stop offset="40%" stopColor="#ffc153" />
          <stop offset="78%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        <radialGradient id="flameHalo">
          <stop offset="0%" stopColor="#ffcf7a" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#ff9a3c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ff8a2b" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
