<p align="center">
  <img src="public/assets/images/android-chrome-512x512.png" alt="Juho Hiltunen logo" width="112">
</p>

<h1 align="center">Juho M. Hiltunen</h1>

<p align="center">
  Software developer · product-minded builder · problem solver<br>
  <a href="https://hiltunenjuho.github.io/"><strong>Visit the live portfolio</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-149ECA?style=flat&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=flat&logo=githubpages&logoColor=white" alt="Hosted on GitHub Pages">
</p>

## About

This portfolio presents selected software projects, my approach to problem-solving, and ways to get in touch. It is built as a small React and TypeScript application, with reusable components for navigation, content panels, project cards, and carousels. The header includes a branded app switcher for this portfolio and Pharmacy Finder's live web demo; Knowdium is clearly marked as coming soon.

## Selected work

- **[Pharmacy Finder](https://hiltunenjuho.github.io/nearest-pharmacy-web/):** a live web demo for finding nearby pharmacies, checking available opening information, and planning a route. The project also includes a SwiftUI package for an iOS host app: [web source](https://github.com/hiltunenjuho/nearest-pharmacy-web) · [iOS package](https://github.com/hiltunenjuho/nearest-pharmacy-ios).
- **[Portfolio](https://hiltunenjuho.github.io/):** an interactive site for selected work and background, with source in the [portfolio repository](https://github.com/hiltunenjuho/hiltunenjuho.github.io).
- **[Knowdium](https://github.com/hiltunenjuho/knowdium):** a game-first multiple-choice trivia prototype in development; its live demo is coming soon.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

## Deployment

The GitHub Actions workflow builds the app and publishes the `dist` directory to GitHub Pages when changes are pushed to `main`. Set the repository's Pages source to **GitHub Actions** to enable the workflow.

## License

The website source code is licensed under the [MIT License](./LICENSE). Personal content and branding are not included.
