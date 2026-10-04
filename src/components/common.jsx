import React from "react";
import { C, MONO, DISPLAY } from "../theme";

export const LEVEL = {
  go:    { bg: C.greenTint, fg: C.greenDeep, label: "Favorable" },
  ok:    { bg: C.greenTint, fg: C.greenDeep, label: "Favorable" },
  watch: { bg: C.orangeTint, fg: C.orangeDeep, label: "À surveiller" },
  wait:  { bg: C.orangeTint, fg: C.orangeDeep, label: "Patienter" },
  risk:  { bg: "#FBDCC8", fg: C.orangeDeep, label: "Risque" },
  alert: { bg: "#FBDCC8", fg: C.orangeDeep, label: "Alerte" },
};


export function Pill({ level }) {
  const s = LEVEL[level];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: s.bg, color: s.fg, fontFamily: MONO,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
      padding: "4px 10px", borderRadius: 999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.fg, opacity: 0.7 }} />
      {s.label}
    </span>
  );
}

/* ============================================================================
   ICONS
============================================================================ */

export function Panel({ children, style }) {
  return (
    <div style={{
      background: C.bg, border: "1px solid " + C.border,
      borderRadius: 14, padding: 22, boxShadow: "0 1px 2px rgba(22,40,63,0.04)", ...style,
    }}>{children}</div>
  );
}


export function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, flexWrap: "wrap", gap: 6 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: C.navy }}>{children}</div>
      {right && <div style={{ fontFamily: MONO, fontSize: 12, color: C.inkDim }}>{right}</div>}
    </div>
  );
}


export function DroughtGauge({ ratio }) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  const color = ratio >= 0.9 ? C.green : ratio >= 0.6 ? C.orange : C.orangeDeep;
  return (
    <div>
      <div style={{ height: 10, borderRadius: 999, background: C.bgAlt, overflow: "hidden", border: "1px solid " + C.border }}>
        <div style={{ width: pct + "%", height: "100%", background: color, transition: "width 0.4s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, color: C.inkDim, marginTop: 6 }}>
        <span>Sévère</span><span>Modéré</span><span>Favorable</span>
      </div>
    </div>
  );
}

/* ============================================================================
   TABS
============================================================================ */
