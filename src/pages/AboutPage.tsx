import { CardCarousel } from "../components/CardCarousel";
import { TechBadge } from "../components/TechBadge";
import type { Technology } from "../components/TechBadge";
import { useSitePreferences } from "../sitePreferences";

type TechStackCategory = "languages" | "frontend" | "backend" | "data" | "testingTools";

const techStackCategoryLabels: Record<TechStackCategory, { fi: string; en: string }> = {
  languages: { fi: "Ohjelmointikielet", en: "Languages" },
  frontend: { fi: "Frontend ja mobiili", en: "Frontend and mobile" },
  backend: { fi: "Backend ja rajapinnat", en: "Backend and APIs" },
  data: { fi: "Data ja tietokannat", en: "Data and databases" },
  testingTools: { fi: "Testaus ja työkalut", en: "Testing and tools" },
};

const techStackCategories: Record<TechStackCategory, Technology[]> = {
  languages: ["JavaScript", "TypeScript", "Python", "C#", "Swift", "SQL"],
  frontend: [
    "React",
    "Vite",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "PWA",
    "React Router",
    "SwiftUI",
    "TanStack Query",
  ],
  backend: [
    ".NET",
    "ASP.NET Core",
    "Node.js",
    "Google OAuth 2.0",
    "OpenAPI",
    "REST APIs",
  ],
  data: ["Entity Framework Core", "PostgreSQL"],
  testingTools: ["Docker", "Git", "GitHub", "Wrangler", "xUnit"],
};

export function AboutPage() {
  const { locale } = useSitePreferences();
  const isFinnish = locale === "fi";
  const aboutCards = isFinnish
    ? [
        <>
          <p className="aboutCardEyebrow">01 / FULL STACK</p>
          <h2 className="aboutCardTitle">
            Käyttöliittymästä <span className="yellowText pulsingText">taustapalveluihin</span>
          </h2>
          <p>
            Rakennan kokonaisia web-ratkaisuja: käyttöliittymiä, rajapintoja, taustapalveluita ja
            dataa käsitteleviä toimintoja.
          </p>
          <p>
            Tavoitteeni on jatkuvasti syventää osaamistani ja työkalupakkiani. Nautin kunnon haasteesta, joka mahdollistaa samalla erittäin nopean oppimiskykyni.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">02 / LIIKETOIMINTAYMMÄRRYS</p>
          <h2 className="aboutCardTitle">
            Tekniikka alkaa <span className="yellowText pulsingText">oikeasta tarpeesta</span>
          </h2>
          <p>
            Ymmärrän asiakkaan tarpeet, työnkulut ja liiketoiminnan tavoitteet. Sen pohjalta rakennan
            ratkaisuja, jotka toimivat teknisesti ja helpottavat oikeaa arkea.
          </p>
          <p>
            Tiedän myös, että hyvä ratkaisu syntyy siitä, että ymmärtää ensin, miksi sitä tarvitaan.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">03 / MYYNTI JA VIESTINTÄ</p>
          <h2 className="aboutCardTitle">
            Osaan kuunnella — ja <span className="yellowText pulsingText">kertoa hyödyt.</span>
          </h2>
          <p>
            Myynti- ja asiakastyö on opettanut kysymään oikeat kysymykset, tunnistamaan tarpeet ja
            selittämään ratkaisut ymmärrettävästi.
          </p>
          <p>
            Yhdistän teknisen toteutuksen ja asiakkaan näkökulman — vahva pohja myös konsultointiin.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">04 / INTEGRAATIOT JA AI</p>
          <h2 className="aboutCardTitle">
            Yhdistän järjestelmät ja <span className="yellowText pulsingText">sujuvoitan työtä.</span>
          </h2>
          <p>
            Rakennan API-integraatioita ja automatisoin toistuvia prosesseja. Hyödynnän AI:ta, kun
            siitä on konkreettista apua datalle, työkaluille tai työnkuluille.
          </p>
          <p>
            Tavoitteena ei ole hype, vaan ratkaisu, joka helpottaa arkea.
          </p>
        </>,
      ]
    : [
        <>
          <p className="aboutCardEyebrow">01 / FULL STACK</p>
          <h2 className="aboutCardTitle">
            From the interface to the <span className="yellowText pulsingText">backend</span>
          </h2>
          <p>
            I build complete web solutions: user interfaces, APIs, backend services, and data
            workflows.
          </p>
          <p>
            My goal is to constantly deepen my skillset and toolkit. I love a good challenge, which also enables me to learn incredibly fast.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">02 / BUSINESS UNDERSTANDING</p>
          <h2 className="aboutCardTitle">
            Good software starts with <span className="yellowText pulsingText">a real need</span>
          </h2>
          <p>
            I understand customer needs, day-to-day workflows, and business goals. That helps me
            build solutions that work technically and make a real difference.
          </p>
          <p>
            Before choosing how to build, I want to understand why the solution is needed.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">03 / SALES & COMMUNICATION</p>
          <h2 className="aboutCardTitle">
            I listen first — then <span className="yellowText pulsingText">make the value clear.</span>
          </h2>
          <p>
            My sales and customer-facing experience has taught me to ask good questions, spot needs,
            and explain solutions in plain language.
          </p>
          <p>
            I connect the technical work to the customer’s perspective — a strong fit for consulting,
            too.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">04 / INTEGRATIONS & AI</p>
          <h2 className="aboutCardTitle">
            I connect systems and <span className="yellowText pulsingText">make work flow.</span>
          </h2>
          <p>
            I build API integrations and automate repetitive workflows. I use AI where it can make a
            practical difference to data, tools, or the way people work.
          </p>
          <p>
            The goal isn’t hype. It’s a solution that makes someone’s work easier.
          </p>
        </>,
      ];

  return (
    <>
      <h1 className="sectionTitle" id="aboutPageTitle" tabIndex={-1}>
        {isFinnish ? "Minusta" : "About me"}
      </h1>
      <section className="aboutIntro" aria-label={isFinnish ? "Esittely" : "Introduction"}>
        <div className="aboutIntroPortraitFrame">
          <img
            src="/assets/images/profilephoto-fullsize-png.png"
            alt="Juho M. Hiltunen"
            width="320"
            height="320"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="aboutIntroCopy">
          <h2 className="aboutIntroName">Juho Hiltunen</h2>
          <p className="aboutIntroEyebrow">SOFTWARE DEVELOPER</p>
          <blockquote className="aboutIntroQuote">
            {isFinnish ? (
              <>
                <p>
                  Olen full stack -kehittäjä ja rakennan ohjelmistoja, automaatioita, integraatioita
                  ja sovelluksia.
                </p>
                <p>
                  Periksiantamaton asenteeni, nopea oppimis- ja sopeutumiskykyni sekä vahva
                  sotilas- ja myyntitaustani tekevät minusta potentiaalisen ja toimeen tarttuvan
                  tekijän teknologia-alalle.
                </p>
                <p>
                  Tuon mukanani korkeat laatustandardit, vahvan työmoraalin ja vuorovaikutustaidot,
                  joilla ideat muuttuvat tuloksiksi.
                </p>
                <p>Tervetuloa portfoliooni!</p>
              </>
            ) : (
              <>
                <p>
                  I'm a full-stack developer building software, automations, integrations, and apps.
                </p>
                <p>
                  My never-quit mindset, ability to learn and adapt fast, and strong military and
                  sales background make me a high-potential, action-oriented contributor in tech.
                </p>
                <p>
                  I bring high standards, a strong work ethic, and the people skills to turn ideas
                  into results.
                </p>
                <p>Welcome to my portfolio!</p>
              </>
            )}
            <footer>— J.H.</footer>
          </blockquote>
        </div>
      </section>
      <CardCarousel
        id="aboutCarousel"
        label={isFinnish ? "Minusta kertovat kortit" : "About me cards"}
        cards={aboutCards}
      />
      <section className="techStackSection sectionContainer" aria-labelledby="techStackTitle">
        <h2 className="techStackTitle" id="techStackTitle">Tech Stack</h2>
        <p className="techStackDescription">
          {isFinnish
            ? "Käytännön työkaluni web-kehitykseen, integraatioihin, automaatioon ja AI-ratkaisuihin."
            : "My hands-on toolkit for web development, integrations, automation, and applied AI."}
        </p>
        <h3 className="techStackSubtitle">
          {isFinnish ? "Nykyinen stack" : "Current stack"}
        </h3>
        <div className="techStackGroups">
          {(Object.keys(techStackCategoryLabels) as TechStackCategory[]).map((category) => (
            <section className="techStackGroup" key={category}>
              <h4>{isFinnish ? techStackCategoryLabels[category].fi : techStackCategoryLabels[category].en}</h4>
              <ul
                className="techBadgeList"
                aria-label={
                  isFinnish
                    ? `${techStackCategoryLabels[category].fi}-teknologiat`
                    : `${techStackCategoryLabels[category].en} technologies`
                }
              >
                {techStackCategories[category].map((technology) => (
                  <li key={technology}>
                    <TechBadge technology={technology} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <a
        className="aboutCvDownload"
        href="/assets/cv-juho-hiltunen.pdf"
        download="Juho-Hiltunen-CV.pdf"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          download
        </span>
        {isFinnish ? "Lataa CV" : "Download CV"}
      </a>
    </>
  );
}
