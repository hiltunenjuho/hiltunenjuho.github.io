import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TechBadgeTooltipProvider } from "./components/TechBadgeTooltipContext";
import "../styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Portfolio root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <TechBadgeTooltipProvider>
      <App />
    </TechBadgeTooltipProvider>
  </StrictMode>,
);
