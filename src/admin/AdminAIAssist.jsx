import React, { useState } from "react";
import { C, MONO, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet, apiPost, askClaude } from "../api";
import { REGIONS, CROPS, MONTH_NAMES } from "../data";

export function AdminGuideAI() {
  const [crop, setCrop] = useState("Sorgho");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setDraft("");
    try {
      const text = await askClaude(
        "Tu es agronome spécialiste du Sahel. Rédige un guide de culture concis en français : sol recommandé, " +
        "rendement indicatif (kg/ha, agriculture pluviale traditionnelle), puis 5 étapes (avant semis, semis, " +
        "entretien, récolte, après récolte) avec durée et actions concrètes pour chacune.",
        "Culture : " + crop
      );
      setDraft(text || "Aucune réponse.");
    } catch (e) {
      setDraft("Échec de la génération — vérifiez la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel>
      <SectionTitle>Guide de culture — assistance IA</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 14, lineHeight: 1.5 }}>
        Génère un brouillon de guide de culture avec l'IA. La persistance directe dans l'app (au lieu d'un copier-coller
        vers l'admin Django) nécessite un endpoint dédié aux étapes de culture, pas encore branché — ce brouillon est
        à relire et coller manuellement dans <code>/admin/</code> pour l'instant.
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <select className="mati-select" value={crop} onChange={e => setCrop(e.target.value)}>
          {Object.keys(CROPS).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={generate} disabled={loading} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Génération…" : "Générer avec l'IA"}
        </button>
      </div>
      {draft && <div style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 14, fontSize: 13.5, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{draft}</div>}
    </Panel>
  );
}


export function AdminRegionsAI() {
  const [country, setCountry] = useState("");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const generate = async () => {
    if (!country.trim()) return;
    setLoading(true);
    setStatus(null);
    setProposal(null);
    try {
      const data = await apiPost("/api/admin/generate-regions/", { country });
      setProposal(data.regions);
    } catch (e) {
      setStatus("Échec — nécessite d'être connecté en admin et que le backend (avec ANTHROPIC_API_KEY) soit joignable.");
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = async () => {
    try {
      for (const r of proposal) await apiPost("/api/regions/", r);
      setStatus("Régions enregistrées.");
      setProposal(null);
      setCountry("");
    } catch (e) {
      setStatus("Échec de l'enregistrement d'une ou plusieurs régions.");
    }
  };

  return (
    <Panel>
      <SectionTitle>Pays & Régions — génération assistée par IA</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 14, lineHeight: 1.5 }}>
        Entrez un pays : l'IA propose 4 à 6 régions agro-climatiques types (zone, sol, saison des pluies, coordonnées).
        Vous relisez et corrigez avant d'enregistrer — rien n'est sauvegardé automatiquement.
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input placeholder="Ex : Niger" value={country} onChange={e => setCountry(e.target.value)}
          style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, maxWidth: 240 }} />
        <button onClick={generate} disabled={loading} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Génération…" : "Générer les régions"}
        </button>
      </div>
      {status && <div style={{ fontSize: 12.5, color: C.orangeDeep, marginBottom: 12 }}>{status}</div>}
      {proposal && (
        <div>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            {proposal.map((r, i) => (
              <div key={i} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12, fontSize: 13 }}>
                <strong style={{ color: C.navy }}>{r.name}</strong> — {r.zone}, sol {r.soil_type}, pluie {MONTH_NAMES[r.rain_start_month-1]}–{MONTH_NAMES[r.rain_end_month-1]} (~{r.rain_peak_mm} mm), {r.avg_temp_c}°C
              </div>
            ))}
          </div>
          <button onClick={confirmSave} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Enregistrer ces régions
          </button>
        </div>
      )}
    </Panel>
  );
}


export function AdminCropsAI() {
  const [country, setCountry] = useState("");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const generate = async () => {
    if (!country.trim()) return;
    setLoading(true);
    setStatus(null);
    setProposal(null);
    try {
      const data = await apiPost("/api/admin/generate-crops/", { country });
      setProposal(data.crops);
    } catch (e) {
      setStatus("Échec — nécessite d'être connecté en admin et que le backend (avec ANTHROPIC_API_KEY) soit joignable.");
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = async () => {
    try {
      for (const c of proposal) await apiPost("/api/crops/", c);
      setStatus("Cultures enregistrées.");
      setProposal(null);
      setCountry("");
    } catch (e) {
      setStatus("Échec de l'enregistrement d'une ou plusieurs cultures.");
    }
  };

  return (
    <Panel>
      <SectionTitle>Cultures — génération assistée par IA</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 14, lineHeight: 1.5 }}>
        Entrez un pays : l'IA propose 3 à 5 cultures vivrières représentatives (fenêtre de semis, cycle, besoin en eau, rendement indicatif).
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input placeholder="Ex : Niger" value={country} onChange={e => setCountry(e.target.value)}
          style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, maxWidth: 240 }} />
        <button onClick={generate} disabled={loading} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Génération…" : "Générer les cultures"}
        </button>
      </div>
      {status && <div style={{ fontSize: 12.5, color: C.orangeDeep, marginBottom: 12 }}>{status}</div>}
      {proposal && (
        <div>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            {proposal.map((c, i) => (
              <div key={i} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12, fontSize: 13 }}>
                <strong style={{ color: C.navy }}>{c.name}</strong> — semis {MONTH_NAMES[c.sow_window_start_month-1]}–{MONTH_NAMES[c.sow_window_end_month-1]}, cycle {c.cycle_days}j, besoin {c.water_need}, {c.yield_range}
              </div>
            ))}
          </div>
          <button onClick={confirmSave} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Enregistrer ces cultures
          </button>
        </div>
      )}
    </Panel>
  );
}


export function AdminAdvisoryAI() {
  const [region, setRegion] = useState("N'Djaména");
  const [crop, setCrop] = useState("Sorgho");
  const [fields, setFields] = useState({ sowing_advice: "", irrigation_advice: "", risk_advice: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const regenerate = async () => {
    setLoading(true);
    try {
      const text = await askClaude(
        "Tu es conseiller agricole pour le Tchad. Réponds en français avec exactement 3 lignes, préfixées ainsi : " +
        "SEMIS: ...\nIRRIGATION: ...\nRISQUE: ... — chaque conseil en une phrase concise et actionnable.",
        "Région : " + region + ", culture : " + crop
      );
      const get = (label) => (text.split(label + ":")[1] || "").split("\n")[0].trim();
      setFields({
        sowing_advice: get("SEMIS"), irrigation_advice: get("IRRIGATION"), risk_advice: get("RISQUE"),
      });
    } catch (e) {
      setStatus("Échec de la génération.");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const regions = await apiGet("/api/regions/");
      const crops = await apiGet("/api/crops/");
      const r = regions.find(x => x.name === region);
      const c = crops.find(x => x.name === crop);
      await apiPost("/api/advisory-overrides/", { region: r.id, crop: c.id, ...fields });
      setStatus("Conseil enregistré comme conseil officiel pour " + region + " / " + crop + ".");
    } catch (e) {
      setStatus("Échec de l'enregistrement — connectez-vous en tant qu'admin.");
    }
  };

  return (
    <Panel>
      <SectionTitle>Conseil du jour — modification assistée par IA</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 14, lineHeight: 1.5 }}>
        Un conseil enregistré ici remplace le calcul automatique pour cette région et cette culture, sur le
        Tableau de bord public.
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <select className="mati-select" value={region} onChange={e => setRegion(e.target.value)}>
          {Object.keys(REGIONS).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="mati-select" value={crop} onChange={e => setCrop(e.target.value)}>
          {Object.keys(CROPS).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={regenerate} disabled={loading} style={{ background: C.orange, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Génération…" : "Régénérer avec l'IA"}
        </button>
      </div>
      {["sowing_advice", "irrigation_advice", "risk_advice"].map((key, i) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 4 }}>
            {["Semis", "Irrigation", "Risque"][i]}
          </div>
          <textarea value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })} rows={2}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
        </div>
      ))}
      <button onClick={save} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 6 }}>
        Enregistrer comme conseil officiel
      </button>
      {status && <div style={{ fontSize: 12.5, color: C.inkDim, marginTop: 10 }}>{status}</div>}
    </Panel>
  );
}


