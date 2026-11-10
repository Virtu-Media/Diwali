
"use client";

import { useEffect, useState } from "react";

/* =========================================
   CREATE TWO SNOWFLAKES TOGETHER
========================================= */

function createSnowflakePair(pairId) {
  const center = 18 + Math.random() * 64;
  const gap = 14 + Math.random() * 10;

  // Two different horizontal positions
  const leftPositions = [
    Math.max(5, center - gap / 2),
    Math.min(94, center + gap / 2),
  ];

  // Same animation duration for synchronized falling
  const sharedDuration = `${(
    7.3 + Math.random() * 0.45
  ).toFixed(2)}s`;

  return leftPositions.map((left, index) => ({
    id: `${pairId}-${index}`,
    left: `${left}%`,
    size: `${40 + Math.random() * 18}px`,
    duration: sharedDuration,
    drift: `${Math.round(Math.random() * 140 - 70)}px`,
    rotation: `${Math.round(300 + Math.random() * 420)}deg`,
  }));
}

/* =========================================
   SNOWFLAKE COMPONENT
========================================= */

export default function SnowflakeFall() {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    let pairId = 0;

    // First pair: two snowflakes together
    setFlakes(createSnowflakePair(pairId));

    // Next pair appears after 8.5 seconds
    const interval = window.setInterval(() => {
      pairId += 1;
      setFlakes(createSnowflakePair(pairId));
    }, 8500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  if (flakes.length === 0) {
    return null;
  }

  return (
    <div
      className="christmas-icon-snow"
      aria-hidden="true"
    >
      {flakes.map((flake) => (
        <svg
          key={flake.id}
          className="christmas-icon-snow__flake"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            "--flake-duration": flake.duration,
            "--flake-drift": flake.drift,
            "--flake-rotation": flake.rotation,
          }}
        >
          {/* Six-branch decorative snowflake */}
          <g
            transform="translate(50 50)"
            stroke="currentColor"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {[0, 60, 120, 180, 240, 300].map(
              (angle) => (
                <g
                  key={angle}
                  transform={`rotate(${angle})`}
                >
                  {/* Main branch */}
                  <path d="M0 0 V-39" />

                  {/* Left branch */}
                  <path d="M0 -23 L-10 -33" />

                  {/* Right branch */}
                  <path d="M0 -23 L10 -33" />
                </g>
              )
            )}
          </g>

          {/* Center of snowflake */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}
