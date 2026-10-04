import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { C, MONO, DISPLAY } from "../theme";
import { Panel, SectionTitle, DroughtGauge } from "../components/common";
import { Icon } from "../icons";
import { REGIONS } from "../data";
import { seeded } from "../advisory";
import { apiGet } from "../api";

function NdviPanel({ region }) {
  const [ndvi, setNdvi] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNdvi(null);
    apiGet("/api/ndvi/?region=" + encodeURIComponent(region))
      .then(setNdvi)
      .catch(() => setError("Donnée satellite non disponible pour cette région pour l'instant."))
      .finally(() => setLoading(false));
  }, [region]);

  const pct = ndvi ? Math.max(0, Math.min(1, (ndvi.ndvi_value + 0.2) / 0.8)) * 100 : 0;
  const color = ndvi
    ? (ndvi.ndvi_value >= 0.6 ? C.green : ndvi.ndvi_value >= 0.4 ? C.orangeSoft || C.orange : C.orangeDeep)
    : C.inkDim;

  return (
    <Panel>
      <SectionTitle right="NASA / MODIS — satellite, gratuit">Santé de la végétation (NDVI)</SectionTitle>
      {loading && <div style={{ fontSize: 13, color: C.inkDim }}>Chargement…</div>}
      {error && (
        <div style={{ fontSize: 13, color: C.inkDim, lineHeight: 1.5 }}>
          {error} Cette source est un point d'intégration réel (API NASA/ORNL MODIS, sans clé requise) — elle peut
          échouer temporairement si le service est indisponible ou si votre réseau le bloque.
        </div>
      )}
      {ndvi && !loading && (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: C.navy }}>{ndvi.ndvi_value.toFixed(2)}</div>
            <div style={{ fontSize: 13.5, color: C.ink, fontWeight: 600 }}>{ndvi.health_label}</div>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: C.bgAlt, overflow: "hidden", border: "1px solid " + C.border }}>
            <div style={{ width: pct + "%", height: "100%", background: color }} />
          </div>
          <div style={{ fontSize: 11.5, color: C.inkDim, marginTop: 8, fontFamily: MONO }}>
            Relevé du {new Date(ndvi.date).toLocaleDateString("fr-FR")}
          </div>
        </div>
      )}
    </Panel>
  );
}

export function TabMeteo({ region, advice }) {
  const r = REGIONS[region];
  if (!r) {
    return (
      <Panel>
        <SectionTitle>Météo & Sécheresse — {region}</SectionTitle>
        <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.6 }}>
          Profil climatique local non configuré pour cette région. Connectez-vous au backend pour les données
          réelles (NASA POWER), une fois les régions de ce pays enregistrées par un administrateur.
        </div>
      </Panel>
    );
  }
  const tempAnomaly = (seeded(region.length * 3 + advice.now) * 2 - 0.5).toFixed(1);
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14 }}>
        <Panel style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Icon.Sun/><span style={{ fontFamily: MONO, fontSize: 11, color: C.inkDim, textTransform: "uppercase" }}>Température moyenne</span></div>
          <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.navy }}>{r.avgTemp}°C</div>
          <div style={{ fontSize: 12, color: Number(tempAnomaly) > 0 ? C.orangeDeep : C.greenDeep, marginTop: 4 }}>{tempAnomaly > 0 ? "+" : ""}{tempAnomaly}°C vs moyenne 5 ans (simulé)</div>
        </Panel>
        <Panel style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Icon.Rain/><span style={{ fontFamily: MONO, fontSize: 11, color: C.inkDim, textTransform: "uppercase" }}>Pluie ce mois-ci</span></div>
          <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.navy }}>{advice.thisMonthRain} mm</div>
          <div style={{ fontSize: 12, color: C.inkDim, marginTop: 4 }}>Estimation régionale</div>
        </Panel>
        <Panel style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Icon.Alert/><span style={{ fontFamily: MONO, fontSize: 11, color: C.inkDim, textTransform: "uppercase" }}>Indice de sécheresse</span></div>
          <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.navy }}>{advice.droughtIndex}</div>
          <div style={{ marginTop: 10 }}><DroughtGauge ratio={advice.rainRatio} /></div>
        </Panel>
      </div>

      <Panel>
        <SectionTitle right="mm / mois">Pluviométrie mensuelle estimée — {region}</SectionTitle>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={advice.rain} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.orange} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={C.orange} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily: "Work Sans", fontSize: 12, fill: C.inkDim }} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fontFamily: "Work Sans", fontSize: 12, fill: C.inkDim }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ background: C.navy, border: "none", borderRadius: 8, fontFamily: "Work Sans" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: C.orange }} formatter={(v) => [v + " mm", "Pluie estimée"]} />
              <Area type="monotone" dataKey="mm" stroke={C.orangeDeep} strokeWidth={2} fill="url(#rainFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <NdviPanel region={region} />
    </div>
  );
}

