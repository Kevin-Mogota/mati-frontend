import React, { useState, useEffect } from "react";
import { C, BODY } from "../theme";

// Uses window.speechSynthesis — built into every modern browser, free, no API key,
// and works even offline once the page has loaded. This is the real, testable
// alternative to a paid TTS API (Google Cloud TTS, Amazon Polly) for reaching
// farmers who can't read French text comfortably.
function pickFrenchVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  const target = lang === "en" ? "en" : "fr";
  return voices.find(v => v.lang.toLowerCase().startsWith(target)) || voices[0];
}

export function SpeakButton({ text, lang = "fr", size = "normal" }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const toggle = () => {
    if (!supported || !text) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickFrenchVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.lang = lang === "en" ? "en-US" : "fr-FR";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel(); // stop anything already playing
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (!supported) return null;

  const small = size === "small";
  return (
    <button onClick={toggle} title={speaking ? "Arrêter la lecture" : "Écouter ce texte"} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: speaking ? C.green : "transparent",
      color: speaking ? "#fff" : C.navy,
      border: "1px solid " + (speaking ? C.green : C.border),
      borderRadius: 999, padding: small ? "3px 10px" : "5px 14px",
      fontFamily: BODY, fontWeight: 600, fontSize: small ? 11.5 : 12.5,
      cursor: "pointer", whiteSpace: "nowrap",
    }}>
      <svg width={small ? 12 : 14} height={small ? 12 : 14} viewBox="0 0 24 24" fill="none">
        <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
        {speaking
          ? <path d="M17 8a5 5 0 010 8M20 5a9 9 0 010 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          : <path d="M17 8a5 5 0 010 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />}
      </svg>
      {speaking ? "Arrêter" : "Écouter"}
    </button>
  );
}
