import { useEffect, useRef } from "react";
import { useSitePreferences } from "../sitePreferences";
import type { PageId } from "../types";

interface HomeHighlightsProps {
  onNavigate: (page: PageId) => void;
}

export function HomeHighlights({ onNavigate }: HomeHighlightsProps) {
  const { locale } = useSitePreferences();
  const isFinnish = locale === "fi";
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
      aria-label={isFinnish ? "Tutustu sivun sisältöön" : "Explore the site"}
      ref={sectionRef}
    >
      <article className="homeHighlightItem">
        <button
          className="homeHighlightIcon"
          type="button"
          aria-label={isFinnish ? "Lue lisää minusta" : "Learn more about me"}
          onClick={() => onNavigate("about")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            code
          </span>
          <span className="homeHighlightIconLabel">{isFinnish ? "MINUSTA" : "ABOUT"}</span>
        </button>
        <div className="homeHighlightCopy">
          <p className="homeHighlightEyebrow">{isFinnish ? "01 / MINUSTA" : "01 / ABOUT ME"}</p>
          <h2>{isFinnish ? "Full Stack -kehittäjä." : "Full-Stack developer."}</h2>
          <p>
            {isFinnish
              ? "Tunnistan turhat mutkat työssä ja rakennan työkaluja, jotka tekevät arjesta sujuvampaa."
              : "I spot the frustrating bits in a workflow and build tools that make everyday work smoother."}
          </p>
          <button
            className="homeHighlightButton"
            type="button"
            onClick={() => onNavigate("about")}
          >
            {isFinnish ? "Lue lisää minusta" : "More about me"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
      <article className="homeHighlightItem homeHighlightItemReverse">
        <div className="homeHighlightCopy">
          <p className="homeHighlightEyebrow">{isFinnish ? "02 / PROJEKTIT" : "02 / PROJECTS"}</p>
          <h2>
            {isFinnish ? "Valittuja ohjelmistoprojekteja" : "Selected software projects"}
            <span className="yellowText">.</span>
          </h2>
          <p>
            {isFinnish
              ? "Kurkista projekteihin, kokeiluihin ja työn alla oleviin ideoihin. Kokeile demoja tai tutustu koodiin."
              : "Explore projects, experiments, and ideas in progress. Try the demos or take a look at the code."}
          </p>
          <button
            className="homeHighlightButton"
            type="button"
            onClick={() => onNavigate("projects")}
          >
            {isFinnish ? "Katso projektit" : "Explore projects"} <span aria-hidden="true">→</span>
          </button>
        </div>
        <button
          className="homeHighlightIcon"
          type="button"
          aria-label={isFinnish ? "Katso projektit" : "Explore projects"}
          onClick={() => onNavigate("projects")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            folder_open
          </span>
          <span className="homeHighlightIconLabel">{isFinnish ? "TYÖT" : "WORK"}</span>
        </button>
      </article>
      <article className="homeHighlightItem">
        <button
          className="homeHighlightIcon"
          type="button"
          aria-label={isFinnish ? "Ota yhteyttä" : "Get in touch"}
          onClick={() => onNavigate("contact")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            alternate_email
          </span>
          <span className="homeHighlightIconLabel">{isFinnish ? "YHTEYS" : "CONTACT"}</span>
        </button>
        <div className="homeHighlightCopy">
          <p className="homeHighlightEyebrow">{isFinnish ? "03 / JUTELLAAN!" : "03 / LET'S TALK!"}</p>
          <h2>{isFinnish ? "Onko mielessäsi idea tai projekti? Jutellaan." : "Have an idea or project in mind? Let's talk."}</h2>
          <p>
            {isFinnish
              ? "Etsitkö kehittäjää tai haluat vaihtaa ajatuksia? Laita viestiä."
              : "Looking for a developer or want to talk through an idea? Send me a note."}
          </p>
          <button
            className="homeHighlightButton"
            type="button"
            onClick={() => onNavigate("contact")}
          >
            {isFinnish ? "Ota yhteyttä" : "Get in touch"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    </section>
  );
}
