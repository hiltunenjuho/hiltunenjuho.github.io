import { useEffect, useRef, useState } from "react";
import { useSitePreferences } from "../sitePreferences";
import type { Locale } from "../sitePreferences";
import type { PageId } from "../types";

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const navigationItems: { page: PageId; icon: string }[] = [
  { page: "home", icon: "home" },
  { page: "about", icon: "info" },
  { page: "projects", icon: "folder_open" },
  { page: "contact", icon: "alternate_email" },
];

interface PreferenceTogglesProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

function PreferenceToggles({ locale, setLocale }: PreferenceTogglesProps) {
  const isFinnish = locale === "fi";

  return (
    <>
      <button
        className={`headerPreferenceButton headerLanguageButton${isFinnish ? " is-finnish" : ""}`}
        type="button"
        role="switch"
        aria-checked={isFinnish}
        aria-label={isFinnish ? "Vaihda englannin kieleen" : "Switch to Finnish"}
        onClick={() => setLocale(isFinnish ? "en" : "fi")}
      >
        <span>EN</span>
        <span>FI</span>
        <span className="preferenceToggleThumb" aria-hidden="true" />
      </button>
    </>
  );
}

export function Header({ activePage, onNavigate }: HeaderProps) {
  const { locale, setLocale } = useSitePreferences();
  const isFinnish = locale === "fi";
  const headerRef = useRef<HTMLElement | null>(null);
  const logoButtonRef = useRef<HTMLButtonElement | null>(null);
  const [appMenuOpen, setAppMenuOpen] = useState(false);

  useEffect(() => {
    function updateHeader() {
      const header = headerRef.current;
      if (!header) {
        return;
      }

      const isMobile = window.matchMedia("(max-width: 800px)").matches;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const progress = Math.min(Math.max(window.scrollY / 360, 0), 1);
      const sizeProgress = isMobile ? 0 : progress;
      const topHeight = isMobile ? 75 : Math.max(viewportHeight * 0.1, 100);
      const compactHeight = isMobile ? 64 : 72;
      const height = topHeight + (compactHeight - topHeight) * sizeProgress;
      const compactWidth = isMobile
        ? viewportWidth - viewportHeight * 0.02
        : Math.min(1120, viewportWidth - 48);
      const topWidth = isMobile
        ? compactWidth
        : Math.max(compactWidth, Math.min(1180, viewportWidth - 80));
      const width = topWidth + (compactWidth - topWidth) * sizeProgress;
      const contentWidth = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--contentWidth"),
      );
      const originalIconSize = isMobile
        ? 22
        : Math.min(topHeight * 0.65, contentWidth * 0.065);
      const iconSize = originalIconSize * (height / topHeight);
      const tabIconSize = isMobile ? 22 : 20 + 8 * (1 - progress);
      const activeIconScale = (tabIconSize + 16) / tabIconSize;

      header.style.width = `${width}px`;
      header.style.setProperty("--mainHeaderHeight", `${height}px`);
      header.style.setProperty("--tabIconSize", `${iconSize}px`);
      header.style.setProperty("--headerActiveIconScale", `${activeIconScale}`);
      header.style.setProperty("--headerFillOpacity", `${1 - progress}`);
      header.style.setProperty("--headerActiveIconProgress", `${progress * 100}%`);
      header.style.setProperty("--headerBorderWidth", `${progress * 2}px`);
      header.style.setProperty("--headerBlur", `${progress * 12}px`);
      header.style.setProperty("--headerShadowOpacity", `${progress * 0.3}`);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    document.addEventListener("visibilitychange", updateHeader);
    updateHeader();

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
      document.removeEventListener("visibilitychange", updateHeader);
    };
  }, []);

  useEffect(() => {
    if (!appMenuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setAppMenuOpen(false);
      logoButtonRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [appMenuOpen]);

  return (
    <>
      {appMenuOpen && (
        <button
          type="button"
          className="appSwitcherBackdrop"
          aria-label={isFinnish ? "Sulje sovellusvalikko" : "Close application menu"}
          tabIndex={-1}
          onClick={() => {
            setAppMenuOpen(false);
            logoButtonRef.current?.focus();
          }}
        />
      )}
      <div id="mainHeaderSlot">
      <header ref={headerRef} id="mainHeader">
        <button
          ref={logoButtonRef}
          id="logo"
          type="button"
          className="appSwitcherToggle"
          aria-label={
            appMenuOpen
              ? isFinnish ? "Sulje sovellusvalikko" : "Close application menu"
              : isFinnish ? "Avaa sovellusvalikko" : "Open application menu"
          }
          aria-expanded={appMenuOpen}
          aria-controls="appSwitcherMenu"
          onClick={() => {
            setAppMenuOpen((open) => !open);
          }}
        >
          <img
            className="appSwitcherToggleImage"
            src="/assets/images/logo.svg"
            alt=""
          />
        </button>
        {!appMenuOpen && (
          <div className="appSwitcherHint" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="m4 10 4-4 4 4" />
            </svg>
            <span>{isFinnish ? "Tutustu muihin projekteihini" : "Explore my other projects"}</span>
          </div>
        )}
        <nav
          className="appSwitcherMenu"
          id="appSwitcherMenu"
          aria-label={isFinnish ? "Sovellukset" : "Applications"}
          hidden={!appMenuOpen}
        >
          <a
            className="appSwitcherItem"
            href="https://hiltunenjuho.github.io/"
            aria-current="page"
          >
            <img className="appSwitcherLogo" src="/assets/images/logo.svg" alt="" />
            <span className="appSwitcherName appSwitcherNamePortfolio">
              {isFinnish ? "Portfolio" : "Portfolio"}
            </span>
          </a>
          <a
            className="appSwitcherItem"
            href="https://hiltunenjuho.github.io/nearest-pharmacy-web/"
          >
            <img
              className="appSwitcherLogo"
              src="/assets/images/pharmacy-finder-logo.svg"
              alt=""
            />
            <span className="appSwitcherName appSwitcherNamePharmacy">Pharmacy Finder</span>
          </a>
          <a
            className="appSwitcherItem"
            href="https://hiltunenjuho.github.io/knowdium/"
          >
            <img
              className="appSwitcherLogo"
              src="/assets/images/knowdium-logo.svg"
              alt=""
            />
            <span className="appSwitcherName appSwitcherNameKnowdium">knowdium!</span>
          </a>
        </nav>
        <div id="headerTabsetContainer">
          <nav
            className="tabset"
            id="headerTabset"
            aria-label={isFinnish ? "Päänavigaatio" : "Main navigation"}
          >
            {navigationItems.map(({ page, icon }) => {
              const isActive = page === activePage;
              const label = isFinnish
                ? { home: "Etusivu", about: "Minusta", projects: "Projektit", contact: "Yhteys" }[page]
                : { home: "Home", about: "About", projects: "Projects", contact: "Contact" }[page];

              return (
                <button
                  className={`tabButton${isActive ? " active" : ""}`}
                  id={`${page}TabButton`}
                  key={page}
                  type="button"
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavigate(page)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="tabLabel" aria-hidden="true">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="headerPreferences" role="group" aria-label={isFinnish ? "Sivuston asetukset" : "Site preferences"}>
          <PreferenceToggles
            locale={locale}
            setLocale={setLocale}
          />
        </div>
      </header>
      </div>
    </>
  );
}
