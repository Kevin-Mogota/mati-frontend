import React, { useState, useEffect } from "react";
import { C, DISPLAY } from "../theme";
import { apiGet } from "../api";

export const HERO_SLIDES = [
  {
    title: "Surveillance des champs par drone",
    text: "Suivi aérien régulier des parcelles pour détecter tôt le stress hydrique ou les zones à problème.",
    render: (t) => (
      <svg viewBox="0 0 400 220" width="100%" height="100%">
        <rect x="0" y="140" width="400" height="80" fill={C.greenTint} />
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={i * 68} y="150" width="60" height="60" fill="none" stroke={C.green} strokeOpacity="0.4" strokeWidth="1.5" />
        ))}
        <g transform={`translate(${180 + Math.sin(t / 500) * 60}, ${60 + Math.cos(t / 700) * 14})`}>
          <circle r="5" fill={C.navy} />
          {[[-16,-16],[16,-16],[-16,16],[16,16]].map(([dx,dy], i) => (
            <g key={i} transform={`translate(${dx},${dy})`}>
              <line x1="0" y1="0" x2={dx>0?10:-10} y2={dy>0?10:-10} stroke={C.navy} strokeWidth="2" />
              <ellipse cx={dx>0?10:-10} cy={dy>0?10:-10} rx="9" ry="2.5" fill={C.orange} opacity={0.7 + 0.3*Math.sin(t/60)} />
            </g>
          ))}
        </g>
      </svg>
    ),
  },
  {
    title: "Analyse de culture par IA",
    text: "Les images de terrain sont analysées automatiquement pour estimer la santé et la densité des cultures.",
    render: (t) => (
      <svg viewBox="0 0 400 220" width="100%" height="100%">
        <rect x="40" y="40" width="320" height="150" rx="10" fill={C.bgAlt} stroke={C.border} />
        {[...Array(5)].map((_, i) => (
          <circle key={i} cx={90 + i * 55} cy={90 + (i % 2) * 40} r="14" fill={C.green} opacity="0.75" />
        ))}
        <rect x="60" y={170 - (30 + 20*Math.sin(t/300))} width="16" height={30 + 20*Math.sin(t/300)} fill={C.orange} opacity="0.6" />
        <rect x="180" y={170 - (50 + 15*Math.cos(t/260))} width="16" height={50 + 15*Math.cos(t/260)} fill={C.green} opacity="0.6" />
        <rect x="300" y={170 - (20 + 25*Math.sin(t/340))} width="16" height={20 + 25*Math.sin(t/340)} fill={C.orange} opacity="0.6" />
      </svg>
    ),
  },
  {
    title: "Capteurs connectés",
    text: "Des capteurs de sol et de météo transmettent en continu l'humidité, la température et la pluviométrie.",
    render: (t) => (
      <svg viewBox="0 0 400 220" width="100%" height="100%">
        <circle cx="200" cy="110" r="26" fill={C.navy} />
        {[0,1,2].map((i) => (
          <circle key={i} cx="200" cy="110" r={30 + i*22 + (t/40 % 22)} fill="none" stroke={C.green} strokeOpacity={Math.max(0, 0.5 - i*0.15 - (t/40 % 22)/60)} strokeWidth="2" />
        ))}
        <rect x="192" y="130" width="16" height="50" fill={C.orange} />
      </svg>
    ),
  },
  {
    title: "Suivi météo en temps réel",
    text: "Pluviométrie, température et indice de sécheresse actualisés pour anticiper chaque décision culturale.",
    render: (t) => (
      <svg viewBox="0 0 400 220" width="100%" height="100%">
        <circle cx="120" cy="80" r="30" fill={C.orange} opacity="0.85" />
        <path d="M180 100a40 40 0 0179 8 30 30 0 01-4 59H150a34 34 0 01-6-67" fill={C.bgAlt} stroke={C.border} />
        {[...Array(5)].map((_, i) => (
          <line key={i} x1={160 + i*30} y1={175 + ((t/80 + i*20) % 40)} x2={155 + i*30} y2={190 + ((t/80 + i*20) % 40)} stroke={C.green} strokeWidth="2" strokeLinecap="round" />
        ))}
      </svg>
    ),
  },
];


export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [t, setT] = useState(0);
  const [backendMedia, setBackendMedia] = useState(null); // null = not loaded yet, [] = loaded but empty

  useEffect(() => {
    apiGet("/api/hero-media/").then(setBackendMedia).catch(() => setBackendMedia([]));
  }, []);

  // Admin-managed slides (image/video) take priority; fall back to the built-in
  // illustrated scenes if the admin hasn't added any yet, or the backend is offline.
  const slides = (backendMedia && backendMedia.length > 0)
    ? backendMedia.map(m => ({
        title: m.title, text: m.text,
        render: () => m.video_url
          ? <video src={m.video_url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <img src={m.image_url} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />,
      }))
    : HERO_SLIDES;

  useEffect(() => {
    const slideTimer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    const frameTimer = setInterval(() => setT((v) => v + 40), 40);
    return () => { clearInterval(slideTimer); clearInterval(frameTimer); };
  }, [slides.length]);

  const slide = slides[index % slides.length];
  return (
    <div style={{ background: C.navy, borderRadius: 16, overflow: "hidden", position: "relative" }}>
      <div style={{ height: 220 }}>{slide.render(t)}</div>
      <div style={{ padding: "18px 24px 22px", color: "#fff" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{slide.title}</div>
        <div style={{ fontSize: 13.5, color: "#B9C3D2", lineHeight: 1.5 }}>{slide.text}</div>
      </div>
      <div style={{ position: "absolute", top: 16, right: 20, display: "flex", gap: 6 }}>
        {slides.map((_, i) => (
          <span key={i} onClick={() => setIndex(i)} style={{
            width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
            background: i === index ? C.orange : "rgba(255,255,255,0.35)",
          }} />
        ))}
      </div>
    </div>
  );
}

