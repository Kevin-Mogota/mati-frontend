import React, { useState } from "react";
import { C, MONO, DISPLAY, BODY } from "../theme";
import { apiPost } from "../api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const subscribe = async () => {
    if (!email.trim()) return;
    try {
      await apiPost("/api/newsletter/", { email });
      setStatus("Merci, vous êtes inscrit(e) !");
      setEmail("");
    } catch (e) {
      setStatus("Backend non joignable dans cet aperçu — fonctionnera une fois le projet lancé.");
    }
  };

  return (
    <div style={{ background: C.navy, color: "#fff", marginTop: 32, borderRadius: 16, padding: "28px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 24 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Mogota Agri-Tech Innovation</div>
          <div style={{ fontSize: 13, color: "#B9C3D2", lineHeight: 1.6 }}>Conseil agro-climatique pour les producteurs tchadiens.</div>
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.greenSoft || C.green, marginBottom: 8 }}>Contact</div>
          <div style={{ fontSize: 13, color: "#B9C3D2", lineHeight: 1.8 }}>
            mogota.agritech@gmail.com<br/>
            Tchad<br/>
            Téléphone : à compléter
          </div>
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.green, marginBottom: 8 }}>Newsletter</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input placeholder="Votre email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "none", fontSize: 13, minWidth: 0 }} />
            <button onClick={subscribe} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontFamily: BODY, fontWeight: 700, fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap" }}>S'inscrire</button>
          </div>
          {status && <div style={{ fontSize: 11.5, color: "#B9C3D2", marginTop: 6 }}>{status}</div>}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 22, paddingTop: 14, fontSize: 11.5, color: "#7C8AA0" }}>
        Prototype de démonstration — Mogota Agri-Tech Innovation.
      </div>
    </div>
  );
}


/* ============================================================================
   DIAGNOSTIC PHOTO — plant disease/pest identification via Claude vision.
   Tries the Django backend proxy first (keeps the API key server-side, and
   logs diagnoses); falls back to a direct client-side call to Claude — which
   is what actually runs in this Claude.ai preview, since it cannot reach
   your local backend. Either path uses the same real vision model.
============================================================================ */
