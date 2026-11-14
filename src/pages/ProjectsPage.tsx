import type { ReactNode } from "react";
import { CardCarousel } from "../components/CardCarousel";

interface ProjectLink {
  label: string;
  href: string;
  icon: string;
}

interface ProjectCardProps {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  preview: ReactNode;
  links: ProjectLink[];
}

function ProjectCard({ title, eyebrow, description, href, preview, links }: ProjectCardProps) {
  return (
    <article className="projectItem">
      <a
        className="projectCardLink"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title}`}
      />
      {preview}
      <div className="projectCopy">
        <h2 className="projectTitle">{title}</h2>
        <p className="projectEyebrow">{eyebrow}</p>
        <p>{description}</p>
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

const projectSlides = [
  <>
    <p className="aboutCardEyebrow">01 / SELECTED WORK</p>
    <h2 className="aboutCardTitle">
      Software built to make work <span className="yellowText pulsingText">easier</span>
    </h2>
    <p>
      A selection of practical software, product experiments, and ideas in progress. Explore the
      live demos and the code behind them.
    </p>
  </>,
  <>
    <p className="aboutCardEyebrow">02 / PLAY AND EXPLORE</p>
    <h2 className="aboutCardTitle">
      A trivia game for <span className="yellowText pulsingText">curious minds</span>
    </h2>
    <p>
      Knowdium brings quick trivia rounds, multiple game modes, and three interface languages
      together in a playable web app.
    </p>
  </>,
];

export function ProjectsPage() {
  return (
    <>
      <h1 className="sectionTitle">
        Selected projects
      </h1>
      <CardCarousel id="projectsCarousel" label="Projects" cards={projectSlides} />
      <section className="projectShowcase" aria-label="Selected projects">
        <ProjectCard
          title="Pharmacy Finder"
          eyebrow="WEB DEMO · iOS SWIFTUI PACKAGE"
          description="Find nearby pharmacies, check live opening hours, and plan a route directly from the results."
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
          eyebrow="PERSONAL PORTFOLIO (THIS SITE)"
          description="An interactive portfolio for selected work, background, and ways to get in touch."
          href="https://hiltunenjuho.github.io/"
          preview={
            <div className="projectPreview" aria-hidden="true">
              <img src="/assets/images/portfolio-preview.png" alt="" />
              <span className="projectPreviewTitle">Juho Hiltunen</span>
            </div>
          }
          links={[
            {
              label: "Live site",
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
        <ProjectCard
          title="knowdium!"
          eyebrow="WEB TRIVIA GAME"
          description="Play customizable trivia rounds in Classic, Blitz, or Survival mode."
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
      </section>
    </>
  );
}
