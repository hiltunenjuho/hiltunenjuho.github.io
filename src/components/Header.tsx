import { useEffect, useRef, useState } from "react";
import type { PageId } from "../types";

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const navigationItems: { page: PageId; label: string; icon: string }[] = [
  { page: "home", label: "Home", icon: "home" },
  { page: "about", label: "About", icon: "info" },
  { page: "projects", label: "Projects", icon: "folder_open" },
  { page: "contact", label: "Contact", icon: "alternate_email" },
];

export function Header({ activePage, onNavigate }: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const logoButtonRef = useRef<HTMLButtonElement | null>(null);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [comingSoonVisible, setComingSoonVisible] = useState(false);

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

      header.style.width = `${width}px`;
      header.style.setProperty("--mainHeaderHeight", `${height}px`);
      header.style.setProperty("--tabIconSize", `${iconSize}px`);
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
      setComingSoonVisible(false);
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
          aria-label="Close application menu"
          tabIndex={-1}
          onClick={() => {
            setAppMenuOpen(false);
            setComingSoonVisible(false);
            logoButtonRef.current?.focus();
          }}
        />
      )}
      <header ref={headerRef} id="mainHeader">
        <button
          ref={logoButtonRef}
          id="logo"
          type="button"
          className="appSwitcherToggle"
          aria-label={appMenuOpen ? "Close application menu" : "Open application menu"}
          aria-expanded={appMenuOpen}
          aria-controls="appSwitcherMenu"
          onClick={() => {
            setAppMenuOpen((open) => !open);
            setComingSoonVisible(false);
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
            <span>Try my other apps!</span>
          </div>
        )}
        <nav
          className="appSwitcherMenu"
          id="appSwitcherMenu"
          aria-label="Applications"
          hidden={!appMenuOpen}
        >
          <a
            className="appSwitcherItem"
            href="https://hiltunenjuho.github.io/"
            aria-current="page"
          >
            <img className="appSwitcherLogo" src="/assets/images/logo.svg" alt="" />
            <span className="appSwitcherName appSwitcherNamePortfolio">Portfolio Website</span>
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
          <button
            className="appSwitcherItem"
            type="button"
            onClick={() => setComingSoonVisible(true)}
          >
            <img
              className="appSwitcherLogo"
              src="/assets/images/knowdium-logo.svg"
              alt=""
            />
            <span className="appSwitcherName appSwitcherNameKnowdium">knowdium!</span>
          </button>
          {comingSoonVisible && (
            <p className="appSwitcherNotice" role="status">
              COMING SOON!
            </p>
          )}
        </nav>
        <div id="headerTabsetContainer">
          <nav className="tabset" id="headerTabset" aria-label="Main navigation">
            {navigationItems.map(({ page, label, icon }) => {
              const isActive = page === activePage;

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
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
