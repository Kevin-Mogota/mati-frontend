import React, { useState, useEffect } from "react";
import { C, MONO, DISPLAY, BODY } from "./theme";
import { REGIONS, CROPS } from "./data";
import { useBackendStatus, useAdminAuth, useGeoSelection, useAdvisory, useNetworkStatus } from "./hooks";
import { primeCsrfCookie } from "./api";
import { Footer } from "./components/Footer";
import { AuthWall } from "./admin/AuthWall";
import { TabAdmin } from "./admin/TabAdmin";
import { TabAccueil } from "./tabs/TabAccueil";
import { TabAPropos } from "./tabs/TabAPropos";
import { TabDashboard } from "./tabs/TabDashboard";
import { TabGuide } from "./tabs/TabGuide";
import { TabMeteo } from "./tabs/TabMeteo";
import { TabHistorique } from "./tabs/TabHistorique";
import { TabSms } from "./tabs/TabSms";
import { TabIA } from "./tabs/TabIA";
import { TabDiagnostic } from "./tabs/TabDiagnostic";
import { TabForum } from "./tabs/TabForum";
import { TabProfile } from "./tabs/TabProfile";
import { NotificationBell } from "./components/NotificationBell";
import { useNotifications } from "./hooks";
import { LanguageProvider, useLanguage } from "./i18n";
import logoUrl from "./assets/logo.png";

export const TABS = [
  { id: "accueil", label: "Accueil" },
  { id: "dashboard", label: "Tableau de bord" },
  { id: "guide", label: "Guide de culture" },
  { id: "meteo", label: "Météo & Sécheresse" },
  { id: "historique", label: "Historique" },
  { id: "sms", label: "Alertes SMS" },
  { id: "ia", label: "Assistant IA" },
  { id: "apropos", label: "À propos" },
  { id: "diagnostic", label: "Diagnostic photo (IA)" },
  { id: "forum", label: "Forum" },
  { id: "admin", label: "Admin" },
];

/* ----------------------------------------------------------------------------
   Hero carousel — illustrated (SVG/CSS), auto-advancing scenes representing
   drone field monitoring, AI crop analysis, sensors, and weather tracking.
   Note: these are animated illustrations, not AI-generated video footage —
   see the assistant's message for why, and what it would take to use real
   drone/field video instead.
---------------------------------------------------------------------------- */

function AppInner() {
  const [tab, setTab] = useState("accueil");
  const { lang, setLang, t } = useLanguage();

  const backendStatus = useBackendStatus();
  useEffect(() => { primeCsrfCookie(); }, []);
  const online = useNetworkStatus();
  const auth = useAdminAuth();
  const geo = useGeoSelection(backendStatus);
  const { region, setRegion, crop, setCrop, country, setCountry, countries, regionsList, cropsList, addCountry, provisioning, provisionError } = geo;
  const advice = useAdvisory(region, crop, backendStatus);
  const notifications = useNotifications(auth.user);
  const [newCountryInput, setNewCountryInput] = useState("");
  const today = new Date();
  const dateLabel = today.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  // Accounts are mandatory once the backend is actually reachable. In this Claude.ai
  // preview the backend can't be reached, so we show a clearly-labeled demo bypass
  // instead of a permanent, unusable login wall.
  if (backendStatus === "connected" && auth.checked && !auth.user) {
    return (
      <div style={{ fontFamily: BODY, background: C.bg, minHeight: "100%", padding: "60px 20px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Work+Sans:wght@400;500;600;700&display=swap');`}</style>
        <AuthWall auth={auth} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: BODY, background: C.bg, color: C.ink, minHeight: "100%" }}>
      {backendStatus !== "connected" && (
        <div style={{ background: C.orangeTint, color: C.orangeDeep, fontFamily: MONO, fontSize: 11.5, textAlign: "center", padding: "6px 10px" }}>
        </div>
      )}
      {!online && (
        <div style={{ background: C.navy, color: "#fff", fontFamily: MONO, fontSize: 11.5, textAlign: "center", padding: "6px 10px" }}>
          Hors ligne — vous consultez le guide de culture et le dernier conseil en cache. Certaines fonctionnalités (chat, diagnostic photo, forum) nécessitent une connexion.
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .mati-select {
          appearance: none;
          background: ${C.bgAlt};
          border: 1.5px solid ${C.border};
          color: ${C.ink};
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 9px 34px 9px 14px;
          border-radius: 8px;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2316283F' stroke-width='1.6' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .mati-tab {
          background: transparent; border: none; cursor: pointer;
          font-family: 'Work Sans', sans-serif; font-weight: 600; font-size: 13.5px;
          padding: 9px 14px; border-radius: 8px; color: ${C.inkDim}; white-space: nowrap;
        }
        .mati-tab.active { background: ${C.navy}; color: #fff; }
        ::placeholder { color: ${C.inkDim}; }
        input:focus { border-color: ${C.green} !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, " + C.navy + ", " + C.navyDeep + ")", padding: "22px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={logoUrl} alt="Mogota Agri-Tech Innovation" style={{ height: 56, width: 56, objectFit: "contain", background: "#fff", borderRadius: 10, padding: 4 }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.green, marginBottom: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
                {t("appName")}
              </div>
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, margin: 0, lineHeight: 1.05, color: "#fff" }}>
                {t("tagline")}
              </h1>
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: "#B9C3D2", textAlign: "right", display: "flex", alignItems: "center", gap: 14 }}>
            <span>{dateLabel}</span>
            <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} style={{
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff",
              fontFamily: MONO, fontSize: 12, fontWeight: 700, padding: "7px 10px", cursor: "pointer",
            }}>{lang === "fr" ? "FR / EN" : "EN / FR"}</button>
            {auth.user && <NotificationBell notifications={notifications} />}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 32px 40px" }}>

        {/* Controls */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 10, alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.inkDim }}>
            {t("country")}
            <select className="mati-select" value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.inkDim }}>
            {t("region")}
            <select className="mati-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              {regionsList.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.inkDim }}>
            {t("crop")}
            <select className="mati-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
              {cropsList.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <div style={{ fontSize: 13, color: C.inkDim, paddingBottom: 9 }}>
            {REGIONS[region] ? (REGIONS[region].zone + " · Sol " + REGIONS[region].soil.toLowerCase()) : "Région personnalisée"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <input
            placeholder="Votre pays n'est pas dans la liste ? Tapez-le ici…"
            value={newCountryInput}
            onChange={(e) => setNewCountryInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && newCountryInput.trim()) { addCountry(newCountryInput); setNewCountryInput(""); } }}
            style={{ flex: 1, minWidth: 220, padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, fontFamily: BODY }}
          />
          <button
            onClick={() => { if (newCountryInput.trim()) { addCountry(newCountryInput); setNewCountryInput(""); } }}
            disabled={provisioning}
            style={{ background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 12.5, cursor: "pointer", opacity: provisioning ? 0.6 : 1 }}
          >{provisioning ? "Configuration en cours (IA)…" : "Configurer ce pays"}</button>
        </div>
        {provisionError && <div style={{ fontSize: 12, color: C.orangeDeep, marginTop: -12, marginBottom: 20 }}>{provisionError}</div>}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, overflowX: "auto", background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 5 }}>
          {TABS.map(tabItem => (
            <button key={tabItem.id} className={"mati-tab" + (tab === tabItem.id ? " active" : "")} onClick={() => setTab(tabItem.id)}>
              {t("tab_" + tabItem.id) !== "tab_" + tabItem.id ? t("tab_" + tabItem.id) : tabItem.label}
            </button>
          ))}
          <button className={"mati-tab" + (tab === "profile" ? " active" : "")} onClick={() => setTab("profile")}>
            {auth.user ? t("tab_profile") : t("login")}
          </button>
        </div>

        {tab === "accueil" && <TabAccueil setTab={setTab} />}
        {tab === "dashboard" && <TabDashboard region={region} crop={crop} advice={advice} auth={auth} />}
        {tab === "guide" && <TabGuide crop={crop} />}
        {tab === "meteo" && <TabMeteo region={region} advice={advice} />}
        {tab === "historique" && <TabHistorique region={region} />}
        {tab === "sms" && <TabSms region={region} crop={crop} advice={advice} auth={auth} />}
        {tab === "ia" && <TabIA region={region} crop={crop} advice={advice} />}
        {tab === "apropos" && <TabAPropos />}
        {tab === "diagnostic" && <TabDiagnostic region={region} crop={crop} />}
        {tab === "forum" && <TabForum />}
        {tab === "profile" && (auth.user ? <TabProfile auth={auth} /> : <AuthWall auth={auth} />)}
        {tab === "admin" && <TabAdmin auth={auth} />}

        <div style={{ fontSize: 12, color: C.inkDim, marginTop: 22, lineHeight: 1.6 }}>
          Mogota Agri-Tech Innovation. Météo, sécheresse, historique et guide de culture : valeurs indicatives à partir de
          profils climatiques et agronomiques régionaux types. SMS/WhatsApp : fonctionnel une fois la passerelle configurée
          côté serveur. Assistant IA : réponses générées en direct par Claude.
        </div>

        <Footer/>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
