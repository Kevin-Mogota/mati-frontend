import React, { useState, useEffect } from "react";
import { C, MONO, BODY } from "../theme";
import { Panel, SectionTitle, LEVEL } from "../components/common";
import { Icon } from "../icons";
import { apiGet, apiPost } from "../api";

export function TabSms({ region, crop, advice, auth }) {
  const [channel, setChannel] = useState("sms");
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(null);
  const [connected, setConnected] = useState(false);

  const loadFromBackend = () => {
    apiGet("/api/sms-alerts/")
      .then(list => { setLog(list); setConnected(true); })
      .catch(() => setConnected(false));
  };
  useEffect(() => { loadFromBackend(); }, []);

  const composeMessage = () => {
    const levelText = LEVEL[advice.irrigationLevel].label;
    return advice.irrigationLevel === "alert"
      ? "Alerte MATI — " + region + " : déficit hydrique détecté. Pensez à irriguer votre parcelle de " + crop.toLowerCase() + " si possible."
      : "Conseil MATI — " + region + " : conditions " + levelText.toLowerCase() + " pour le " + crop.toLowerCase() + " cette semaine.";
  };

  const send = async () => {
    setLoading(true);
    setNote(null);
    const message = composeMessage();

    if (!connected) {
      // Offline/demo fallback — same simulated behavior as before, clearly labeled.
      setLog([{ id: Date.now(), created_at: new Date().toISOString(), message, status: "sent", channel, error_detail: "" }, ...log]);
      setNote("Mode démonstration (backend non joignable) — envoi simulé localement, aucun message réel.");
      setLoading(false);
      return;
    }

    try {
      const regions = await apiGet("/api/regions/");
      const crops = await apiGet("/api/crops/");
      const r = regions.find(x => x.name === region);
      const c = crops.find(x => x.name === crop);
      await apiPost("/api/sms-alerts/", {
        region: r?.id, crop: c?.id, channel, message,
        recipient: auth?.user?.id || null,
      });
      if (channel === "whatsapp" && !(auth?.user?.phone)) {
        setNote("Aucun numéro de téléphone renseigné sur votre profil — le message a été enregistré mais ne peut pas être livré. Ajoutez votre numéro dans Mon profil.");
      }
      loadFromBackend();
    } catch (e) {
      setNote("Échec de l'enregistrement de l'alerte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel>
      <SectionTitle right={log.length + " message(s)"}>Alertes SMS / WhatsApp</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 16, lineHeight: 1.5 }}>
        {connected
          ? "Le canal SMS/USSD reste simulé (aucune passerelle configurée). Le canal WhatsApp appelle réellement l'API Meta si WHATSAPP_TOKEN et WHATSAPP_PHONE_NUMBER_ID sont configurés côté serveur — sinon l'envoi échoue proprement et l'erreur exacte est affichée ci-dessous."
          : "Backend non joignable dans cet aperçu — démonstration locale uniquement."}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.ink, cursor: "pointer" }}>
          <input type="radio" checked={channel === "sms"} onChange={() => setChannel("sms")} /> SMS/USSD
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.ink, cursor: "pointer" }}>
          <input type="radio" checked={channel === "whatsapp"} onChange={() => setChannel("whatsapp")} /> WhatsApp
        </label>
      </div>

      <button onClick={send} disabled={loading} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: C.green, color: "#fff", border: "none", borderRadius: 8,
        padding: "10px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13,
        cursor: "pointer", marginBottom: 12, opacity: loading ? 0.6 : 1,
      }}><Icon.Sms/> {loading ? "Envoi…" : "Envoyer pour la situation actuelle"}</button>

      {note && <div style={{ fontSize: 12.5, color: C.orangeDeep, marginBottom: 14 }}>{note}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {log.map((item) => (
          <div key={item.id} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 14,
          }}>
            <Icon.Sms/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{item.message}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.inkDim }}>
                  {new Date(item.created_at).toLocaleString("fr-FR")} · {item.channel === "whatsapp" ? "WhatsApp" : "SMS/USSD"}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: item.status === "sent" ? C.greenDeep : item.status === "failed" ? C.orangeDeep : C.inkDim }}>
                  {item.status === "sent" ? "Envoyé" : item.status === "failed" ? "Échec" : "En file"}
                </span>
              </div>
              {item.error_detail && (
                <div style={{ fontSize: 11.5, color: C.orangeDeep, marginTop: 4 }}>{item.error_detail}</div>
              )}
            </div>
          </div>
        ))}
        {log.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>Aucune alerte pour l'instant.</div>}
      </div>
    </Panel>
  );
}
