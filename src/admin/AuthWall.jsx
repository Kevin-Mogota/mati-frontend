import React, { useState } from "react";
import { C, DISPLAY, BODY } from "../theme";

export function AuthWall({ auth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [fields, setFields] = useState({ username: "", password: "", email: "", country: "Tchad" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") await auth.login(fields.username, fields.password);
      else await auth.register(fields);
    } catch (e2) {
      setError(mode === "login" ? "Identifiants invalides." : "Échec de l'inscription (nom déjà pris ou mot de passe trop simple).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: C.navy }}>Mogota Agri-Tech Innovation</div>
        <div style={{ fontSize: 13, color: C.inkDim, marginTop: 4 }}>Un compte est nécessaire pour accéder à la plateforme.</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, justifyContent: "center" }}>
        <button onClick={() => setMode("login")} style={{ background: mode === "login" ? C.navy : "transparent", color: mode === "login" ? "#fff" : C.ink, border: "1px solid " + C.navy, borderRadius: 8, padding: "7px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Connexion</button>
        <button onClick={() => setMode("register")} style={{ background: mode === "register" ? C.navy : "transparent", color: mode === "register" ? "#fff" : C.ink, border: "1px solid " + C.navy, borderRadius: 8, padding: "7px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Créer un compte</button>
      </div>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, background: C.bg, border: "1px solid " + C.border, borderRadius: 14, padding: 20 }}>
        <input placeholder="Nom d'utilisateur" value={fields.username} onChange={e => setFields({ ...fields, username: e.target.value })}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 14 }} />
        {mode === "register" && (
          <input placeholder="Email (optionnel)" value={fields.email} onChange={e => setFields({ ...fields, email: e.target.value })}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 14 }} />
        )}
        <input placeholder="Mot de passe" type="password" value={fields.password} onChange={e => setFields({ ...fields, password: e.target.value })}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 14 }} />
        {mode === "register" && (
          <input placeholder="Pays (ex : Tchad)" value={fields.country} onChange={e => setFields({ ...fields, country: e.target.value })}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 14 }} />
        )}
        {error && <div style={{ color: C.orangeDeep, fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{
          background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px",
          fontFamily: BODY, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: loading ? 0.6 : 1,
        }}>{loading ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
      </form>
    </div>
  );
}

