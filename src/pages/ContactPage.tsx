import type { FormEvent } from "react";
import { useSitePreferences } from "../sitePreferences";

function prepareEmail(event: FormEvent<HTMLFormElement>, isFinnish: boolean) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const subject = `${isFinnish ? "Viesti portfolion kautta" : "Portfolio message from"} ${formData.get("name")}`;
  const body = [
    `${isFinnish ? "Nimi" : "Name"}: ${formData.get("name")}`,
    `${isFinnish ? "Sähköposti" : "Email"}: ${formData.get("email")}`,
    "",
    `${isFinnish ? "Viesti" : "Message"}:`,
    formData.get("message"),
  ].join("\n");

  window.location.href =
    "mailto:juho.m.hiltunen@gmail.com" +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}

export function ContactPage() {
  const { locale } = useSitePreferences();
  const isFinnish = locale === "fi";
  return (
    <>
      <h1 className="sectionTitle">{isFinnish ? "Ota yhteyttä" : "Get in touch"}</h1>
      <div className="sectionContainer contactCard">
        <h2 className="aboutCardTitle">
          {isFinnish ? "Onko mielessäsi " : "Have an idea or project? "}
          <span className="yellowText pulsingText">{isFinnish ? "idea tai projekti?" : "Let’s talk."}</span>
        </h2>
        <div className="contactLinks" aria-label={isFinnish ? "Ota yhteyttä suoraan" : "Contact me directly"}>
          <a className="contactLink" href="mailto:juho.m.hiltunen@gmail.com">
            <span className="material-symbols-outlined" aria-hidden="true">
              mail
            </span>
            <span>
              {isFinnish ? "Sähköposti" : "Email"} <small>juho.m.hiltunen@gmail.com</small>
            </span>
          </a>
          <a
            className="contactLink"
            href="https://www.linkedin.com/in/hiltunenjuho/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isFinnish ? "Avaa LinkedIn-profiili uudessa välilehdessä" : "Open LinkedIn profile in a new tab"}
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
            aria-label={isFinnish ? "Avaa GitHub-profiili uudessa välilehdessä" : "Open GitHub profile in a new tab"}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              code
            </span>
            <span>
              GitHub <small>github.com/hiltunenjuho</small>
            </span>
          </a>
        </div>
        <form
          className="contactForm"
          id="contactForm"
          aria-describedby="contactFormNote"
          onSubmit={(event) => prepareEmail(event, isFinnish)}
        >
          <p className="contactFormNote" id="contactFormNote">
            {isFinnish
              ? "Lähetys avaa sähköpostisovelluksesi valmiilla viestillä. Voit tarkistaa sen ennen lähettämistä."
              : "This opens your email app with a draft ready to review and send."}
          </p>
          <label htmlFor="contactName">{isFinnish ? "Nimi" : "Name"}</label>
          <input id="contactName" name="name" type="text" autoComplete="name" required />
          <label htmlFor="contactEmail">{isFinnish ? "Sähköposti" : "Email"}</label>
          <input id="contactEmail" name="email" type="email" autoComplete="email" required />
          <label htmlFor="contactMessage">{isFinnish ? "Viesti" : "Message"}</label>
          <textarea id="contactMessage" name="message" rows={5} required />
          <button className="contactSubmit" type="submit">
            {isFinnish ? "Avaa viesti sähköpostissa" : "Open email draft"}
          </button>
        </form>
      </div>
    </>
  );
}
