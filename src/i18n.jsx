import React, { createContext, useContext, useState } from "react";

// Central translation dictionary. Pattern for adding new strings anywhere in the
// app: add the key here in both languages, then use t('yourKey') in the component
// instead of hardcoding the French text. Only the top-level chrome (nav, header,
// footer, auth) is fully wired as of this pass — extending coverage to every tab
// is a mechanical follow-up: swap each hardcoded string for t('key').
const STRINGS = {
  fr: {
    appName: "Mogota Agri-Tech Innovation",
    tagline: "Plateforme de conseil agro-climatique",
    tab_accueil: "Accueil",
    tab_dashboard: "Tableau de bord",
    tab_guide: "Guide de culture",
    tab_meteo: "Météo & Sécheresse",
    tab_historique: "Historique",
    tab_sms: "Alertes SMS",
    tab_ia: "Assistant IA",
    tab_diagnostic: "Diagnostic photo (IA)",
    tab_forum: "Forum",
    tab_apropos: "À propos",
    tab_profile: "Mon profil",
    tab_admin: "Admin",
    country: "Pays",
    region: "Région",
    crop: "Culture",
    login: "Connexion",
    register: "Créer un compte",
    logout: "Déconnexion",
    demoMode: "Mode démonstration — backend non joignable dans cet aperçu, compte non requis ici (obligatoire une fois le backend lancé)",
    accountRequired: "Un compte est nécessaire pour accéder à la plateforme.",
    notifications: "Notifications",
    markAllRead: "Tout marquer comme lu",
    noNotifications: "Aucune notification.",
    footerContact: "Contact",
    footerNewsletter: "Newsletter",
    subscribe: "S'inscrire",
  },
  en: {
    appName: "Mogota Agri-Tech Innovation",
    tagline: "Agro-climate advisory platform",
    tab_accueil: "Home",
    tab_dashboard: "Dashboard",
    tab_guide: "Growing Guide",
    tab_meteo: "Weather & Drought",
    tab_historique: "History",
    tab_sms: "SMS Alerts",
    tab_ia: "AI Assistant",
    tab_diagnostic: "Photo Diagnosis (AI)",
    tab_forum: "Forum",
    tab_apropos: "About",
    tab_profile: "My profile",
    tab_admin: "Admin",
    country: "Country",
    region: "Region",
    crop: "Crop",
    login: "Log in",
    register: "Create account",
    logout: "Log out",
    demoMode: "Demo mode — backend unreachable in this preview, no account required here (mandatory once the backend is running)",
    accountRequired: "An account is required to access the platform.",
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No notifications.",
    footerContact: "Contact",
    footerNewsletter: "Newsletter",
    subscribe: "Subscribe",
  },
};

const LanguageContext = createContext({ lang: "fr", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const browserLang = (navigator.language || "fr").slice(0, 2);
    return STRINGS[browserLang] ? browserLang : "fr";
  });

  const t = (key) => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.fr[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
