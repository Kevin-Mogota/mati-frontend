import React, { useState, useEffect } from "react";
import { C, MONO, DISPLAY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet } from "../api";

export function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet("/api/admin/stats/").then(setStats).catch(() => setError("Échec du chargement des statistiques."));
  }, []);

  if (error) return <Panel><div style={{ fontSize: 13, color: C.orangeDeep }}>{error}</div></Panel>;
  if (!stats) return <Panel><div style={{ fontSize: 13, color: C.inkDim }}>Chargement…</div></Panel>;

  const cards = [
    ["Comptes créés", stats.total_accounts],
    ["Agriculteurs inscrits", stats.total_farmers],
    ["Sessions actives", stats.connected_sessions],
    ["Abonnés newsletter", stats.newsletter_subscribers],
    ["Diagnostics photo réalisés", stats.diagnoses_run],
    ["Conversations IA", stats.chat_sessions],
    ["Publications forum", stats.forum_posts],
    ["Commentaires forum", stats.forum_comments],
    ["SMS envoyés", stats.sms_alerts_sent],
  ];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel>
        <SectionTitle>Vue d'ensemble</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
          {cards.map(([label, value]) => (
            <div key={label} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 14 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, color: C.navy }}>{value}</div>
              <div style={{ fontSize: 12, color: C.inkDim, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <SectionTitle>Agriculteurs par pays</SectionTitle>
        {stats.farmers_by_country.length === 0
          ? <div style={{ fontSize: 13, color: C.inkDim }}>Aucun agriculteur inscrit pour l'instant.</div>
          : (
            <div style={{ display: "grid", gap: 6 }}>
              {stats.farmers_by_country.map(row => (
                <div key={row.country} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "6px 0", borderTop: "1px solid " + C.border }}>
                  <span style={{ color: C.ink }}>{row.country}</span>
                  <span style={{ fontFamily: MONO, color: C.inkDim }}>{row.count}</span>
                </div>
              ))}
            </div>
          )}
      </Panel>
      <div style={{ fontSize: 11.5, color: C.inkDim, lineHeight: 1.5 }}>
        « Sessions actives » compte les sessions Django non expirées — un indicateur approximatif, pas une présence en temps réel.
      </div>
    </div>
  );
}

