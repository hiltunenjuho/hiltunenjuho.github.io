import type { FormEvent } from "react";

function prepareEmail(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const subject = `Website contact from ${formData.get("name")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    "",
    "Message:",
    formData.get("message"),
  ].join("\n");

  window.location.href =
    "mailto:juho.m.hiltunen@gmail.com" +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}

export function ContactPage() {
  return (
    <>
      <h1 className="sectionTitle">
        Get in touch
      </h1>
      <div className="sectionContainer contactCard">
        <h2 className="aboutCardTitle">
          Let's start a <span className="yellowText pulsingText">conversation</span>
        </h2>
        <div className="contactLinks" aria-label="Contact links">
          <a className="contactLink" href="mailto:juho.m.hiltunen@gmail.com">
            <span className="material-symbols-outlined" aria-hidden="true">
              mail
            </span>
            <span>
              Email <small>juho.m.hiltunen@gmail.com</small>
            </span>
          </a>
          <a
            className="contactLink"
            href="https://www.linkedin.com/in/hiltunenjuho/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Juho's LinkedIn profile in a new tab"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              link
            </span>
            <span>
              LinkedIn <small>linkedin.com/in/hiltunenjuho</small>
            </span>
          </a>
          <a
            className="contactLink"
            href="https://github.com/hiltunenjuho"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Juho's GitHub profile in a new tab"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              code
            </span>
            <span>
              GitHub <small>github.com/hiltunenjuho</small>
            </span>
          </a>
        </div>
        <form className="contactForm" id="contactForm" aria-describedby="contactFormNote" onSubmit={prepareEmail}>
          <p className="contactFormNote" id="contactFormNote">
            Submitting this form opens your email app with the message ready for you to review and
            send.
          </p>
          <label htmlFor="contactName">Your name</label>
          <input id="contactName" name="name" type="text" autoComplete="name" required />
          <label htmlFor="contactEmail">Your email</label>
          <input id="contactEmail" name="email" type="email" autoComplete="email" required />
          <label htmlFor="contactMessage">Message</label>
          <textarea id="contactMessage" name="message" rows={5} required />
          <button className="contactSubmit" type="submit">
            Prepare email
          </button>
        </form>
      </div>
    </>
  );
}
