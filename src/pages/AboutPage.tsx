import { CardCarousel } from "../components/CardCarousel";
import { TechBadge } from "../components/TechBadge";
import { useSitePreferences } from "../sitePreferences";

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
            React, TypeScript, Node.js ja tietokannat ovat osa työkalupakkiani.
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
            React, TypeScript, Node.js, and databases are part of my toolkit.
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
      <h1 className="sectionTitle">{isFinnish ? "Minusta" : "About me"}</h1>
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
        <ul className="techBadgeList" aria-label="Tech Stack">
          {[
            "React",
            "TypeScript",
            "JavaScript",
            "Node.js",
            "Python",
            "SQL",
            "PostgreSQL",
            "Docker",
            "LLM integrations",
            "REST APIs",
            "Swift",
            "SwiftUI",
            "HTML",
            "CSS",
            "CI/CD",
            "Vite",
            "Git",
            "GitHub",
            "npm",
            "JSON",
            "Web APIs",
            "Browser extensions",
            "AI-assisted development",
            "Agentic development",
          ].map((technology) => (
            <li key={technology}>
              <TechBadge technology={technology} />
            </li>
          ))}
        </ul>
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
