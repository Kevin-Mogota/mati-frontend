import React, { useState } from "react";
import { C, MONO, DISPLAY, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { AdminStats } from "./AdminStats";
import { AdminNews, AdminEvents, AdminContent } from "./AdminContentManagement";
import { AdminGuideAI, AdminRegionsAI, AdminCropsAI, AdminAdvisoryAI } from "./AdminAIAssist";
import { AdminPartners, AdminTeam, AdminHeroMedia, AdminUsers } from "./AdminHomepageContent";

export function AdminLoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(username, password);
    } catch (e) {
      setError("Identifiants invalides, ou backend non joignable depuis cet aperçu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel style={{ maxWidth: 380, margin: "0 auto" }}>
      <SectionTitle>Connexion administrateur</SectionTitle>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 14 }} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 14 }} />
        {error && <div style={{ color: C.orangeDeep, fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{
          background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px",
          fontFamily: BODY, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: loading ? 0.6 : 1,
        }}>{loading ? "Connexion…" : "Se connecter"}</button>
      </form>
      <div style={{ fontSize: 12, color: C.inkDim, marginTop: 14, lineHeight: 1.5 }}>
        Compte créé côté Django via <code>python manage.py createsuperuser</code>. Cette connexion appelle
        <code> /api/auth/login/</code> — dans cet aperçu Claude.ai, le backend local n'est pas joignable, donc la
        connexion échouera ici mais fonctionnera une fois le projet lancé sur votre machine.
      </div>
    </Panel>
  );
}


export function AdminSubNav({ sub, setSub }) {
  const items = [
    ["stats", "Statistiques"], ["users", "Comptes utilisateurs"],
    ["news", "Actualités"], ["events", "Événements"], ["content", "À propos / Mission"],
    ["partners", "Partenaires"], ["team", "Membres"], ["hero", "Accueil (bandeau)"],
    ["guide", "Guide de culture (IA)"], ["regions", "Pays & Régions (IA)"], ["crops", "Cultures (IA)"], ["advisory", "Conseil du jour (IA)"],
  ];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
      {items.map(([id, label]) => (
        <button key={id} onClick={() => setSub(id)} style={{
          background: sub === id ? C.navy : C.bgAlt, color: sub === id ? "#fff" : C.ink,
          border: "1px solid " + (sub === id ? C.navy : C.border), borderRadius: 999,
          padding: "6px 14px", fontFamily: BODY, fontWeight: 600, fontSize: 12.5, cursor: "pointer",
        }}>{label}</button>
      ))}
    </div>
  );
}


export function TabAdmin({ auth }) {
  const [sub, setSub] = useState("stats");
  if (!auth.checked) return <Panel><div style={{ fontSize: 13, color: C.inkDim }}>Vérification de la session…</div></Panel>;
  if (!auth.user) return <AdminLoginForm onLogin={auth.login} />;
  if (!auth.user.isStaff) {
    return (
      <Panel>
        <SectionTitle>Accès administrateur requis</SectionTitle>
        <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.6 }}>
          Votre compte ({auth.user.username}) n'a pas les droits administrateur. Utilisez un compte créé avec
          <code> python manage.py createsuperuser</code> pour accéder à cette section.
        </div>
      </Panel>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.inkDim }}>Connecté en tant que <strong style={{ color: C.navy }}>{auth.user.username}</strong> (admin)</div>
        <button onClick={auth.logout} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 8, padding: "6px 12px", fontFamily: BODY, fontSize: 12.5, cursor: "pointer", color: C.inkDim }}>Déconnexion</button>
      </div>
      <AdminSubNav sub={sub} setSub={setSub} />
      {sub === "stats" && <AdminStats />}
      {sub === "users" && <AdminUsers />}
      {sub === "news" && <AdminNews />}
      {sub === "events" && <AdminEvents />}
      {sub === "content" && <AdminContent />}
      {sub === "partners" && <AdminPartners />}
      {sub === "team" && <AdminTeam />}
      {sub === "hero" && <AdminHeroMedia />}
      {sub === "guide" && <AdminGuideAI />}
      {sub === "regions" && <AdminRegionsAI />}
      {sub === "crops" && <AdminCropsAI />}
      {sub === "advisory" && <AdminAdvisoryAI />}
    </div>
  );
}

