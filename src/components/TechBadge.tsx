import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useSitePreferences } from "../sitePreferences";
import { useTechBadgeTooltip } from "./TechBadgeTooltipContext";

interface LocalizedDescription {
  fi: string;
  en: string;
}

const technologyDescriptions = {
  "ASP.NET Core": {
    fi: "Kehys .NET-sovellusten verkkosivujen ja HTTP-rajapintojen rakentamiseen.",
    en: "A framework for building websites and web APIs with .NET.",
  },
  "C#": {
    fi: "Ohjelmointikieli, jolla rakennetaan sovelluksia ja palveluita.",
    en: "A programming language used to build applications and services.",
  },
  "Cloudflare Workers": {
    fi: "Palvelu, jolla voi suorittaa pieniä ohjelmia verkossa ilman oman palvelimen ylläpitoa.",
    en: "A service for running small programs online without managing a server.",
  },
  "Core Location": {
    fi: "Applen työkalu laitteen sijaintitietojen käyttämiseen käyttäjän luvalla.",
    en: "Apple's framework for accessing a device's location with the user's permission.",
  },
  "CSS": {
    fi: "Kieli, jolla määritellään verkkosivujen ulkoasu ja asettelu.",
    en: "The language used to define the appearance and layout of web pages.",
  },
  Docker: {
    fi: "Työkalu, jolla sovellus ja sen tarvitsemat osat pakataan helposti siirrettävään ympäristöön.",
    en: "A tool for packaging an application and its dependencies into a portable environment.",
  },
  ".NET": {
    fi: "Microsoftin kehitysalusta sovellusten rakentamiseen ja suorittamiseen.",
    en: "Microsoft's platform for building and running applications.",
  },
  "Entity Framework Core": {
    fi: "Työkalu, joka auttaa sovellusta lukemaan ja tallentamaan tietoja relaatiotietokantaan.",
    en: "A tool that helps an application read and store data in a relational database.",
  },
  Git: {
    fi: "Versionhallintatyökalu, jolla seurataan koodiin tehtyjä muutoksia.",
    en: "A version control tool for tracking changes to code.",
  },
  GitHub: {
    fi: "Palvelu koodin säilyttämiseen, jakamiseen ja yhteiseen kehittämiseen.",
    en: "A service for storing, sharing, and collaborating on code.",
  },
  "GitHub Actions": {
    fi: "GitHubin automaatiotyökalu esimerkiksi testien ja julkaisujen suorittamiseen.",
    en: "GitHub's automation tool for running tasks such as tests and deployments.",
  },
  "GitHub Pages": {
    fi: "Palvelu staattisten verkkosivujen julkaisemiseen GitHub-repositoriosta.",
    en: "A service for publishing static websites from a GitHub repository.",
  },
  "Google OAuth 2.0": {
    fi: "Kirjautumistapa, jossa sovellus voi tunnistaa käyttäjän Google-tilin avulla käsittelemättä tämän salasanaa.",
    en: "A sign-in method that lets an app verify a user through Google without handling their password.",
  },
  "Google Places API": {
    fi: "Google-palvelu paikkojen, kuten yritysten ja osoitteiden, hakemiseen sovelluksessa.",
    en: "A Google service for searching places such as businesses and addresses in an app.",
  },
  HTML: {
    fi: "Merkintäkieli, jolla määritellään verkkosivun sisältö ja rakenne.",
    en: "The markup language used to define the content and structure of a web page.",
  },
  JavaScript: {
    fi: "Ohjelmointikieli, jolla lisätään verkkosivuille toimintaa ja vuorovaikutusta.",
    en: "A programming language used to add behavior and interactivity to websites.",
  },
  "Node.js": {
    fi: "Ympäristö JavaScript-ohjelmien suorittamiseen selaimen ulkopuolella.",
    en: "An environment for running JavaScript programs outside a web browser.",
  },
  OpenAPI: {
    fi: "Yleinen muoto verkkorajapinnan osoitteiden ja niiden toiminnan dokumentointiin.",
    en: "A common format for documenting web API endpoints and how they work.",
  },
  PWA: {
    fi: "Verkkosovellus, jonka voi asentaa ja jota voi käyttää sovelluksen tapaan.",
    en: "A website that can be installed and used more like an app.",
  },
  PostgreSQL: {
    fi: "Avoimen lähdekoodin relaatiotietokanta tietojen järjestämiseen ja tallentamiseen.",
    en: "An open-source relational database for organizing and storing data.",
  },
  Python: {
    fi: "Ohjelmointikieli, jota käytetään esimerkiksi automaatioon, dataan ja verkkopalveluihin.",
    en: "A programming language used for tasks such as automation, data work, and web services.",
  },
  React: {
    fi: "Kirjasto interaktiivisten verkkokäyttöliittymien rakentamiseen osista.",
    en: "A library for building interactive web interfaces from reusable pieces.",
  },
  "React Router": {
    fi: "Työkalu verkkosovelluksen eri näkymien ja osoitteiden väliseen navigointiin.",
    en: "A tool for navigating between pages and URLs in a web app.",
  },
  "REST APIs": {
    fi: "Tapa, jolla eri sovellukset vaihtavat tietoja verkkopyyntöjen avulla.",
    en: "A common way for applications to exchange data through web requests.",
  },
  "Swift Package Manager": {
    fi: "Applen työkalu Swift-sovellusten lisäkirjastojen hallintaan.",
    en: "Apple's tool for managing external libraries in Swift applications.",
  },
  SQL: {
    fi: "Kieli, jolla haetaan ja muokataan tietoja relaatiotietokannassa.",
    en: "A language for querying and changing data in a relational database.",
  },
  Swift: {
    fi: "Ohjelmointikieli Applen alustojen, kuten iOS:n, sovelluksiin.",
    en: "A programming language for apps on Apple platforms such as iOS.",
  },
  SwiftUI: {
    fi: "Applen käyttöliittymäkehys iOS- ja muiden Apple-laitteiden sovelluksiin.",
    en: "Apple's user interface framework for iOS and other Apple-platform apps.",
  },
  "TanStack Query": {
    fi: "Työkalu palvelimelta haettavan tiedon lataamiseen, välimuistiin ja päivittämiseen.",
    en: "A tool for loading, caching, and updating data fetched from a server.",
  },
  "Tailwind CSS": {
    fi: "CSS-työkalu, jolla verkkosivun ulkoasua rakennetaan pienillä valmiilla luokilla.",
    en: "A CSS tool for styling websites with small, ready-to-use utility classes.",
  },
  "The Trivia API": {
    fi: "Verkkopalvelu, josta sovellus voi hakea tietovisakysymyksiä.",
    en: "A web service an app can use to fetch trivia questions.",
  },
  "Transformers.js": {
    fi: "JavaScript-kirjasto, jolla voi suorittaa tekoälymalleja verkkoselaimessa.",
    en: "A JavaScript library for running AI models in a web browser.",
  },
  TypeScript: {
    fi: "JavaScriptiin perustuva kieli, joka auttaa löytämään tietotyyppivirheitä jo kehitysvaiheessa.",
    en: "A language based on JavaScript that helps catch data-type mistakes during development.",
  },
  URLSession: {
    fi: "Applen työkalu verkkopyyntöjen tekemiseen iOS-sovelluksesta.",
    en: "Apple's tool for making network requests from an iOS app.",
  },
  Vite: {
    fi: "Työkalu verkkosovelluksen kehityspalvelimen ja tuotantoversion rakentamiseen.",
    en: "A tool for running a web app during development and building its production version.",
  },
  WebGL: {
    fi: "Selaintekniikka kolmiulotteisen grafiikan piirtämiseen.",
    en: "A browser technology for drawing 3D graphics.",
  },
  "Web Workers": {
    fi: "Selainominaisuus, jolla raskasta työtä voi tehdä taustalla hidastamatta käyttöliittymää.",
    en: "A browser feature for running background tasks without slowing down the interface.",
  },
  Wrangler: {
    fi: "Cloudflaren komentorivityökalu Worker-sovellusten kehitykseen ja julkaisuun.",
    en: "Cloudflare's command-line tool for developing and deploying Worker applications.",
  },
  xUnit: {
    fi: ".NET-sovellusten testauskehys, jolla tarkistetaan koodin toimintaa automaattisesti.",
    en: "A testing framework for automatically checking that .NET application code works.",
  },
} satisfies Record<string, LocalizedDescription>;

export type Technology = keyof typeof technologyDescriptions;

const technologyColors: Record<string, string> = {
  "ASP.NET Core": "#512BD4",
  "C#": "#68217A",
  "Cloudflare Workers": "#F38020",
  "Core Location": "#F05138",
  "CSS": "#1572B6",
  Docker: "#2496ED",
  ".NET": "#512BD4",
  "Entity Framework Core": "#512BD4",
  Git: "#F05032",
  GitHub: "#F0F6FC",
  "GitHub Actions": "#2088FF",
  "GitHub Pages": "#F0F6FC",
  "Google OAuth 2.0": "#4285F4",
  "Google Places API": "#4285F4",
  HTML: "#E34F26",
  JavaScript: "#F7DF1E",
  "Node.js": "#5FA04E",
  OpenAPI: "#6BA539",
  PWA: "#5A0FC8",
  PostgreSQL: "#4169E1",
  Python: "#3776AB",
  React: "#61DAFB",
  "React Router": "#CA4245",
  "REST APIs": "#26A69A",
  Swift: "#F05138",
  SwiftUI: "#F05138",
  "Swift Package Manager": "#F05138",
  "Tailwind CSS": "#06B6D4",
  "TanStack Query": "#FF4154",
  "The Trivia API": "#26A69A",
  "Transformers.js": "#FFD21E",
  TypeScript: "#3178C6",
  URLSession: "#F05138",
  Vite: "#646CFF",
  WebGL: "#990000",
  "Web Workers": "#7D8590",
  Wrangler: "#F38020",
  xUnit: "#512BD4",
};

const darkSurface = "#191c20";

function mixColors(first: string, second: string, secondWeight: number): string {
  const firstRgb = {
    red: Number.parseInt(first.slice(1, 3), 16),
    green: Number.parseInt(first.slice(3, 5), 16),
    blue: Number.parseInt(first.slice(5, 7), 16),
  };
  const secondRgb = {
    red: Number.parseInt(second.slice(1, 3), 16),
    green: Number.parseInt(second.slice(3, 5), 16),
    blue: Number.parseInt(second.slice(5, 7), 16),
  };
  const mix = (start: number, end: number) =>
    Math.round(start * (1 - secondWeight) + end * secondWeight);
  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(mix(firstRgb.red, secondRgb.red))}${toHex(
    mix(firstRgb.green, secondRgb.green),
  )}${toHex(mix(firstRgb.blue, secondRgb.blue))}`;
}

function getLuminance(color: string): number {
  const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastRatio(first: string, second: string): number {
  const firstLuminance = getLuminance(first);
  const secondLuminance = getLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableColor(brandColor: string, backgroundColor: string): string {
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mixColors(brandColor, "#FFFFFF", step / 20);
    if (getContrastRatio(candidate, backgroundColor) >= 4.5) {
      return candidate;
    }
  }
  return "#FFFFFF";
}

interface TechBadgeProps {
  technology: Technology;
  compact?: boolean;
}

type TechBadgeStyle = CSSProperties & {
  "--tech-color": string;
  "--tech-background": string;
  "--tech-foreground": string;
};

interface TooltipPosition {
  top: number;
  left: number;
  arrowOffset: number;
  placement: "above" | "below";
}

type TooltipStyle = CSSProperties & { "--tooltip-arrow-offset": string };

export function TechBadge({ technology, compact = false }: TechBadgeProps) {
  const { locale } = useSitePreferences();
  const {
    activeId,
    pinned,
    closing,
    openOnHover,
    pin,
    close,
    closeOnHoverEnd,
    cancelClose,
    registerTooltipElement,
  } = useTechBadgeTooltip();
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    arrowOffset: 0,
    placement: "above",
  });
  const isActive = activeId === id;
  const description = technologyDescriptions[technology][locale];
  const tooltipId = `tech-tooltip-${id}`;
  const brandColor = technologyColors[technology] ?? "#8B949E";
  const backgroundColor = mixColors(darkSurface, brandColor, 0.18);
  const style: TechBadgeStyle = {
    "--tech-color": brandColor,
    "--tech-background": backgroundColor,
    "--tech-foreground": getReadableColor(brandColor, backgroundColor),
  };

  const updatePosition = useCallback(() => {
    const anchor = triggerRef.current?.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    if (!anchor || !tooltip) {
      return;
    }

    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 12;
    const gap = 10;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const hasRoomAbove = anchor.top >= tooltipRect.height + gap + margin;
    const hasRoomBelow = viewportHeight - anchor.bottom >= tooltipRect.height + gap + margin;
    const placement = hasRoomAbove || !hasRoomBelow ? "above" : "below";
    const desiredTop =
      placement === "above" ? anchor.top - tooltipRect.height - gap : anchor.bottom + gap;
    const top = Math.max(
      margin,
      Math.min(desiredTop, viewportHeight - tooltipRect.height - margin),
    );
    const maxLeft = Math.max(margin, viewportWidth - tooltipRect.width - margin);
    const desiredLeft = anchor.left + anchor.width / 2 - tooltipRect.width / 2;
    const left = Math.max(margin, Math.min(desiredLeft, maxLeft));
    const arrowOffset = Math.max(
      18,
      Math.min(anchor.left + anchor.width / 2 - left, tooltipRect.width - 18),
    );

    setPosition({ top, left, arrowOffset, placement });
  }, []);

  const setTooltipElement = useCallback(
    (element: HTMLDivElement | null) => {
      tooltipRef.current = element;
      registerTooltipElement(id, element);
    },
    [id, registerTooltipElement],
  );

  useLayoutEffect(() => {
    if (!isActive) {
      return;
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isActive, locale, updatePosition]);

  function handleClick() {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    if (isActive && pinned && !closing) {
      close(id);
    } else {
      pin(id, trigger);
    }
  }

  const tooltipStyle: TooltipStyle = {
    top: `${position.top}px`,
    left: `${position.left}px`,
    "--tooltip-arrow-offset": `${position.arrowOffset}px`,
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`techBadge${compact ? " techBadgeCompact" : ""}`}
        style={style}
        aria-label={locale === "fi" ? `${technology} — lisätietoa` : `${technology} — more information`}
        aria-haspopup="dialog"
        aria-expanded={isActive && !closing}
        aria-controls={isActive ? tooltipId : undefined}
        aria-describedby={isActive ? tooltipId : undefined}
        onPointerEnter={() => {
          if (triggerRef.current) {
            openOnHover(id, triggerRef.current);
          }
        }}
        onPointerLeave={() => closeOnHoverEnd(id)}
        onFocus={() => {
          if (triggerRef.current) {
            openOnHover(id, triggerRef.current);
          }
        }}
        onBlur={() => closeOnHoverEnd(id)}
        onClick={handleClick}
      >
        {technology}
      </button>
      {isActive &&
        createPortal(
          <div
            ref={setTooltipElement}
            id={tooltipId}
            className={`techTooltip${closing ? " techTooltipClosing" : ""}${
              pinned ? " techTooltipPinned" : ""
            }`}
            style={tooltipStyle}
            data-placement={position.placement}
            role={pinned ? "dialog" : "tooltip"}
            aria-labelledby={`${tooltipId}-title`}
            aria-modal={pinned ? false : undefined}
            onPointerEnter={() => cancelClose(id)}
            onPointerLeave={() => closeOnHoverEnd(id)}
          >
            {pinned && (
              <button
                type="button"
                className="techTooltipClose"
                aria-label={locale === "fi" ? `Sulje ${technology}-selite` : `Close ${technology} explanation`}
                onClick={() => close(id)}
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
            <h4 id={`${tooltipId}-title`}>{technology}</h4>
            <p>{description}</p>
          </div>,
          document.body,
        )}
    </>
  );
}
