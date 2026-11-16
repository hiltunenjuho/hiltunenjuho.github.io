import type { ReactNode } from "react";
import { CardCarousel } from "../components/CardCarousel";
import { TechBadge } from "../components/TechBadge";
import { useSitePreferences } from "../sitePreferences";

interface ProjectLink {
  label: string;
  href: string;
  icon: string;
}

type TechnologyCategory = "frontend" | "backend" | "other";

type ProjectTechnologies = Record<TechnologyCategory, string[]>;

interface ProjectCardProps {
  title: string;
  eyebrow: string;
  description: string;
  technologies: ProjectTechnologies;
  href: string;
  preview: ReactNode;
  links: ProjectLink[];
}

const technologyCategoryLabels: Record<TechnologyCategory, { fi: string; en: string }> = {
  frontend: { fi: "Frontend", en: "Frontend" },
  backend: { fi: "Backend", en: "Backend" },
  other: { fi: "Muut", en: "Other" },
};

function ProjectCard({
  title,
  eyebrow,
  description,
  technologies,
  href,
  preview,
  links,
}: ProjectCardProps) {
  const { locale } = useSitePreferences();
  const isFinnish = locale === "fi";
  return (
    <article className="projectItem">
      <a
        className="projectCardLink"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isFinnish ? `Avaa ${title}` : `Open ${title}`}
      />
      {preview}
      <div className="projectCopy">
        <h2 className="projectTitle">{title}</h2>
        <p className="projectEyebrow">{eyebrow}</p>
        <p>{description}</p>
        <div className="projectTechGroups">
          {(Object.keys(technologyCategoryLabels) as TechnologyCategory[])
            .filter((category) => technologies[category].length > 0)
            .map((category) => (
              <div className="projectTechGroup" key={category}>
              <h3>
                {isFinnish
                  ? technologyCategoryLabels[category].fi
                  : technologyCategoryLabels[category].en}
              </h3>
                <ul
                  className="projectTechBadges"
                aria-label={
                  isFinnish
                    ? `${technologyCategoryLabels[category].fi}-teknologiat`
                    : `${technologyCategoryLabels[category].en} technologies`
                }
                >
                  {technologies[category].map((technology) => (
                    <li key={technology}>
                      <TechBadge technology={technology} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
        <div className="projectLinks">
          {links.map(({ label, href, icon }) => (
            <a href={href} key={label} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined" aria-hidden="true">
                {icon}
              </span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsPage() {
  const { locale } = useSitePreferences();
  const isFinnish = locale === "fi";
  const projectSlides = isFinnish
    ? [
        <>
          <p className="aboutCardEyebrow">01 / PROJEKTEJA</p>
          <h2 className="aboutCardTitle">
            Täältä löydät <span className="yellowText pulsingText">live demot</span>
          </h2>
          <p>
            Paras ja odotetuin osa porftoliota! Joten, turhat höpinät sikseen.
          </p>
          <p>
            Kokeile demoja, kurkista koodiin ja näe, mitä olen rakentanut. Mukana on valmiita
            sovelluksia ja uusia kokeiluja.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">02 / LISÄÄ ON TULOSSA</p>
          <h2 className="aboutCardTitle">
            Lisää projekteja <span className="yellowText pulsingText">tulossa pian!</span>
          </h2>
          <p>
            Rakennan jatkuvasti lisää, ideoita on valtava määrä! Julkaisen mielenkiintoisia projekteja
            pian, joten pysythän kuulolla!
          </p>
          <p>
            Sitä odotellessa - kokeilitko jo Knowdiumin Blitz-modea?
          </p>
        </>,
      ]
    : [
        <>
          <p className="aboutCardEyebrow">01 / PROJECTS</p>
          <h2 className="aboutCardTitle">
            The corner of <span className="yellowText pulsingText">live demos</span>
          </h2>
          <p>
            The best and sweetest part of a portfolio! So, less talk, more action.
          </p>
          <p>
            Try out the demos, take a look at the code and see, what I've built. Both ready apps and
            new experiments are included.
          </p>
        </>,
        <>
          <p className="aboutCardEyebrow">02 / MORE ON THE WAY</p>
          <h2 className="aboutCardTitle">
            More projects <span className="yellowText pulsingText">coming soon!</span>
          </h2>
          <p>
            I'm constantly building more, there are so many ideas! I will release interesting
            projects soon, so stay tuned!
          </p>
          <p>
            In the meantime - did you try the Blitz mode on Knowdium already?
          </p>
        </>,
      ];

  return (
    <>
      <h1 className="sectionTitle">{isFinnish ? "Projektit" : "Projects"}</h1>
      <CardCarousel
        id="projectsCarousel"
        label={isFinnish ? "Projektien esittelykortit" : "Project intro cards"}
        cards={projectSlides}
      />
      <section className="projectShowcase" aria-label={isFinnish ? "Projektit ja demot" : "Projects and demos"}>
        <ProjectCard
          title="knowdium!"
          eyebrow={isFinnish ? "VERKKOTRIVIAPELI" : "WEB TRIVIA GAME"}
          description={
            isFinnish
              ? "Luo omat tietovisakierroksesi ja pelaa Classic-, Blitz- tai Survival-tilassa."
              : "Create your own trivia rounds and play in Classic, Blitz, or Survival mode."
          }
          technologies={{
            frontend: ["React", "TypeScript", "Vite", "Transformers.js", "Web Workers"],
            backend: ["REST APIs"],
            other: [],
          }}
          href="https://hiltunenjuho.github.io/knowdium/"
          preview={
            <div className="projectPreview" aria-hidden="true">
              <img src="/assets/images/knowdium-home.png" alt="" />
            </div>
          }
          links={[
            {
              label: "Live demo",
              href: "https://hiltunenjuho.github.io/knowdium/",
              icon: "open_in_new",
            },
            {
              label: "GitHub",
              href: "https://github.com/hiltunenjuho/knowdium",
              icon: "code",
            },
          ]}
        />
        <ProjectCard
          title="Pharmacy Finder"
          eyebrow={"WEB APP & iOS APP (SWIFTUI)"}
          description={
            isFinnish
              ? "Löydä lähimmät apteekit, tarkista aukioloajat ja avaa reitti suoraan tuloksista."
              : "Find nearest pharmacies, check opening hours, and get directions straight from the results."
          }
          technologies={{
            frontend: ["React", "TypeScript", "Vite"],
            backend: ["Cloudflare Workers"],
            other: ["Swift", "SwiftUI", "Core Location", "Google Places API", "GitHub Actions"],
          }}
          href="https://hiltunenjuho.github.io/nearest-pharmacy-web/"
          preview={
            <div className="projectPreview projectPreviewSplit" aria-hidden="true">
              <img
                className="projectPreviewDark"
                src="/assets/images/pharmacy-finder-dark.png"
                alt=""
              />
              <img
                className="projectPreviewLight"
                src="/assets/images/pharmacy-finder-light.png"
                alt=""
              />
              <span className="projectPreviewTitle projectPreviewTitlePharmacy">
                Pharmacy Finder
              </span>
            </div>
          }
          links={[
            {
              label: "Live demo",
              href: "https://hiltunenjuho.github.io/nearest-pharmacy-web/",
              icon: "open_in_new",
            },
            {
              label: "GitHub",
              href: "https://github.com/hiltunenjuho/nearest-pharmacy-web",
              icon: "code",
            },
            {
              label: "iOS source",
              href: "https://github.com/hiltunenjuho/nearest-pharmacy-ios",
              icon: "code",
            },
          ]}
        />
        <ProjectCard
          title="Juho Hiltunen"
          eyebrow={isFinnish ? "PORTFOLIOSIVUSTO" : "PORTFOLIO WEBSITE"}
          description={
            isFinnish
              ? "Tämä sivusto esittelee projektini, osaamiseni ja tavat ottaa yhteyttä."
              : "A quick look at my projects, what I do, and how to get in touch."
          }
          technologies={{
            frontend: ["React", "TypeScript", "Vite", "HTML", "CSS"],
            backend: [],
            other: ["GitHub Pages"],
          }}
          href="https://hiltunenjuho.github.io/"
          preview={
            <div className="projectPreview" aria-hidden="true">
              <img src="/assets/images/portfolio-preview.png" alt="" />
              <span className="projectPreviewTitle">Juho Hiltunen</span>
            </div>
          }
          links={[
            {
              label: isFinnish ? "Avaa sivusto" : "Visit site",
              href: "https://hiltunenjuho.github.io/",
              icon: "open_in_new",
            },
            {
              label: "GitHub",
              href: "https://github.com/hiltunenjuho/hiltunenjuho.github.io",
              icon: "code",
            },
          ]}
        />
      </section>
    </>
  );
}
