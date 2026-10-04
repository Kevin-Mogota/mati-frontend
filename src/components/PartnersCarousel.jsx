import React, { useState, useEffect } from "react";
import { C, DISPLAY } from "../theme";
import { apiGet } from "../api";

export function PartnersCarousel({ hideTitle } = {}) {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    apiGet("/api/partners/").then(setPartners).catch(() => setPartners([]));
  }, []);

  if (partners.length === 0) {
    return hideTitle ? (
      <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.6 }}>
        Aucun partenaire officiel listé pour le moment — section prête à accueillir vos partenaires techniques et financiers.
      </div>
    ) : null;
  }

  // Duplicate the list so the CSS scroll animation loops seamlessly.
  const loop = [...partners, ...partners];

  return (
    <div style={{ overflow: "hidden" }}>
      {!hideTitle && (
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: C.inkDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Nos partenaires
        </div>
      )}
      <style>{`
        @keyframes matiPartnerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mati-partner-track { display: flex; gap: 32px; width: max-content; animation: matiPartnerScroll 30s linear infinite; }
        .mati-partner-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="mati-partner-track">
        {loop.map((p, i) => (
          <a key={i} href={p.website_url || undefined} target="_blank" rel="noreferrer" title={p.name} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 56, opacity: 0.85,
          }}>
            <img src={p.logo_url} alt={p.name} style={{ maxHeight: 48, maxWidth: 140, objectFit: "contain" }} />
          </a>
        ))}
      </div>
    </div>
  );
}
