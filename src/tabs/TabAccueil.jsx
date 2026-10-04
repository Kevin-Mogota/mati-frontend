import React, { useState, useEffect } from "react";
import { C, DISPLAY, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { HeroCarousel } from "../components/HeroCarousel";
import { PartnersCarousel } from "../components/PartnersCarousel";
import { Icon } from "../icons";
import { apiGet } from "../api";

export function TabAccueil({ setTab }) {
  const [events, setEvents] = useState(null);
  const [news, setNews] = useState(null);

  useEffect(() => {
    apiGet("/api/events/").then(setEvents).catch(() => setEvents([]));
    apiGet("/api/news/").then(setNews).catch(() => setNews([]));
  }, []);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <HeroCarousel />

      <Panel>
        <SectionTitle>Notre mission</SectionTitle>
        <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>
          Mettre la donnée et l'intelligence artificielle au service des agriculteurs, pour des décisions de
          semis, d'irrigation et de gestion du risque climatique plus sûres — accessibles même sans smartphone,
          pensées pour les réalités du terrain, dans n'importe quel pays.
        </div>
      </Panel>

      <PartnersCarousel />

      <Panel>
        <SectionTitle right="cliquez pour en savoir plus">Événements</SectionTitle>
        {events === null && <div style={{ fontSize: 13, color: C.inkDim }}>Chargement…</div>}
        {events && events.length === 0 && (
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 0" }}>
            <Icon.Sun/>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>
                CdP31 (COP31) — Pavillon de la Francophonie, Antalya
              </div>
              <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.5 }}>
                9 novembre 2026, 14h-15h — table ronde « L'intelligence artificielle et la donnée au service de
                l'agriculture climato-résiliente : le pari de la jeunesse francophone d'Afrique ». (Exemple affiché
                hors ligne — les événements réels apparaissent ici une fois ajoutés par un administrateur.)
              </div>
            </div>
          </div>
        )}
        {events && events.length > 0 && events.map(ev => (
          <div key={ev.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 0", borderTop: "1px solid " + C.border }}>
            {ev.image_url ? <img src={ev.image_url} alt={ev.title} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} /> : <Icon.Sun/>}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontSize: 12.5, color: C.inkDim, marginBottom: 4 }}>{new Date(ev.event_date).toLocaleString("fr-FR")} {ev.location && "— " + ev.location}</div>
              <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{ev.description}</div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel>
        <SectionTitle>Actualité</SectionTitle>
        {news === null && <div style={{ fontSize: 13, color: C.inkDim }}>Chargement…</div>}
        {news && news.length === 0 && (
          <div style={{ fontSize: 13.5, color: C.inkDim, lineHeight: 1.6 }}>
            Aucune actualité publiée pour le moment — cette section s'alimentera au fil des annonces (partenariats,
            jalons du projet, retours de terrain).
          </div>
        )}
        {news && news.length > 0 && news.map(n => (
          <div key={n.id} style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: "1px solid " + C.border }}>
            {n.image_url && <img src={n.image_url} alt={n.title} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{n.content}</div>
            </div>
          </div>
        ))}
      </Panel>

      <button onClick={() => setTab("apropos")} style={{
        justifySelf: "start", background: "transparent", border: `1.5px solid ${C.navy}`, color: C.navy,
        borderRadius: 8, padding: "10px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13.5, cursor: "pointer",
      }}>En savoir plus sur nous →</button>
    </div>
  );
}
