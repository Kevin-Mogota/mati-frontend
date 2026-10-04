import React, { useState, useRef, useEffect } from "react";
import { C, MONO, DISPLAY, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { Icon } from "../icons";
import { REGIONS } from "../data";

export function TabIA({ region, crop, advice }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour, je suis l'assistant de Mogota Agri-Tech Innovation. Je peux répondre à vos questions sur le semis, l'irrigation et le climat pour votre culture de " + crop.toLowerCase() + " à " + region + "." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    const systemPrompt = "Tu es l'assistant IA de Mogota Agri-Tech Innovation, un conseiller agricole pour des agriculteurs tchadiens. Réponds toujours en français, de façon claire, concise (5-8 phrases maximum) et pratique, adaptée à un agriculteur sans formation technique.\n" +
      "Contexte actuel sélectionné dans l'application :\n" +
      "- Région : " + region + (REGIONS[region] ? " (zone " + REGIONS[region].zone + ", sol " + REGIONS[region].soil + ")" : "") + "\n" +
      "- Culture : " + crop + "\n" +
      "- Conseil de semis du jour : " + advice.sowingAdvice + "\n" +
      "- Conseil d'irrigation du jour : " + advice.irrigationAdvice + "\n" +
      "- Indice de sécheresse saisonnier : " + advice.droughtIndex + "\n" +
      "Utilise ce contexte quand c'est pertinent, mais tu peux aussi répondre à des questions agricoles plus générales.";

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const textOut = (data.content || []).map(b => b.type === "text" ? b.text : "").join("\n").trim();
      setMessages([...newMessages, { role: "assistant", content: textOut || "Désolé, je n'ai pas pu générer de réponse." }]);
    } catch (e) {
      setError("Impossible de contacter l'assistant pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel style={{ display: "flex", flexDirection: "column", height: 480 }}>
      <SectionTitle right="propulsé par Claude">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Icon.Bot/> Assistant IA — conseiller agricole</span>
      </SectionTitle>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "80%",
            background: m.role === "user" ? C.green : C.bgAlt,
            color: m.role === "user" ? "#fff" : C.ink,
            border: m.role === "user" ? "none" : "1px solid " + C.border,
            borderRadius: 12, padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}>{m.content}</div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: C.inkDim, fontFamily: MONO, fontSize: 12, padding: "6px 4px" }}>
            L'assistant rédige une réponse…
          </div>
        )}
        {error && (
          <div style={{ alignSelf: "flex-start", color: C.orangeDeep, fontFamily: MONO, fontSize: 12, padding: "6px 4px" }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Posez une question sur votre culture, la météo, l'irrigation…"
          style={{
            flex: 1, background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 8,
            padding: "10px 14px", color: C.ink, fontFamily: BODY, fontSize: 14, outline: "none",
          }}
        />
        <button onClick={send} disabled={loading} style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          background: C.green, border: "none", borderRadius: 8, width: 44, cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}><Icon.Send/></button>
      </div>
    </Panel>
  );
}

/* ============================================================================
   APP
============================================================================ */
