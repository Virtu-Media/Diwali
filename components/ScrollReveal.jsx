
"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".hero--christmas, .form-stage, .foot--christmas"
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window) ||
      targets.length === 0
    ) {
      targets.forEach((element) =>
        element.classList.add("is-holiday-visible")
      );

      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-holiday-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -28px 0px",
      }
    );

    targets.forEach((element, index) => {
      element.classList.add("holiday-reveal");

      element.style.setProperty(
        "--holiday-delay",
        `${Math.min(index * 110, 220)}ms`
      );

      observer.observe(element);
    });

    return () => {
      observer.disconnect();

      targets.forEach((element) => {
        element.classList.remove(
          "holiday-reveal",
          "is-holiday-visible"
        );

        element.style.removeProperty("--holiday-delay");
      });
    };
  }, []);

  return null;
}
