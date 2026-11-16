import { createContext, useContext } from "react";

export type Locale = "en" | "fi";

export interface SitePreferences {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const SitePreferencesContext = createContext<SitePreferences | null>(null);

export function useSitePreferences(): SitePreferences {
  const preferences = useContext(SitePreferencesContext);
  if (!preferences) {
    throw new Error("Site preferences are not available outside the application.");
  }
  return preferences;
}
