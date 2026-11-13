export function Footer() {
  return (
    <footer id="siteFooter">
      <div id="footerMain">
        <div className="footerSection" id="footerRight">
          <p className="footerHeading">CONTACT</p>
          <div className="footerLinks">
            <a href="mailto:juho.m.hiltunen@gmail.com">
              <svg className="footerIcon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V9.435L12 14.19l-6.545-4.755v11.567H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.045 2.337-3.18 3.927-1.994L12 9.38l8.073-5.917C21.663 2.277 24 3.412 24 5.457z" />
              </svg>
              Email
            </a>
            <a href="https://www.linkedin.com/in/hiltunenjuho/" target="_blank" rel="noopener noreferrer">
              <svg className="footerIcon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.6 0 4.265 2.368 4.265 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.987 20.452H3.67V9h3.317v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.728v20.543C0 23.225.792 24 1.771 24h20.451C23.2 24 24 23.225 24 22.271V1.728C24 .774 23.2 0 22.225 0z" />
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/hiltunenjuho" target="_blank" rel="noopener noreferrer">
              <svg className="footerIcon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 .297a12 12 0 0 0-3.79 23.4c.6.112.82-.258.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.304-5.466-1.333-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.007 0c2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.873.12 3.176.77.84 1.234 1.911 1.234 3.221 0 4.61-2.805 5.624-5.476 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.004 12.004 0 0 0 12 .297" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <div className="footerSection" id="footerLeft">
          <p className="footerCopyright">
            © {new Date().getFullYear()} Juho M. Hiltunen. All rights reserved for personal content
            and branding.
          </p>
          <a
            className="footerLicense"
            href="https://github.com/hiltunenjuho/hiltunenjuho.github.io/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Website code licensed under MIT
          </a>
        </div>
        <a className="footerBackToTop" href="#mainHeader">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
