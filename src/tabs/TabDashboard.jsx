import React, { useState } from "react";
import { C } from "../theme";
import { Panel, SectionTitle, Pill } from "../components/common";
import { Icon } from "../icons";
import { apiGet, apiPost } from "../api";
import { SpeakButton } from "../components/SpeakButton";

/* ----------------------------------------------------------------------------
   Feedback loop — "j'ai suivi ce conseil" + résultat. The field-truth signal
   the platform needs to eventually learn from real outcomes rather than only
   computing rule-based advice. Only shown to logged-in users.
---------------------------------------------------------------------------- */
function FeedbackCard({ region, crop, auth }) {
  const [step, setStep] = useState("ask"); // ask | outcome | done
  const [followed, setFollowed] = useState(null);
  const [status, setStatus] = useState(null);

  if (!auth || !auth.user) return null;

  const submit = async (outcome) => {
    try {
      const regions = await apiGet("/api/regions/");
      const crops = await apiGet("/api/crops/");
      const r = regions.find(x => x.name === region);
      const c = crops.find(x => x.name === crop);
      if (!r || !c) throw new Error("région/culture introuvable côté backend");
      await apiPost("/api/advisory-feedback/", {
        region: r.id, crop: c.id, followed_advice: followed, outcome: outcome || "",
      });
      setStep("done");
    } catch (e) {
      setStatus("Échec — nécessite d'être connecté et que le backend soit joignable.");
    }
  };

  return (
    <Panel style={{ marginTop: 18, background: C.bgAlt }}>
      <SectionTitle>Avez-vous suivi ce conseil ?</SectionTitle>
      {step === "ask" && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setFollowed(true); setStep("outcome"); }} style={{
            background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px",
            fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>Oui, je l'ai suivi</button>
          <button onClick={() => { setFollowed(false); submit(""); }} style={{
            background: "none", color: C.inkDim, border: "1px solid " + C.border, borderRadius: 8, padding: "9px 18px",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Non, pas cette fois</button>
        </div>
      )}
      {step === "outcome" && (
        <div>
          <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 10 }}>Quel résultat avez-vous constaté ?</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["good", "Bon résultat"], ["mixed", "Résultat mitigé"], ["poor", "Mauvais résultat"], ["too_early", "Trop tôt pour savoir"]].map(([val, label]) => (
              <button key={val} onClick={() => submit(val)} style={{
                background: C.bg, border: "1px solid " + C.border, borderRadius: 999, padding: "7px 14px",
                fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: C.ink, cursor: "pointer",
              }}>{label}</button>
            ))}
          </div>
        </div>
      )}
      {step === "done" && (
        <div style={{ fontSize: 13.5, color: C.greenDeep }}>Merci — votre retour aide à améliorer les conseils futurs.</div>
      )}
      {status && <div style={{ fontSize: 12.5, color: C.orangeDeep, marginTop: 8 }}>{status}</div>}
    </Panel>
  );
}

export function TabDashboard({ region, crop, advice, auth }) {
  return (
    <div>
      <Panel>
        <SectionTitle right="Mise à jour · aujourd'hui">Conseil du jour — {crop} à {region}</SectionTitle>
        <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 16 }}>
          Estimations indicatives à partir de profils climatiques régionaux — à affiner avec des données de terrain réelles.
        </div>

        <div style={{ marginBottom: 4 }}>
          <SpeakButton text={"Conseil pour " + crop + " à " + region + ". Semis : " + advice.sowingAdvice + " Irrigation : " + advice.irrigationAdvice + " Risque climatique : " + advice.riskAdvice} />
        </div>

        {[
          { icon: <Icon.Seed/>, label: "Semis", text: advice.sowingAdvice, level: advice.sowingLevel },
          { icon: <Icon.Drop/>, label: "Irrigation", text: advice.irrigationAdvice, level: advice.irrigationLevel },
          { icon: <Icon.Rain/>, label: "Risque climatique saisonnier", text: advice.riskAdvice, level: advice.riskLevel },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 0", borderTop: i > 0 ? "1px dashed " + C.border : "none" }}>
            {row.icon}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{row.label}</span>
                <Pill level={row.level} />
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: C.ink }}>{row.text}</div>
            </div>
          </div>
        ))}
      </Panel>

      <FeedbackCard region={region} crop={crop} auth={auth} />
    </div>
  );
}
