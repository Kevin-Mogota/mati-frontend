import React from "react";
import { C, MONO, DISPLAY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { STAGE_ICON } from "../icons";
import { GUIDE, CROPS, OFF_SEASON_INTRO } from "../data";
import { SpeakButton } from "../components/SpeakButton";

export function TabGuide({ crop }) {
  const g = GUIDE[crop];
  const c = CROPS[crop];
  if (!g || !c) {
    return (
      <Panel>
        <SectionTitle>Guide de culture — {crop}</SectionTitle>
        <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.6 }}>
          Aucun guide local pour cette culture pour l'instant — un administrateur peut en générer un depuis
          l'onglet Admin (assistance IA), ou vous pouvez demander des conseils généraux à l'assistant IA.
        </div>
      </Panel>
    );
  }
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel>
        <SectionTitle>Quand cultiver — {crop}</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: g.growsOffSeason ? 14 : 0 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999,
            fontSize: 13, fontWeight: 700, fontFamily: MONO,
            background: g.growsRainSeason ? C.greenTint : C.bgAlt,
            color: g.growsRainSeason ? C.greenDeep : C.inkDim,
            border: "1px solid " + (g.growsRainSeason ? C.green : C.border),
          }}>{g.growsRainSeason ? "✓" : "✕"} Saison des pluies (pluvial)</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999,
            fontSize: 13, fontWeight: 700, fontFamily: MONO,
            background: g.growsOffSeason ? C.orangeTint : C.bgAlt,
            color: g.growsOffSeason ? C.orangeDeep : C.inkDim,
            border: "1px solid " + (g.growsOffSeason ? C.orange : C.border),
          }}>{g.growsOffSeason ? "✓" : "✕"} Contre-saison (irrigation)</span>
        </div>
        {g.growsOffSeason && (
          <div style={{ borderTop: "1px solid " + C.border, paddingTop: 14 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 8 }}>{OFF_SEASON_INTRO.title}</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              {OFF_SEASON_INTRO.points.map((p, i) => (
                <li key={i} style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </Panel>
      <Panel>
        <SectionTitle right={"Cycle complet · " + c.cycleDays + " jours"}>Guide de culture — {crop}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14, marginBottom: 4 }}>
          <div style={{ background: C.bgAlt, borderRadius: 10, padding: 14 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.inkDim, textTransform: "uppercase", marginBottom: 6 }}>Sol recommandé</div>
            <div style={{ fontSize: 14, color: C.ink, fontWeight: 600 }}>{g.soils.join(" · ")}</div>
            <div style={{ fontSize: 13, color: C.inkDim, marginTop: 6, lineHeight: 1.5 }}>{g.soilNote}</div>
          </div>
          <div style={{ background: C.bgAlt, borderRadius: 10, padding: 14 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.inkDim, textTransform: "uppercase", marginBottom: 6 }}>Rendement indicatif</div>
            <div style={{ fontSize: 14, color: C.ink, fontWeight: 600 }}>{g.yieldRange}</div>
            <div style={{ fontSize: 12, color: C.inkDim, marginTop: 6, lineHeight: 1.5 }}>Valeurs indicatives issues d'études régionales sur l'agriculture pluviale sahélienne — à confirmer avec les services agricoles locaux.</div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Étapes de culture, avant et après récolte</SectionTitle>
        <div style={{ display: "grid", gap: 0 }}>
          {g.stages.map((stage, i) => {
            const StageIcon = STAGE_ICON[stage.icon];
            return (
              <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderTop: i > 0 ? "1px solid " + C.border : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 26 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.bgAlt, border: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <StageIcon/>
                  </div>
                  {i < g.stages.length - 1 && <div style={{ flex: 1, width: 1, background: C.border, marginTop: 6, minHeight: 20 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.navy }}>{stage.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.orangeDeep, background: C.orangeTint, padding: "2px 8px", borderRadius: 999 }}>{stage.timing}</span>
                      <SpeakButton text={stage.title + ". " + stage.actions.join(". ")} size="small" />
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                    {stage.actions.map((a, j) => (
                      <li key={j} style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

