import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode, TransitionEvent } from "react";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HomeHighlights } from "./components/HomeHighlights";
import { SitePreferencesContext } from "./sitePreferences";
import type { Locale } from "./sitePreferences";
import { pageIds } from "./types";
import type { PageId } from "./types";

const pageHashes: Record<PageId, string> = {
  home: "",
  about: "#about",
  projects: "#projects",
  contact: "#contact",
};

const pageHeadingIds: Record<PageId, string> = {
  home: "homePageTitle",
  about: "aboutPageTitle",
  projects: "projectsPageTitle",
  contact: "contactPageTitle",
};

function getPageFromHash(hash: string): PageId {
  return pageIds.find((page) => pageHashes[page] === hash) ?? "home";
}

function getInitialPage(): PageId {
  return getPageFromHash(window.location.hash);
}

function getInitialLocale(): Locale {
  const languages = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  return languages.some((language) => /^fi(?:-|$)/i.test(language)) ? "fi" : "en";
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getInitialPage);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [keepHomeLayout, setKeepHomeLayout] = useState(activePage === "home");
  const [homeLayoutExiting, setHomeLayoutExiting] = useState(false);
  const [heroExitMinHeight, setHeroExitMinHeight] = useState<number | null>(null);
  const [stageHeight, setStageHeight] = useState(0);
  const pageElements = useRef<Partial<Record<PageId, HTMLElement>>>({});
  const homeLayoutTransitions = useRef({ stage: false, hero: false });
  const focusPageHeading = useRef(false);
  const activePageRef = useRef(activePage);
  activePageRef.current = activePage;
  const activeIndex = pageIds.indexOf(activePage);

  useLayoutEffect(() => {
    const isFinnish = locale === "fi";
    const title = isFinnish
      ? "Juho Hiltunen | Full Stack Developer"
      : "Juho Hiltunen | Full Stack Developer";
    const description = isFinnish
      ? "Rakennan laadukkaita ohjelmistoja, sovelluksia, automaatioita ja integraatioita. Tutustu projekteihini ja ota yhteyttä."
      : "I build quality software, apps, automations, and integrations. Explore my projects and get in touch.";

    document.documentElement.lang = locale;
    document.documentElement.style.colorScheme = "dark";
    document.title = title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute(
      "content",
      description,
    );
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute(
      "content",
      title,
    );
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute(
      "content",
      description,
    );
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute(
      "content",
      title,
    );
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute(
      "content",
      description,
    );
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      "content",
      "#111315",
    );
  }, [locale]);

  const navigateToPage = useCallback(
    (page: PageId, updateHistory = true) => {
      if (page === activePageRef.current) {
        return;
      }

      activePageRef.current = page;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

      if (page === "home") {
        setKeepHomeLayout(true);
        setHomeLayoutExiting(false);
        setHeroExitMinHeight(null);
        homeLayoutTransitions.current = { stage: false, hero: false };
      } else if (activePage === "home") {
        if (prefersReducedMotion) {
          setKeepHomeLayout(false);
          setHomeLayoutExiting(false);
          setHeroExitMinHeight(null);
          homeLayoutTransitions.current = { stage: false, hero: false };
        } else {
          const hero = document.getElementById("heroElement");
          const heroContent = document.getElementById("heroContainer");
          if (!hero || !heroContent) {
            throw new Error("The hero layout elements were not found.");
          }

          const targetMinHeight = heroContent.getBoundingClientRect().height;
          const currentMinHeight = Number.parseFloat(getComputedStyle(hero).minHeight);
          const heroTransitionNeeded = Math.abs(currentMinHeight - targetMinHeight) >= 1;
          setKeepHomeLayout(true);
          setHomeLayoutExiting(true);
          setHeroExitMinHeight(heroTransitionNeeded ? targetMinHeight : null);
          homeLayoutTransitions.current = { stage: false, hero: !heroTransitionNeeded };
        }
      }

      const nextUrl = window.location.pathname + window.location.search + pageHashes[page];
      if (
        updateHistory &&
        window.location.pathname + window.location.search + window.location.hash !== nextUrl
      ) {
        window.history.pushState(null, "", nextUrl);
      }

      focusPageHeading.current = true;
      setActivePage(page);
    },
    [activePage],
  );

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    function activatePageFromHistory() {
      navigateToPage(getPageFromHash(window.location.hash), false);
    }

    window.addEventListener("popstate", activatePageFromHistory);
    window.addEventListener("hashchange", activatePageFromHistory);
    return () => {
      window.removeEventListener("popstate", activatePageFromHistory);
      window.removeEventListener("hashchange", activatePageFromHistory);
    };
  }, [navigateToPage]);

  useLayoutEffect(() => {
    if (!focusPageHeading.current) {
      return;
    }

    focusPageHeading.current = false;
    document.getElementById(pageHeadingIds[activePage])?.focus({ preventScroll: true });
  }, [activePage]);

  function finishHomeLayoutTransition(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "height" &&
      keepHomeLayout &&
      homeLayoutExiting &&
      activePage !== "home"
    ) {
      homeLayoutTransitions.current.stage = true;
      finishHomeLayoutExitIfReady();
    }
  }

  function finishHomeLayoutExitIfReady() {
    if (!homeLayoutTransitions.current.stage || !homeLayoutTransitions.current.hero) {
      return;
    }

    setKeepHomeLayout(false);
    setHomeLayoutExiting(false);
    setHeroExitMinHeight(null);
    homeLayoutTransitions.current = { stage: false, hero: false };
  }

  function finishHeroLayoutTransition(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "min-height" &&
      homeLayoutExiting &&
      activePage !== "home"
    ) {
      homeLayoutTransitions.current.hero = true;
      finishHomeLayoutExitIfReady();
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
    <SitePreferencesContext.Provider
      value={{
        locale,
        setLocale,
      }}
    >
      <>
        <Header activePage={activePage} onNavigate={navigateToPage} />
        <main
          className={`production${keepHomeLayout ? " home-layout" : ""}${
            activePage === "home" ? " home-view" : ""
          }${activePage === "about" ? " about-view" : ""
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
          <Hero
            onNavigate={navigateToPage}
            exitMinHeight={heroExitMinHeight}
            onLayoutTransitionEnd={finishHeroLayoutTransition}
          />
          <a
            className="scrollCue"
            id="scrollCue"
            href="#homeHighlights"
            aria-label={
              locale === "fi" ? "Selaa sivua alaspäin" : "Scroll down to explore"
            }
            onClick={scrollToHighlights}
          >
            <span className="scrollCueText">
              {locale === "fi" ? "SELAA ALASPÄIN" : "SCROLL TO EXPLORE"}
            </span>
            <span className="material-symbols-outlined" aria-hidden="true">
              keyboard_arrow_down
            </span>
          </a>
          <HomeHighlights onNavigate={navigateToPage} />
        </main>
        <Footer />
      </>
    </SitePreferencesContext.Provider>
  );
}
