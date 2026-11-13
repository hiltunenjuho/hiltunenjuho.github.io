import { useLayoutEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { PageId } from "../types";

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const lastNameRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const element = lastNameRef.current;
    if (!element) {
      return;
    }

    const updateLayout = () => {
      const bounds = element.getBoundingClientRect();
      document.documentElement.style.setProperty("--contentWidth", `${bounds.width}px`);
      document.documentElement.style.setProperty(
        "--codeTextFontSize",
        `${Math.round(bounds.height * 0.175)}px`,
      );
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(element);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--contentWidth");
      document.documentElement.style.removeProperty("--codeTextFontSize");
    };
  }, []);

  function openProjects() {
    onNavigate("projects");
  }

  function handleBuildKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjects();
    }
  }

  return (
    <div className="heroOuterContainer" id="heroElement">
      <div className="heroInnerContainer" id="heroContainer">
        <h1 className="heroName">
          <span className="namePart" id="firstName">
            JUHO <span id="middleName">M.</span>
          </span>
          <span className="namePart" id="lastName" ref={lastNameRef}>
            HILTUNEN
          </span>
        </h1>
        <div id="heroSubText">
          <span className="typedTextReveal">
            <span className="typedText" id="typedText">
              // i{" "}
              <span
                id="purpleTypedText"
                role="button"
                tabIndex={0}
                onClick={openProjects}
                onKeyDown={handleBuildKeyDown}
              >
                build
              </span>{" "}
              <span id="yellowTypedText">software</span>.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
