import React, { useState, useEffect } from "react";
import { C, DISPLAY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet } from "../api";
import { PartnersCarousel } from "../components/PartnersCarousel";

export function TabAPropos() {
  const [team, setTeam] = useState(null);
  const [aboutText, setAboutText] = useState(null);

  useEffect(() => {
    apiGet("/api/team/").then(setTeam).catch(() => setTeam([]));
    apiGet("/api/page-content/").then(list => {
      const about = list.find(x => x.key === "about");
      setAboutText(about ? about.body : null);
    }).catch(() => setAboutText(null));
  }, []);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel>
        <SectionTitle>Qui sommes-nous ?</SectionTitle>
        <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>
          {aboutText || (
            "Mogota Agri-Tech Innovation est une initiative fondée par Kevin Mogota, ingénieur en informatique " +
            "(Licence Informatique Appliquée, Université de N'Djamena — Master en cours, Big Data Analytics), dédiée " +
            "à l'usage de la donnée et de l'intelligence artificielle au service de l'agriculture climato-résiliente, " +
            "aujourd'hui étendue à d'autres pays."
          )}
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Membres</SectionTitle>
        {team === null && <div style={{ fontSize: 13, color: C.inkDim }}>Chargement…</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16 }}>
          {(team && team.length > 0 ? team : [{ full_name: "Kevin Mogota", title: "Fondateur", photo_url: "" }]).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.full_name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.greenTint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, color: C.greenDeep }}>
                  {m.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{m.full_name}</div>
                <div style={{ fontSize: 13, color: C.inkDim }}>{[m.title, m.role].filter(Boolean).join(" · ")}</div>
              </div>
            </div>
          ))}
        </div>
        {team && team.length === 0 && (
          <div style={{ fontSize: 12.5, color: C.inkDim, marginTop: 12 }}>
            D'autres membres peuvent être ajoutés depuis l'onglet Admin.
          </div>
        )}
      </Panel>

      <Panel>
        <SectionTitle>Partenaires</SectionTitle>
        <PartnersCarousel hideTitle />
      </Panel>
    </div>
  );
}
