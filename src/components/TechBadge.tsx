import type { CSSProperties } from "react";

const technologyColors: Record<string, string> = {
  "AI-assisted development": "#A371F7",
  "Agentic development": "#A371F7",
  "Browser extensions": "#00A8E8",
  "Cloudflare Workers": "#F38020",
  "Core Location": "#F05138",
  "CSS": "#1572B6",
  "CI/CD": "#2088FF",
  "DOM": "#7D8590",
  "Docker": "#2496ED",
  "Git": "#F05032",
  "GitHub": "#F0F6FC",
  "GitHub Actions": "#2088FF",
  "GitHub Pages": "#F0F6FC",
  "Google Places API": "#4285F4",
  "HTML": "#E34F26",
  "Integrations": "#8B949E",
  "JavaScript": "#F7DF1E",
  "JSON": "#8BC34A",
  "LLM integrations": "#A371F7",
  "Node.js": "#5FA04E",
  "npm": "#CB3837",
  "PostgreSQL": "#4169E1",
  "Python": "#3776AB",
  "React": "#61DAFB",
  "REST APIs": "#26A69A",
  "SQL": "#F29111",
  "Swift": "#F05138",
  "SwiftUI": "#F05138",
  "Transformers.js": "#FFD21E",
  "TypeScript": "#3178C6",
  "Vite": "#646CFF",
  "Web APIs": "#0B8EC7",
  "Web Workers": "#7D8590",
  "Workflow automation": "#B778D3",
};

interface TechBadgeProps {
  technology: string;
  compact?: boolean;
}

type TechBadgeStyle = CSSProperties & { "--tech-color": string };

export function TechBadge({ technology, compact = false }: TechBadgeProps) {
  const style: TechBadgeStyle = {
    "--tech-color": technologyColors[technology] ?? "#8B949E",
  };

  return (
    <span className={`techBadge${compact ? " techBadgeCompact" : ""}`} style={style}>
      {technology}
    </span>
  );
}
