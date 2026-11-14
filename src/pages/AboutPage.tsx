import { CardCarousel } from "../components/CardCarousel";

const aboutCards = [
  <>
    <p className="aboutCardEyebrow">01 / MY PATH</p>
    <h2 className="aboutCardTitle">
      A <span className="yellowText pulsingText">non-traditional path</span> into software
    </h2>
    <p>
      I came to software development through practical problem-solving. In business workflows, I saw
      repeated tasks, scattered information, and interfaces that made simple work harder than it
      needed to be.
    </p>
    <p>
      That led me to build tools and integrations that remove friction and make information easier
      to use. Seeing those changes help people do their work better turned a long-standing interest
      into a clear career goal.
    </p>
  </>,
  <>
    <p className="aboutCardEyebrow">02 / WHAT DRIVES ME</p>
    <h2 className="aboutCardTitle">
      Software is <span className="yellowText pulsingText">problem-solving</span> and craft
    </h2>
    <p>
      Software development brings structured problem-solving and creativity together. I enjoy taking
      an idea from the first question to a useful, working product - and learning along the way.
    </p>
  </>,
  <>
    <p className="aboutCardEyebrow">03 / HOW I WORK</p>
    <h2 className="aboutCardTitle">
      Start with the <span className="yellowText pulsingText">real problem</span>
    </h2>
    <p>
      I start by understanding how people work and where a process becomes unclear or repetitive.
      From there, I build a focused solution around the people who will use it.
    </p>
    <p>
      I care about making useful information easier to find, reducing repetitive steps, and improving
      the experience - not just choosing a technology.
    </p>
  </>,
  <>
    <p className="aboutCardEyebrow">04 / THE GOAL</p>
    <h2 className="aboutCardTitle">
      Building toward <span className="yellowText pulsingText">what's next</span>
    </h2>
    <p>
      I'm looking for a software development role where I can contribute, keep learning, and build
      products people rely on.
    </p>
    <p>
      I'm continuing to deepen my practical skills, with particular interest in useful web apps,
      integrations, and thoughtful applications of AI.
    </p>
  </>,
];

export function AboutPage() {
  return (
    <>
      <h1 className="sectionTitle">
        About me
      </h1>
      <CardCarousel id="aboutCarousel" label="About Juho" cards={aboutCards} />
      <a
        className="aboutCvDownload"
        href="/assets/cv-juho-hiltunen.pdf"
        download="Juho-Hiltunen-CV.pdf"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          download
        </span>
        Download CV
      </a>
    </>
  );
}
