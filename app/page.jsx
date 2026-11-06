"use client";

import { useEffect, useState } from "react";

import FestivePetals from "@/components/FestivePetals.jsx";
import ScrollReveal from "@/components/ScrollReveal.jsx";
import Embers from "@/components/Embers.jsx";
import FireworkLoader from "@/components/FireworkLoader.jsx";
import StringLights from "@/components/StringLights.jsx";
import SvgDefs from "@/components/SvgDefs.jsx";
import WishForm from "@/components/WishForm.jsx";

/* =========================================
   CENTRE-ORIGIN TYPEWRITER
   New characters are rendered as they are typed,
   allowing the text block to remain centre-aligned.
========================================= */

function TypewriterText({
  text,
  speed = 45,
  delay = 0,
  className = "",
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const characters = Array.from(text);

  useEffect(() => {
    const totalCharacters = Array.from(text).length;
    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (prefersReducedMotion) {
      setVisibleCount(totalCharacters);
      return undefined;
    }

    setVisibleCount(0);

    let currentIndex = 0;
    let intervalId;

    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        currentIndex += 1;
        setVisibleCount(currentIndex);

        if (currentIndex >= totalCharacters) {
          window.clearInterval(intervalId);
        }
      }, Math.max(12, speed));
    }, Math.max(0, delay));

    return () => {
      window.clearTimeout(delayId);

      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, delay]);

  return (
    <span className={`typewriter-text ${className}`.trim()} aria-label={text}>
      <span aria-hidden="true">
        {characters.slice(0, visibleCount).map((character, index) =>
          character === "\n" ? (
            <br key={`break-${index}`} />
          ) : (
            <span className="typewriter-char" key={`${index}-${character}`}>
              {character === " " ? "\u00A0" : character}
            </span>
          )
        )}
      </span>

      {visibleCount < characters.length && (
        <span className="typewriter-cursor" aria-hidden="true" />
      )}
    </span>
  );
}

/* =========================================
   HOME PAGE
========================================= */

export default function Home() {
  return (
    <div className="page">
      <SvgDefs />

      {/* Festive background */}
      <div className="night" aria-hidden="true" />

      {/* Festive animations: one string-light layer avoids visual duplication */}
      <FireworkLoader />
      <StringLights />
      <Embers />
      <FestivePetals />
      <ScrollReveal />

      <main className="shell">
        {/* ================= CONTEST HERO ================= */}
        <header className="hero">
          <div className="hero__logo-wrap">
            <img
              className="contest-logo"
              src="/image.png"
              alt="Snowcem Dream Wish Contest"
              width="720"
              height="477"
              fetchPriority="high"
            />
          </div>

          <div className="hero__eyebrow" aria-label="The Snowcem Dream Wish Contest">
            <span aria-hidden="true">✦</span>
            <span>THE SNOWCEM DREAM WISH CONTEST</span>
            <span aria-hidden="true">✦</span>
          </div>

          <h1 className="title">
            <span className="title__main">
              <TypewriterText text="Share Your" speed={85} delay={300} />
            </span>

            <span className="title__accent">
              <TypewriterText text="Dream Wish." speed={105} delay={1450} />
            </span>
          </h1>

          <p className="hero__tagline">
            <TypewriterText
              text="LET YOUR DREAMS SHINE THIS FESTIVE SEASON"
              speed={38}
              delay={2800}
            />
          </p>

          {/* Three deliberate lines; line breaks are preserved by TypewriterText. */}
          <p className="lede">
            <TypewriterText
              text={
                "Every dream begins with a wish.\nShare yours with a festive photo.\nLet your story shine with Snowcem."
              }
              speed={24}
              delay={4100}
            />
          </p>

          <div className="hero__steps" aria-label="Contest participation steps">
            <span>Share your wish</span>
            <span className="hero__separator" aria-hidden="true">✦</span>
            <span>Add your photo</span>
            <span className="hero__separator" aria-hidden="true">✦</span>
            <span>Submit your entry</span>
          </div>

          <p className="hero__footnote">
            YOUR DREAM <span aria-hidden="true">·</span> YOUR MOMENT <span aria-hidden="true">·</span> YOUR CELEBRATION
          </p>
        </header>

        {/* ================= CONTEST FORM ================= */}
        <WishForm />

        {/* ================= FOOTER ================= */}
        <footer className="foot">
          <span className="foot__copy">In collaboration with</span>

          <a
            className="foot__partner"
            href="https://snowcempaints.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="foot__favicon"
              src="https://www.google.com/s2/favicons?domain=snowcempaints.com&sz=64"
              alt=""
              width="20"
              height="20"
              loading="lazy"
            />
            <span>Snowcem</span>
          </a>

          <span className="foot__and" aria-hidden="true">&amp;</span>

          <a
            className="foot__partner"
            href="https://virtumedia.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="foot__favicon"
              src="https://www.google.com/s2/favicons?domain=virtumedia.in&sz=64"
              alt=""
              width="20"
              height="20"
              loading="lazy"
            />
            <span>VirtuMedia</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
