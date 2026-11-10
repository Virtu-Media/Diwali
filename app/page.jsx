"use client";

import Snowfall from "react-snowfall";
import SnowflakeFall from "@/components/SnowflakeFall.jsx";
import FestivePetals from "@/components/FestivePetals.jsx";
import ScrollReveal from "@/components/ScrollReveal.jsx";
import WishForm from "@/components/WishForm.jsx";
import "./christmas.css";

export default function Home() {
  return (
    <div className="page page--christmas">

      {/* Christmas decorations and snowfall */}
   <Snowfall
  color="#F5F8F6"
  snowflakeCount={100}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: 1,
  }}
/>


<FestivePetals />
      {/* Scroll entrance animations */}
      <ScrollReveal />

      <main className="shell shell--christmas">

        {/* ================= HERO SECTION ================= */}

        <header className="hero hero--christmas">

         

          {/* Logo */}
          <div className="hero__logo-wrap">
            <span
              className="hero__logo-halo"
              aria-hidden="true"
            />

            <img
              className="contest-logo"
              src="/image.png"
              alt="The Snowcem Dream Wish Contest"
              width="720"
              height="480"
              fetchPriority="high"
            />
          </div>

          {/* Hero heading */}
          <p className="eyebrow">
            THE SEASON OF GIVING, JOY & NEW BEGINNINGS
          </p>

          <h1 className="title">
            Make a Wish.
            <span className="title__accent">
              Share the Magic.
            </span>
          </h1>

          <p className="hero__tagline">
            THIS CHRISTMAS, LET YOUR DREAMS GLOW.
          </p>

          {/* Hero description */}
          <p className="lede">
            Christmas is a season for heartfelt wishes,
            thoughtful moments and the joy of sharing.
            Tell us the dream closest to your heart and
            upload a photograph that captures your
            festive spirit. Join the Snowcem Dream Wish
            Contest and make your wish part of something
            magical.
          </p>

          {/* CTA */}
          <a
            className="hero__cta"
            href="#wish-form"
          >
            <span>Share your Christmas wish</span>

            <span
              className="hero__cta-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

          {/* Contest steps */}
          <div
            className="hero__steps"
            aria-label="Contest participation steps"
          >
            <span className="hero__step">
              <span className="hero__step-number">
                01
              </span>
              Share your wish
            </span>

            <span
              className="hero__separator"
              aria-hidden="true"
            >
              ✦
            </span>

            <span className="hero__step">
              <span className="hero__step-number">
                02
              </span>
              Add your photo
            </span>

            <span
              className="hero__separator"
              aria-hidden="true"
            >
              ✦
            </span>

            <span className="hero__step">
              <span className="hero__step-number">
                03
              </span>
              Submit your entry
            </span>
          </div>

          <p className="hero__footnote">
            YOUR DREAM{" "}
            <span aria-hidden="true">·</span>{" "}
            YOUR MOMENT{" "}
            <span aria-hidden="true">·</span>{" "}
            YOUR CHRISTMAS
          </p>

        </header>

        {/* ================= WISH FORM SECTION ================= */}

        <section className="form-stage">

          <div className="form-stage__intro">
            <span
              className="form-stage__ornament"
              aria-hidden="true"
            >
              ✧
            </span>

            <span>
              YOUR WISH STARTS HERE
            </span>

            <span
              className="form-stage__ornament"
              aria-hidden="true"
            >
              ✧
            </span>
          </div>

          {/* Existing contest form */}
          <WishForm />

        

        </section>

        {/* ================= FOOTER ================= */}

        <footer className="foot foot--christmas">

          <span className="foot__copy">
            Brought together by
          </span>

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
            />

            <span>Snowcem</span>
          </a>

          <span
            className="foot__and"
            aria-hidden="true"
          >
            &amp;
          </span>

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
            />

            <span>VirtuMedia</span>
          </a>

          <span className="foot__copy foot__year">
            © {new Date().getFullYear()}
          </span>

        </footer>

      </main>
    </div>
  );
}
