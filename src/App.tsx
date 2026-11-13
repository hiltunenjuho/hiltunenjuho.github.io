import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode, TransitionEvent } from "react";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HomeHighlights } from "./components/HomeHighlights";
import { pageIds } from "./types";
import type { PageId } from "./types";

function getInitialPage(): PageId {
  return window.location.hash === "#contact" ? "contact" : "home";
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getInitialPage);
  const [keepHomeLayout, setKeepHomeLayout] = useState(activePage === "home");
  const [stageHeight, setStageHeight] = useState(0);
  const pageElements = useRef<Partial<Record<PageId, HTMLElement>>>({});
  const activeIndex = pageIds.indexOf(activePage);

  const navigateToPage = useCallback(
    (page: PageId) => {
      if (page === activePage) {
        return;
      }

      if (page === "home" || activePage === "home") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }

      if (page === "home") {
        setKeepHomeLayout(true);
      } else if (activePage === "home") {
        setKeepHomeLayout(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }

      const nextHash = page === "contact" ? "#contact" : "";
      if (window.location.hash !== nextHash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + nextHash,
        );
      }
      setActivePage(page);
    },
    [activePage],
  );

  useEffect(() => {
    function activateContactFromHash() {
      if (window.location.hash === "#contact") {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setKeepHomeLayout(false);
        }
        setActivePage("contact");
      }
    }

    window.addEventListener("hashchange", activateContactFromHash);
    return () => window.removeEventListener("hashchange", activateContactFromHash);
  }, []);

  function finishHomeLayoutTransition(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "height" &&
      activePage !== "home"
    ) {
      setKeepHomeLayout(false);
    }
  }

  useLayoutEffect(() => {
    const activePanel = pageElements.current[activePage];
    if (activePage === "home" || !activePanel) {
      setStageHeight(0);
      return;
    }

    const updateHeight = () => {
      setStageHeight(activePanel.getBoundingClientRect().height);
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(activePanel);
    return () => resizeObserver.disconnect();
  }, [activePage]);

  const pageContent: Record<PageId, ReactNode> = {
    home: null,
    about: <AboutPage />,
    projects: <ProjectsPage />,
    contact: <ContactPage />,
  };

  function scrollToHighlights(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("homeHighlights")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      <Header activePage={activePage} onNavigate={navigateToPage} />
      <main
        className={`production${keepHomeLayout ? " home-layout" : ""}${
          activePage === "home" ? " home-view" : ""
        }`}
      >
        <div
          id="pageStage"
          style={{ height: activePage === "home" ? 0 : `${stageHeight}px` }}
          onTransitionEnd={finishHomeLayoutTransition}
        >
          <div
            id="pageTrack"
            style={{
              width: `${pageIds.length * 100}%`,
              transform: `translateX(-${activeIndex * (100 / pageIds.length)}%)`,
            }}
          >
            {pageIds.map((page) => {
              const isActive = page === activePage;
              return (
                <section
                  className={`pageContent${isActive ? " active" : ""}`}
                  id={`${page}Content`}
                  key={page}
                  ref={(element) => {
                    if (element) {
                      pageElements.current[page] = element;
                      element.inert = !isActive;
                    }
                  }}
                  aria-hidden={!isActive}
                  style={{ flexBasis: `${100 / pageIds.length}%` }}
                >
                  {pageContent[page]}
                </section>
              );
            })}
          </div>
        </div>
        <Hero onNavigate={navigateToPage} />
        <a
          className="scrollCue"
          id="scrollCue"
          href="#homeHighlights"
          aria-label="Scroll to explore the site"
          onClick={scrollToHighlights}
        >
          <span className="scrollCueText">SCROLL TO EXPLORE</span>
          <span className="material-symbols-outlined" aria-hidden="true">
            keyboard_arrow_down
          </span>
        </a>
        <HomeHighlights onNavigate={navigateToPage} />
      </main>
      <Footer />
    </>
  );
}
