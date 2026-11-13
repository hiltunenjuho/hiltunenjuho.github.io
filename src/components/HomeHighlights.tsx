import { useEffect, useRef } from "react";
import type { PageId } from "../types";

interface HomeHighlightsProps {
  onNavigate: (page: PageId) => void;
}

export function HomeHighlights({ onNavigate }: HomeHighlightsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const items = section.querySelectorAll<HTMLElement>(".homeHighlightItem");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const item = entry.target as HTMLElement;
          item.classList.add("is-in-view");
          item.inert = false;
          observer.unobserve(item);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => {
      item.inert = true;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="homeHighlights is-visible"
      id="homeHighlights"
      aria-label="Explore the site"
      ref={sectionRef}
    >
      <article className="homeHighlightItem">
        <button
          className="homeHighlightIcon"
          type="button"
          aria-label="More about me"
          onClick={() => onNavigate("about")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            code
          </span>
          <span className="homeHighlightIconLabel">ABOUT</span>
        </button>
        <div className="homeHighlightCopy">
          <p className="homeHighlightEyebrow">01 / ABOUT ME</p>
          <h2>Junior Software Developer.</h2>
          <p>
            I look for the points where work becomes repetitive or unclear, then build tools that
            make the next step simpler.
          </p>
          <button
            className="homeHighlightButton"
            type="button"
            onClick={() => onNavigate("about")}
          >
            More about me <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
      <article className="homeHighlightItem homeHighlightItemReverse">
        <div className="homeHighlightCopy">
          <p className="homeHighlightEyebrow">02 / PROJECTS</p>
          <h2>
            Less talk. More things that work<span className="yellowText">.</span>
          </h2>
          <p>Selected projects, practical experiments, and products in progress.</p>
          <button
            className="homeHighlightButton"
            type="button"
            onClick={() => onNavigate("projects")}
          >
            Explore projects <span aria-hidden="true">→</span>
          </button>
        </div>
        <button
          className="homeHighlightIcon"
          type="button"
          aria-label="Explore projects"
          onClick={() => onNavigate("projects")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            folder_open
          </span>
          <span className="homeHighlightIconLabel">WORK</span>
        </button>
      </article>
      <article className="homeHighlightItem">
        <button
          className="homeHighlightIcon"
          type="button"
          aria-label="Get in touch"
          onClick={() => onNavigate("contact")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            alternate_email
          </span>
          <span className="homeHighlightIconLabel">CONTACT</span>
        </button>
        <div className="homeHighlightCopy">
          <p className="homeHighlightEyebrow">03 / GET IN TOUCH</p>
          <h2>Good work starts with a conversation.</h2>
          <p>Have an idea, a challenge, or an opportunity? I'd like to hear about it.</p>
          <button
            className="homeHighlightButton"
            type="button"
            onClick={() => onNavigate("contact")}
          >
            Get in touch <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    </section>
  );
}
