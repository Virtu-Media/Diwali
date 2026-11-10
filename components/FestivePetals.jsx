
/* =========================================================
   PREMIUM CHRISTMAS FESTIVE DECORATIONS
   File: FestivePetals.jsx
========================================================= */

/* ==========================================
   FALLING CHRISTMAS DECORATIONS
========================================== */

const CHRISTMAS_DECORATIONS = [
  { id: 1, type: "snowflake", left: "5%", delay: "-4s", duration: "23s", drift: "52px", size: 23, color: "#EAF7FF", opacity: 0.62 },
  { id: 2, type: "star", left: "13%", delay: "-12s", duration: "27s", drift: "-38px", size: 13, color: "#E9CC91", opacity: 0.66 },
  { id: 3, type: "snowflake", left: "21%", delay: "-8s", duration: "25s", drift: "-48px", size: 18, color: "#FFFFFF", opacity: 0.55 },
  { id: 4, type: "sparkle", left: "30%", delay: "-16s", duration: "22s", drift: "42px", size: 11, color: "#F5DDAA", opacity: 0.72 },
  { id: 5, type: "snowflake", left: "39%", delay: "-6s", duration: "26s", drift: "55px", size: 25, color: "#EAF7FF", opacity: 0.6 },
  { id: 6, type: "star", left: "48%", delay: "-18s", duration: "28s", drift: "-45px", size: 14, color: "#E9CC91", opacity: 0.7 },
  { id: 7, type: "snowflake", left: "57%", delay: "-10s", duration: "24s", drift: "-52px", size: 20, color: "#FFFFFF", opacity: 0.58 },
  { id: 8, type: "sparkle", left: "66%", delay: "-14s", duration: "23s", drift: "46px", size: 12, color: "#F5DDAA", opacity: 0.7 },
  { id: 9, type: "snowflake", left: "75%", delay: "-5s", duration: "27s", drift: "48px", size: 24, color: "#EAF7FF", opacity: 0.58 },
  { id: 10, type: "star", left: "84%", delay: "-19s", duration: "25s", drift: "-42px", size: 15, color: "#E9CC91", opacity: 0.64 },
  { id: 11, type: "snowflake", left: "93%", delay: "-9s", duration: "26s", drift: "-55px", size: 19, color: "#FFFFFF", opacity: 0.56 },
  { id: 12, type: "sparkle", left: "98%", delay: "-15s", duration: "24s", drift: "35px", size: 10, color: "#F5DDAA", opacity: 0.66 },
];

/* ==========================================
   PREMIUM NATURAL GARLAND CURVE
========================================== */

const getJhalarY = (x) => {
  const normalizedX = Math.max(0, Math.min(1440, x));

  return 24 + 38 * Math.sin(
    (Math.PI * normalizedX) / 1440
  );
};

const getJhalarAngle = (x) => {
  const normalizedX = Math.max(0, Math.min(1440, x));

  const slope =
    (38 * Math.PI / 1440) *
    Math.cos((Math.PI * normalizedX) / 1440);

  return (Math.atan(slope) * 180) / Math.PI;
};

/* ==========================================
   SMOOTH GOLDEN WIRE PATH
========================================== */

const JHALAR_POINTS = Array.from({ length: 97 }, (_, index) => {
  const x = -30 + index * (1500 / 96);

  return {
    x,
    y: getJhalarY(x),
  };
});

const JHALAR_WIRE_PATH = JHALAR_POINTS.map((point, index) => {
  return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
}).join(" ");

const JHALAR_SECONDARY_PATH = JHALAR_POINTS.map((point, index) => {
  return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${(point.y + 3.5).toFixed(2)}`;
}).join(" ");

/* ==========================================
   LAYERED EVERGREEN PINE SPRIGS
========================================== */

const JHALAR_SPRIGS = Array.from({ length: 35 }, (_, index) => {
  const x = -18 + index * 43;

  return {
    id: index,
    x,
    y: getJhalarY(x),
    angle: getJhalarAngle(x),
  };
});

/* ==========================================
   WARM GOLDEN FAIRY LIGHTS
========================================== */

const LIGHT_COLORS = [
  "#FFE7AF",
  "#FFF8E9",
  "#E8C58A",
  "#F6D99E",
];

const JHALAR_LIGHTS = Array.from({ length: 24 }, (_, index) => {
  const x = 25 + index * 60;

  return {
    id: index,
    x,
    y: getJhalarY(x),
    color: LIGHT_COLORS[index % LIGHT_COLORS.length],
    delay: `${-((index % 8) * 0.42)}s`,
  };
});

/* ==========================================
   PREMIUM GLASS CHRISTMAS ORNAMENTS
========================================== */

const JHALAR_ORNAMENTS = [
  { id: 1, x: 145, finish: "ruby", size: 12, drop: 39 },
  { id: 2, x: 380, finish: "champagne", size: 11, drop: 49 },
  { id: 3, x: 625, finish: "forest", size: 13, drop: 38 },
  { id: 4, x: 850, finish: "ruby", size: 12, drop: 47 },
  { id: 5, x: 1090, finish: "champagne", size: 11, drop: 39 },
  { id: 6, x: 1305, finish: "forest", size: 13, drop: 45 },
];

/* ==========================================
   HANGING GOLDEN STAR CHARMS
========================================== */

const JHALAR_STARS = [280, 720, 1160].map((x, index) => ({
  id: index,
  x,
  y: getJhalarY(x),
}));

/* ==========================================
   CHRISTMAS SVG ICONS
========================================== */

function ChristmasIcon({ type }) {
  if (type === "snowflake") {
    return (
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <g
          transform="translate(50 50)"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d="M0 0 V-39" />
              <path d="M0 -23 L-10 -33" />
              <path d="M0 -23 L10 -33" />
            </g>
          ))}
        </g>

        <circle cx="50" cy="50" r="4" fill="currentColor" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 50 50" fill="none" aria-hidden="true">
        <path
          d="M25 2 L30.5 19.5 L48 25 L30.5 30.5 L25 48 L19.5 30.5 L2 25 L19.5 19.5 Z"
          fill="currentColor"
        />

        <circle
          cx="25"
          cy="25"
          r="3"
          fill="#FFFFFF"
          opacity=".75"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 1 L23 16 L39 20 L23 23 L20 39 L17 23 L1 20 L17 16 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ==========================================
   MAIN PREMIUM FESTIVE COMPONENT
========================================== */

export default function FestivePetals() {
  return (
    <>
      {/* =====================================
          COMPLETE DECORATIVE BACKGROUND
          Everything remains behind content.
      ====================================== */}

      <div className="premium-festive-layer" aria-hidden="true">

        {/* =================================
            PREMIUM CURVED CHRISTMAS JHALAR
        ================================== */}

        <div className="premium-christmas-jhalar">
          <svg
            className="premium-christmas-jhalar__svg"
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Premium gold wire */}

              <linearGradient
                id="premium-jhalar-wire"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8F7042" />
                <stop offset="24%" stopColor="#EBD29E" />
                <stop offset="52%" stopColor="#FFF0C8" />
                <stop offset="78%" stopColor="#D6B574" />
                <stop offset="100%" stopColor="#886940" />
              </linearGradient>

              {/* Metallic gold ornament cap */}

              <linearGradient
                id="premium-jhalar-cap"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF1C8" />
                <stop offset="48%" stopColor="#D5B16E" />
                <stop offset="100%" stopColor="#8C693B" />
              </linearGradient>

              {/* Ruby red ornament */}

              <radialGradient
                id="premium-jhalar-ruby"
                cx="30%"
                cy="24%"
                r="78%"
              >
                <stop offset="0%" stopColor="#F7C9B5" />
                <stop offset="35%" stopColor="#B95B58" />
                <stop offset="75%" stopColor="#8A3439" />
                <stop offset="100%" stopColor="#4D202B" />
              </radialGradient>

              {/* Champagne gold ornament */}

              <radialGradient
                id="premium-jhalar-champagne"
                cx="28%"
                cy="22%"
                r="78%"
              >
                <stop offset="0%" stopColor="#FFF9DD" />
                <stop offset="40%" stopColor="#E9D09A" />
                <stop offset="78%" stopColor="#B68B4F" />
                <stop offset="100%" stopColor="#72512E" />
              </radialGradient>

              {/* Forest green ornament */}

              <radialGradient
                id="premium-jhalar-forest"
                cx="28%"
                cy="22%"
                r="78%"
              >
                <stop offset="0%" stopColor="#B5D3A2" />
                <stop offset="36%" stopColor="#507D55" />
                <stop offset="76%" stopColor="#254D39" />
                <stop offset="100%" stopColor="#142B25" />
              </radialGradient>
            </defs>

            {/* =================================
                MAIN GOLDEN WIRE
            ================================== */}

            <path
              className="premium-jhalar__wire-shadow"
              d={JHALAR_WIRE_PATH}
              stroke="#111B14"
              strokeWidth="5"
              strokeLinecap="round"
              opacity=".24"
            />

            <path
              className="premium-jhalar__wire"
              d={JHALAR_WIRE_PATH}
              stroke="url(#premium-jhalar-wire)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <path
              className="premium-jhalar__wire-detail"
              d={JHALAR_SECONDARY_PATH}
              stroke="#FFF0C7"
              strokeWidth=".8"
              strokeLinecap="round"
              strokeDasharray="1 5"
              opacity=".48"
            />

            {/* =================================
                LAYERED EVERGREEN PINE FOLIAGE
            ================================== */}

            {JHALAR_SPRIGS.map((sprig) => (
              <g
                key={sprig.id}
                className="premium-jhalar__sprig"
                transform={`translate(${sprig.x} ${sprig.y}) rotate(${sprig.angle})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Natural pine base */}

                <path
                  d="M-25 3 Q0 0 25 -3"
                  stroke="#183F2E"
                  strokeWidth="4.2"
                />

                {/* Upper evergreen needles */}

                <path
                  d="
                    M-22 2 L-32 -11
                    M-15 1 L-25 -13
                    M-7 0 L-15 -15
                    M1 -1 L-2 -17
                    M9 -2 L14 -16
                    M17 -3 L25 -15
                    M23 -3 L34 -12
                  "
                  stroke="#285B3B"
                  strokeWidth="3.3"
                />

                {/* Lower evergreen needles */}

                <path
                  d="
                    M-23 2 L-33 13
                    M-14 1 L-24 15
                    M-5 0 L-12 16
                    M5 -1 L5 14
                    M14 -2 L21 12
                    M21 -3 L32 8
                    M25 -3 L37 2
                  "
                  stroke="#1E4A34"
                  strokeWidth="3"
                />

                {/* Fresh green highlights */}

                <path
                  d="
                    M-22 2 L-30 -8
                    M-7 0 L-12 -11
                    M9 -2 L15 -12
                    M22 -3 L30 -10
                  "
                  stroke="#75A46C"
                  strokeWidth="1.5"
                  opacity=".8"
                />

                {/* Natural needle tips */}

                <path
                  d="
                    M-24 4 L-30 11
                    M-8 2 L-12 11
                    M9 -1 L13 8
                    M23 -4 L31 4
                  "
                  stroke="#A1B985"
                  strokeWidth="1.1"
                  opacity=".48"
                />
              </g>
            ))}

            {/* =================================
                WARM CHAMPAGNE FAIRY LIGHTS
            ================================== */}

            {JHALAR_LIGHTS.map((light) => (
              <g
                key={light.id}
                className="premium-jhalar__bulb"
                style={{
                  "--bulb-color": light.color,
                  animationDelay: light.delay,
                }}
              >
                {/* Light socket */}

                <rect
                  x={light.x - 2.4}
                  y={light.y + 1}
                  width="4.8"
                  height="5.5"
                  rx="1.1"
                  fill="#856A43"
                />

                {/* Small connecting wire */}

                <line
                  x1={light.x}
                  y1={light.y + 6}
                  x2={light.x}
                  y2={light.y + 11}
                  stroke="#B89B65"
                  strokeWidth="1.1"
                />

                {/* Ambient glow */}

                <circle
                  className="premium-jhalar__bulb-glow"
                  cx={light.x}
                  cy={light.y + 15}
                  r="13"
                />

                {/* Outer bulb */}

                <circle
                  className="premium-jhalar__bulb-halo"
                  cx={light.x}
                  cy={light.y + 15}
                  r="5.8"
                />

                {/* Light centre */}

                <circle
                  className="premium-jhalar__bulb-core"
                  cx={light.x}
                  cy={light.y + 15}
                  r="3.2"
                />
              </g>
            ))}

            {/* =================================
                HANGING GOLDEN STAR CHARMS
            ================================== */}

            {JHALAR_STARS.map((star) => (
              <g key={star.id}>
                {/* Golden hanging thread */}

                <line
                  x1={star.x}
                  y1={star.y + 5}
                  x2={star.x}
                  y2={star.y + 38}
                  stroke="#C9A66C"
                  strokeWidth="1.2"
                />

                <circle
                  cx={star.x}
                  cy={star.y + 38}
                  r="2"
                  fill="#EBD5A5"
                />

                {/* Animated star position is kept separate */}

                <g
                  transform={`translate(${star.x} ${star.y + 49})`}
                >
                  <g className="premium-jhalar__star-pendant">
                    <path
                      d="M0 -9 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z"
                      fill="#E9CC91"
                      stroke="#FFF0CE"
                      strokeWidth="1"
                    />

                    <circle
                      cx="-2"
                      cy="-3"
                      r="1.6"
                      fill="#FFFFFF"
                      opacity=".8"
                    />
                  </g>
                </g>
              </g>
            ))}

            {/* =================================
                PREMIUM GLASS BAUBLES
            ================================== */}

            {JHALAR_ORNAMENTS.map((ornament) => {
              const y = getJhalarY(ornament.x);
              const centerY = y + ornament.drop;

              const ornamentFill = {
                ruby: "url(#premium-jhalar-ruby)",
                champagne: "url(#premium-jhalar-champagne)",
                forest: "url(#premium-jhalar-forest)",
              }[ornament.finish];

              return (
                <g
                  key={ornament.id}
                  className="premium-jhalar__ornament"
                  style={{
                    animationDelay: `${ornament.id * -0.55}s`,
                  }}
                >
                  {/* Hanging string */}

                  <path
                    d={`M${ornament.x} ${y + 5} V${centerY - ornament.size - 5}`}
                    stroke="#D7BE8D"
                    strokeWidth="1.2"
                  />

                  {/* Metallic ornament cap */}

                  <rect
                    x={ornament.x - 5}
                    y={centerY - ornament.size - 7}
                    width="10"
                    height="8"
                    rx="2"
                    fill="url(#premium-jhalar-cap)"
                    stroke="#EFD8A6"
                    strokeWidth=".6"
                  />

                  {/* Main glass ornament */}

                  <circle
                    cx={ornament.x}
                    cy={centerY}
                    r={ornament.size}
                    fill={ornamentFill}
                    stroke="#E8CF9A"
                    strokeWidth="1.2"
                  />

                  {/* Main glass reflection */}

                  <path
                    d={`M${ornament.x - ornament.size * 0.58} ${centerY - ornament.size * 0.35} Q${ornament.x - ornament.size * 0.15} ${centerY - ornament.size * 0.92} ${ornament.x + ornament.size * 0.1} ${centerY - ornament.size * 0.58}`}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity=".72"
                  />

                  {/* Reflection highlight */}

                  <circle
                    cx={ornament.x + ornament.size * 0.35}
                    cy={centerY + ornament.size * 0.35}
                    r="2"
                    fill="#FFF5DB"
                    opacity=".58"
                  />

                  {/* Lower glass reflection */}

                  <path
                    d={`M${ornament.x - ornament.size * 0.35} ${centerY + ornament.size * 0.55} Q${ornament.x} ${centerY + ornament.size * 0.9} ${ornament.x + ornament.size * 0.35} ${centerY + ornament.size * 0.55}`}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    opacity=".35"
                  />
                </g>
              );
            })}

            {/* =================================
                GOLDEN GARLAND END DETAILS
            ================================== */}

            {[42, 1395].map((x) => {
              const y = getJhalarY(x);

              return (
                <g key={x}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#B58E55"
                    stroke="#F0DCA9"
                    strokeWidth="1"
                  />

                  <circle
                    cx={x - 1.3}
                    cy={y - 1.5}
                    r="1.5"
                    fill="#FFFFFF"
                    opacity=".8"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* =====================================
            FALLING CHRISTMAS DECORATIONS
        ====================================== */}

        <div className="premium-christmas-falling">
          {CHRISTMAS_DECORATIONS.map((item) => (
            <span
              key={item.id}
              className={`premium-falling-item premium-falling-item--${item.type}`}
              style={{
                left: item.left,
                width: `${item.size}px`,
                height: `${item.size}px`,
                color: item.color,

                "--fall-delay": item.delay,
                "--fall-duration": item.duration,
                "--fall-drift": item.drift,
                "--fall-opacity": item.opacity,
                "--fall-rotation": `${360 + item.id * 37}deg`,
              }}
            >
              <ChristmasIcon type={item.type} />
            </span>
          ))}
        </div>
      </div>

      {/* =====================================
          COMPLETE PREMIUM STYLING
      ====================================== */}

      <style>{`

        /* =================================================
           GLOBAL WEBSITE CONTENT LAYER

           Keep your complete website inside .site-content.
           This layer must stay above the festive background.
        ================================================= */

        .site-content {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        /* =================================================
           FESTIVE BACKGROUND LAYER
        ================================================= */

        .premium-festive-layer {
          position: fixed;
          inset: 0;

          width: 100%;
          height: 100%;

          z-index: 0;

          pointer-events: none;
          isolation: isolate;
          overflow: hidden;
        }

        /* =================================================
           PREMIUM CURVED JHALAR
        ================================================= */

        .premium-christmas-jhalar {
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: clamp(125px, 13vw, 175px);

          z-index: 2;

          pointer-events: none;
          overflow: visible;
          isolation: isolate;
        }

        /* Soft golden atmosphere */

        .premium-christmas-jhalar::before {
          content: "";

          position: absolute;
          top: -20px;
          left: 0;

          width: 100%;
          height: 150px;

          z-index: 0;
          pointer-events: none;

          background:
            radial-gradient(
              ellipse at 50% 0%,
              rgba(228, 187, 116, 0.14),
              transparent 72%
            ),
            linear-gradient(
              180deg,
              rgba(10, 19, 22, 0.10),
              transparent 90%
            );

          filter: blur(12px);
        }

        .premium-christmas-jhalar__svg {
          position: relative;
          z-index: 1;

          display: block;

          width: 100%;
          height: 100%;

          overflow: visible;
        }

        /* =================================================
           GOLDEN WIRE
        ================================================= */

        .premium-jhalar__wire-shadow {
          filter: blur(3px);
        }

        .premium-jhalar__wire {
          filter:
            drop-shadow(
              0 1px 3px rgba(224, 184, 113, 0.36)
            )
            drop-shadow(
              0 3px 5px rgba(0, 0, 0, 0.18)
            );
        }

        .premium-jhalar__wire-detail {
          filter:
            drop-shadow(
              0 0 2px rgba(255, 231, 183, 0.3)
            );
        }

        /* =================================================
           EVERGREEN PINE FOLIAGE
        ================================================= */

        .premium-jhalar__sprig {
          opacity: 0.98;

          filter:
            drop-shadow(
              0 2px 2px rgba(0, 0, 0, 0.28)
            )
            drop-shadow(
              0 0 3px rgba(87, 137, 85, 0.13)
            );
        }

        /* =================================================
           CHAMPAGNE FAIRY LIGHTS
        ================================================= */

        .premium-jhalar__bulb {
          opacity: 0.9;

          transform-box: fill-box;
          transform-origin: center;

          animation:
            premium-jhalar-light-pulse
            3.2s
            ease-in-out
            infinite
            alternate;
        }

        .premium-jhalar__bulb-glow {
          fill: var(--bulb-color, #FFE7AF);
          opacity: 0.3;

          filter: blur(7px);
        }

        .premium-jhalar__bulb-halo {
          fill: var(--bulb-color, #FFE7AF);
          opacity: 0.3;
        }

        .premium-jhalar__bulb-core {
          fill: var(--bulb-color, #FFE7AF);

          filter:
            drop-shadow(
              0 0 3px var(--bulb-color)
            )
            drop-shadow(
              0 0 7px var(--bulb-color)
            )
            drop-shadow(
              0 0 12px rgba(255, 221, 151, 0.35)
            );
        }

        @keyframes premium-jhalar-light-pulse {
          0% {
            opacity: 0.58;
          }

          50% {
            opacity: 0.92;
          }

          100% {
            opacity: 1;
          }
        }

        /* =================================================
           GLASS ORNAMENTS
        ================================================= */

        .premium-jhalar__ornament {
          opacity: 0.94;

          transform-box: fill-box;
          transform-origin: center;

          animation:
            premium-jhalar-ornament-shine
            4.8s
            ease-in-out
            infinite
            alternate;
        }

        @keyframes premium-jhalar-ornament-shine {
          0% {
            opacity: 0.78;
          }

          100% {
            opacity: 1;
          }
        }

        /* =================================================
           HANGING GOLDEN STARS
        ================================================= */

        .premium-jhalar__star-pendant {
          transform-box: fill-box;
          transform-origin: center;

          filter:
            drop-shadow(
              0 0 5px rgba(233, 204, 145, 0.5)
            );

          animation:
            premium-jhalar-star-twinkle
            3.6s
            ease-in-out
            infinite
            alternate;
        }

        @keyframes premium-jhalar-star-twinkle {
          0% {
            opacity: 0.64;
            transform: scale(0.92);
          }

          100% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        /* =================================================
           FALLING DECORATION LAYER
        ================================================= */

        .premium-christmas-falling {
          position: absolute;
          inset: 0;

          z-index: 1;

          width: 100%;
          height: 100%;

          overflow: hidden;
          pointer-events: none;
        }

        .premium-falling-item {
          position: absolute;
          top: -10vh;

          display: block;

          opacity: 0;

          animation:
            premium-decoration-fall
            var(--fall-duration)
            linear
            var(--fall-delay)
            infinite;

          will-change: transform, opacity;
        }

        .premium-falling-item svg {
          display: block;

          width: 100%;
          height: 100%;

          overflow: visible;
        }

        .premium-falling-item--snowflake {
          filter:
            drop-shadow(
              0 0 4px rgba(228, 245, 255, 0.45)
            )
            drop-shadow(
              0 0 9px rgba(162, 213, 242, 0.17)
            );
        }

        .premium-falling-item--star {
          filter:
            drop-shadow(
              0 0 5px rgba(246, 211, 143, 0.52)
            )
            drop-shadow(
              0 0 10px rgba(225, 181, 102, 0.22)
            );
        }

        .premium-falling-item--sparkle {
          filter:
            drop-shadow(
              0 0 5px rgba(246, 226, 172, 0.62)
            );
        }

        @keyframes premium-decoration-fall {
          0% {
            transform:
              translate3d(0, -8vh, 0)
              rotate(0deg)
              scale(0.8);

            opacity: 0;
          }

          12% {
            opacity: var(--fall-opacity);
          }

          50% {
            transform:
              translate3d(
                var(--fall-drift),
                50vh,
                0
              )
              rotate(180deg)
              scale(1);

            opacity: var(--fall-opacity);
          }

          88% {
            opacity: var(--fall-opacity);
          }

          100% {
            transform:
              translate3d(
                var(--fall-drift),
                112vh,
                0
              )
              rotate(var(--fall-rotation))
              scale(0.88);

            opacity: 0;
          }
        }

        /* =================================================
           TABLET RESPONSIVENESS
        ================================================= */

        @media (max-width: 900px) {
          .premium-christmas-jhalar {
            height: 135px;
          }

          .premium-jhalar__sprig {
            opacity: 0.94;
          }

          .premium-jhalar__bulb-glow {
            opacity: 0.25;
          }
        }

        /* =================================================
           MOBILE RESPONSIVENESS
        ================================================= */

        @media (max-width: 600px) {
          .premium-christmas-jhalar {
            height: 112px;
          }

          .premium-christmas-jhalar::before {
            height: 110px;
          }

          .premium-jhalar__sprig {
            opacity: 0.91;
          }

          .premium-jhalar__wire {
            stroke-width: 2.8;
          }

          .premium-jhalar__bulb-glow {
            opacity: 0.22;
            filter: blur(5px);
          }

          .premium-jhalar__ornament {
            opacity: 0.9;
          }

          .premium-falling-item:nth-child(n + 9) {
            display: none;
          }

          .premium-falling-item--snowflake {
            filter:
              drop-shadow(
                0 0 3px rgba(228, 245, 255, 0.38)
              );
          }
        }

        /* =================================================
           EXTRA SMALL MOBILE
        ================================================= */

        @media (max-width: 380px) {
          .premium-christmas-jhalar {
            height: 100px;
          }

          .premium-jhalar__sprig {
            opacity: 0.86;
          }

          .premium-jhalar__star-pendant {
            opacity: 0.85;
          }
        }

        /* =================================================
           REDUCED MOTION ACCESSIBILITY
        ================================================= */

        @media (prefers-reduced-motion: reduce) {
          .premium-jhalar__bulb,
          .premium-jhalar__ornament,
          .premium-jhalar__star-pendant,
          .premium-falling-item {
            animation: none !important;
            transition: none !important;
          }

          .premium-falling-item {
            display: none !important;
          }
        }

      `}</style>
    </>
  );
}
