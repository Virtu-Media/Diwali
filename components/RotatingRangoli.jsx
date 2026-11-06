const outerPetals = Array.from({ length: 16 }, (_, i) => i * 22.5);
const middlePetals = Array.from({ length: 12 }, (_, i) => i * 30);
const innerPetals = Array.from({ length: 8 }, (_, i) => i * 45);

const outerDots = Array.from({ length: 32 }, (_, i) => i * 11.25);

export default function RotatingRangoli() {
  return (
    <div className="rangoli-ornament" aria-hidden="true">
      <svg
        className="rangoli-ornament__svg"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="rangoli-gold"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFF0BF" />
            <stop offset="45%" stopColor="#F6C877" />
            <stop offset="100%" stopColor="#D98737" />
          </linearGradient>

          <linearGradient
            id="rangoli-orange"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFD99A" />
            <stop offset="55%" stopColor="#E88B45" />
            <stop offset="100%" stopColor="#A84436" />
          </linearGradient>

          <linearGradient
            id="rangoli-pink"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFE1CF" />
            <stop offset="55%" stopColor="#D9859B" />
            <stop offset="100%" stopColor="#87518F" />
          </linearGradient>

          <radialGradient id="rangoli-center">
            <stop offset="0%" stopColor="#FFF9DE" />
            <stop offset="35%" stopColor="#FFCE79" />
            <stop offset="75%" stopColor="#EA9148" />
            <stop offset="100%" stopColor="#9A493D" />
          </radialGradient>

          <filter
            id="rangoli-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="3"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Decorative outer circles */}
        <g className="rangoli-ornament__rings">
          <circle
            cx="250"
            cy="250"
            r="239"
            fill="none"
            stroke="#F6C877"
            strokeWidth="1"
            opacity="0.55"
          />

          <circle
            cx="250"
            cy="250"
            r="226"
            fill="none"
            stroke="#FFDFA7"
            strokeWidth="1.5"
            strokeDasharray="2 9"
          />

          <circle
            cx="250"
            cy="250"
            r="190"
            fill="none"
            stroke="#F6C877"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.75"
          />

          <circle
            cx="250"
            cy="250"
            r="150"
            fill="none"
            stroke="#F6C877"
            strokeWidth="1"
            opacity="0.55"
          />

          <circle
            cx="250"
            cy="250"
            r="112"
            fill="none"
            stroke="#FFE4B4"
            strokeWidth="1"
            strokeDasharray="3 7"
          />
        </g>

        {/* Rotating outer lotus petals */}
        <g
          className="rangoli-ornament__outer"
          filter="url(#rangoli-glow)"
        >
          {outerPetals.map((angle) => (
            <g
              key={angle}
              transform={`rotate(${angle} 250 250)`}
            >
              <path
                d="
                  M250 20
                  C278 48 286 82 250 119
                  C214 82 222 48 250 20Z
                "
                fill="url(#rangoli-gold)"
                fillOpacity="0.72"
                stroke="#FFE4AC"
                strokeWidth="1.5"
              />

              <path
                d="
                  M250 36
                  C265 58 270 78 250 100
                  C230 78 235 58 250 36Z
                "
                fill="url(#rangoli-orange)"
                fillOpacity="0.6"
                stroke="#FFF0CA"
                strokeWidth="0.8"
              />

              <path
                d="M250 45 L250 105"
                stroke="#FFF1CA"
                strokeWidth="1"
                opacity="0.65"
              />

              <circle
                cx="250"
                cy="16"
                r="3.2"
                fill="#FFF1CA"
              />
            </g>
          ))}
        </g>

        {/* Tiny golden outer beads */}
        <g className="rangoli-ornament__outer-beads">
          {outerDots.map((angle) => (
            <circle
              key={angle}
              cx="250"
              cy="211"
              r="3"
              fill="#FFD98C"
              transform={`rotate(${angle} 250 250)`}
            />
          ))}
        </g>

        {/* Rotating middle floral layer */}
        <g
          className="rangoli-ornament__middle"
          filter="url(#rangoli-glow)"
        >
          {middlePetals.map((angle) => (
            <g
              key={angle}
              transform={`rotate(${angle} 250 250)`}
            >
              <path
                d="
                  M250 104
                  C274 127 277 151 250 179
                  C223 151 226 127 250 104Z
                "
                fill="url(#rangoli-pink)"
                fillOpacity="0.65"
                stroke="#FFE1BB"
                strokeWidth="1.4"
              />

              <path
                d="
                  M250 119
                  C261 135 264 150 250 164
                  C236 150 239 135 250 119Z
                "
                fill="url(#rangoli-gold)"
                fillOpacity="0.75"
              />

              <circle
                cx="250"
                cy="110"
                r="3.5"
                fill="#FFF3CE"
              />
            </g>
          ))}
        </g>

        {/* Decorative middle beads */}
        <g className="rangoli-ornament__beads">
          {Array.from({ length: 24 }, (_, i) => (
            <circle
              key={i}
              cx="250"
              cy="135"
              r="2.5"
              fill="#FFF0BC"
              transform={`rotate(${i * 15} 250 250)`}
            />
          ))}
        </g>

        {/* Rotating inner lotus */}
        <g
          className="rangoli-ornament__inner"
          filter="url(#rangoli-glow)"
        >
          {innerPetals.map((angle) => (
            <g
              key={angle}
              transform={`rotate(${angle} 250 250)`}
            >
              <path
                d="
                  M250 164
                  C270 181 273 206 250 226
                  C227 206 230 181 250 164Z
                "
                fill="url(#rangoli-orange)"
                fillOpacity="0.85"
                stroke="#FFF0BF"
                strokeWidth="1.5"
              />

              <path
                d="
                  M250 175
                  C261 190 262 204 250 215
                  C238 204 239 190 250 175Z
                "
                fill="url(#rangoli-gold)"
                stroke="#FFF3CF"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </g>

        {/* Centre flower */}
        <g className="rangoli-ornament__center">
          <circle
            cx="250"
            cy="250"
            r="48"
            fill="none"
            stroke="#FFD98F"
            strokeWidth="1.5"
          />

          <circle
            cx="250"
            cy="250"
            r="38"
            fill="url(#rangoli-center)"
            stroke="#FFF0BF"
            strokeWidth="1.5"
          />

          <path
            d="
              M250 214
              C262 232 275 242 289 250
              C275 258 262 268 250 286
              C238 268 225 258 211 250
              C225 242 238 232 250 214Z
            "
            fill="#FFF0C4"
            fillOpacity="0.9"
            stroke="#D78646"
            strokeWidth="1.5"
          />

          <circle
            cx="250"
            cy="250"
            r="13"
            fill="#A94C37"
            stroke="#FFF0BF"
            strokeWidth="2"
          />

          <circle
            cx="250"
            cy="250"
            r="5"
            fill="#FFF8DC"
          />
        </g>
      </svg>
    </div>
  );
}