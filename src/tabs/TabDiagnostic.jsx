import React, { useState } from "react";
import { C, MONO, DISPLAY, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiPost } from "../api";
import { fileToBase64, diagnoseImageDirect, parseDiagnosis } from "../advisory";

function detectLowConfidence(diagnosticText) {
  if (!diagnosticText) return false;
  const t = diagnosticText.toLowerCase();
  return t.includes("confiance : faible") || t.includes("confiance faible") || t.includes("confiance: faible");
}

function EscalationForm({ region, crop, diagnosisText }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    setSending(true);
    setStatus(null);
    try {
      await apiPost("/api/expert-requests/", { region, crop, context: diagnosisText, phone });
      setSent(true);
    } catch (e) {
      setStatus("Échec de l'envoi — un compte connecté et le backend sont nécessaires pour cette demande.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ fontSize: 13.5, color: C.greenDeep, background: C.greenTint, borderRadius: 8, padding: "10px 14px" }}>
        Demande envoyée — un agent agricole examinera votre cas et vous recontactera.
      </div>
    );
  }

  return (
    <div style={{ background: C.bgAlt, border: "1px solid " + C.orange, borderRadius: 10, padding: 14, marginTop: 4 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
        Confiance faible sur ce diagnostic — contacter un agent agricole ?
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Votre téléphone (optionnel)" value={phone} onChange={e => setPhone(e.target.value)}
          style={{ flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13 }} />
        <button onClick={send} disabled={sending} style={{
          background: C.orange, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px",
          fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: sending ? 0.6 : 1,
        }}>{sending ? "Envoi…" : "Contacter un agent agricole"}</button>
      </div>
      {status && <div style={{ fontSize: 12, color: C.orangeDeep, marginTop: 8 }}>{status}</div>}
    </div>
  );
}

export function TabDiagnostic({ region, crop }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [usedBackend, setUsedBackend] = useState(false);

  const onFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const base64 = await fileToBase64(file);
      const mediaType = file.type || "image/jpeg";

      try {
        const data = await apiPost("/api/diagnose/", { image: base64, media_type: mediaType, region, crop });
        setResult(parseDiagnosis(data.diagnosis));
        setUsedBackend(true);
      } catch (backendErr) {
        const text = await diagnoseImageDirect(base64, mediaType, region, crop);
        setResult(parseDiagnosis(text));
        setUsedBackend(false);
      }
    } catch (e) {
      setError("Échec de l'analyse — réessayez avec une autre photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel>
        <SectionTitle right={"pour " + crop + " à " + region}>Diagnostic photo par IA</SectionTitle>
        <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 16, lineHeight: 1.5 }}>
          Prenez en photo une feuille ou une plante qui semble malade. L'IA propose une piste de diagnostic
          (maladie, ravageur, carence, stress hydrique) et une recommandation — à confirmer sur le terrain en cas de doute.
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <label style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 220, height: 220, borderRadius: 12, border: "2px dashed " + C.border,
              background: C.bgAlt, cursor: "pointer", overflow: "hidden",
            }}>
              {preview
                ? <img src={preview} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 13, color: C.inkDim, textAlign: "center", padding: 16 }}>Cliquez pour choisir une photo</span>}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => onFile(e.target.files[0])} />
            </label>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <button onClick={analyze} disabled={!file || loading} style={{
              background: C.green, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13.5,
              cursor: (!file || loading) ? "default" : "pointer", opacity: (!file || loading) ? 0.6 : 1, marginBottom: 12,
            }}>{loading ? "Analyse en cours…" : "Analyser la photo"}</button>

            {error && <div style={{ fontSize: 13, color: C.orangeDeep }}>{error}</div>}

            {result && (
              <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
                <div style={{ fontSize: 10.5, color: C.inkDim, fontFamily: MONO }}>
                  {usedBackend ? "Analysé via le backend Django" : "Analysé directement (mode aperçu)"}
                </div>
                {[
                  ["Observation", result.observation],
                  ["Diagnostic probable", result.diagnostic],
                  ["Recommandation", result.recommandation],
                ].map(([label, text]) => text && (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {result?.limite && (
          <div style={{ marginTop: 16, fontSize: 12, color: C.inkDim, background: C.orangeTint, borderRadius: 8, padding: "10px 14px", lineHeight: 1.5 }}>
            {result.limite}
          </div>
        )}

        {result && detectLowConfidence(result.diagnostic) && (
          <div style={{ marginTop: 16 }}>
            <EscalationForm region={region} crop={crop} diagnosisText={[result.observation, result.diagnostic, result.recommandation].filter(Boolean).join(" — ")} />
          </div>
        )}
      </Panel>
    </div>
  );
}

