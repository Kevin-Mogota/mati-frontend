import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { C, MONO } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { REGIONS } from "../data";
import { buildMultiYearTotals } from "../advisory";

export function TabHistorique({ region }) {
  const [compareRegion, setCompareRegion] = useState("Aucune");
  const data = useMemo(() => buildMultiYearTotals(region), [region]);
  const dataCompare = useMemo(() => compareRegion !== "Aucune" ? buildMultiYearTotals(compareRegion) : null, [compareRegion]);

  if (data.length === 0) {
    return (
      <Panel>
        <SectionTitle>Historique pluviométrique — {region}</SectionTitle>
        <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.6 }}>
          Pas d'historique local pour cette région pour l'instant.
        </div>
      </Panel>
    );
  }

  const merged = data.map((d, i) => {
    const row = { year: d.year };
    row[region] = d.total;
    if (dataCompare) row[compareRegion] = dataCompare[i].total;
    return row;
  });

  const avg = data.reduce((a, b) => a + b.total, 0) / data.length;
  const lastYear = data[data.length - 1].total;
  const trend = (((lastYear - avg) / avg) * 100).toFixed(0);

  return (
    <Panel>
      <SectionTitle right="cumul saison des pluies, mm">Historique pluviométrique 5 ans — {region}</SectionTitle>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: C.inkDim }}>Comparer avec :</span>
        <select className="mati-select" value={compareRegion} onChange={(e) => setCompareRegion(e.target.value)}>
          <option value="Aucune">Aucune région</option>
          {Object.keys(REGIONS).filter(r => r !== region).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="year" tick={{ fontFamily: "Work Sans", fontSize: 12, fill: C.inkDim }} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fontFamily: "Work Sans", fontSize: 12, fill: C.inkDim }} axisLine={false} tickLine={false} width={34} />
            <Tooltip contentStyle={{ background: C.navy, border: "none", borderRadius: 8, fontFamily: "Work Sans" }} labelStyle={{ color: "#fff" }} />
            <Legend wrapperStyle={{ fontFamily: "Work Sans", fontSize: 12, color: C.inkDim }} />
            <Line type="monotone" dataKey={region} stroke={C.green} strokeWidth={2.5} dot={{ r: 3 }} />
            {dataCompare && <Line type="monotone" dataKey={compareRegion} stroke={C.orange} strokeWidth={2.5} dot={{ r: 3 }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 14, fontSize: 13, color: C.inkDim, lineHeight: 1.6 }}>
        Cumul {data[data.length-1].year} : <strong style={{ color: C.navy }}>{lastYear} mm</strong> — {trend > 0 ? "+" : ""}{trend}% par rapport à la moyenne des 5 dernières années (données simulées à des fins de démonstration).
      </div>
    </Panel>
  );
}

