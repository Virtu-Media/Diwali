
"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".hero, .celebration-section, .card, .foot"
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window) ||
      targets.length === 0
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    targets.forEach((element, index) => {
      element.classList.add("festive-reveal");

      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 100, 300)}ms`
      );

      observer.observe(element);
    });

    return () => {
      observer.disconnect();

      targets.forEach((element) => {
        element.classList.remove(
          "festive-reveal",
          "is-revealed"
        );

        element.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return null;
}
