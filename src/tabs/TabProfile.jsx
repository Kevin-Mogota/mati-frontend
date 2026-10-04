import React, { useState, useEffect } from "react";
import { C, MONO, DISPLAY, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet, apiPost, apiPatch, apiDelete } from "../api";

export function TabProfile({ auth }) {
  const [profile, setProfile] = useState(null);
  const [fields, setFields] = useState({ email: "", country: "", phone: "", sms_opt_in: false, preferred_language: "fr" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    apiGet("/api/profile/").then(p => {
      setProfile(p);
      setFields({ email: p.email || "", country: p.country || "", phone: p.phone || "", sms_opt_in: p.sms_opt_in || false, preferred_language: p.preferred_language || "fr" });
    }).catch(() => setProfile(null));
  }, []);

  if (!auth.user) {
    return (
      <Panel>
        <SectionTitle>Mon profil</SectionTitle>
        <div style={{ fontSize: 13.5, color: C.inkDim }}>Connectez-vous pour voir et modifier votre profil.</div>
      </Panel>
    );
  }

  const save = async () => {
    try {
      await apiPatch("/api/profile/", fields);
      setStatus("Profil mis à jour.");
    } catch (e) {
      setStatus("Échec de la mise à jour.");
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) return;
    try {
      await apiDelete("/api/profile/");
      auth.logout();
    } catch (e) {
      setStatus("Échec de la suppression du compte.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel>
        <SectionTitle right={profile?.mogota_id}>Mon profil</SectionTitle>
        <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 4 }}>Nom d'utilisateur</div>
            <div style={{ fontSize: 14, color: C.ink }}>{auth.user.username}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 4 }}>Email</div>
            <input value={fields.email} onChange={e => setFields({ ...fields, email: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 4 }}>Pays</div>
            <input value={fields.country} onChange={e => setFields({ ...fields, country: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 4 }}>Téléphone</div>
            <input value={fields.phone} onChange={e => setFields({ ...fields, phone: e.target.value })} placeholder="Pour les alertes SMS/USSD"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.ink }}>
            <input type="checkbox" checked={fields.sms_opt_in} onChange={e => setFields({ ...fields, sms_opt_in: e.target.checked })} />
            Recevoir les alertes SMS/USSD sur ce numéro
          </label>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 4 }}>Langue préférée</div>
            <select className="mati-select" value={fields.preferred_language} onChange={e => setFields({ ...fields, preferred_language: e.target.value })}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <button onClick={save} style={{ justifySelf: "start", background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 6 }}>
            Enregistrer
          </button>
          {status && <div style={{ fontSize: 12.5, color: C.inkDim }}>{status}</div>}
        </div>
      </Panel>

      <Panel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={auth.logout} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 8, padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", color: C.ink }}>
            Déconnexion
          </button>
          <button onClick={deleteAccount} style={{ background: "none", border: "1px solid " + C.orange, borderRadius: 8, padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", color: C.orangeDeep }}>
            Supprimer mon compte
          </button>
        </div>
      </Panel>
    </div>
  );
}
