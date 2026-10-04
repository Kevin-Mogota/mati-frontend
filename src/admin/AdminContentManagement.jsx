import React, { useState, useEffect } from "react";
import { C, MONO, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export function AdminNews() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState(null);

  const load = () => apiGet("/api/news/").then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      await apiPost("/api/news/", { title, content, image_url: imageUrl, video_url: videoUrl });
      setTitle(""); setContent(""); setImageUrl(""); setVideoUrl(""); setStatus(null);
      load();
    } catch (e) {
      setStatus("Échec — connectez-vous en tant qu'admin et vérifiez que le backend tourne.");
    }
  };
  const remove = async (id) => {
    try { await apiDelete("/api/news/" + id + "/"); load(); } catch (e) {}
  };

  return (
    <Panel>
      <SectionTitle right={items.length + " publiée(s)"}>Actualités</SectionTitle>
      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 13.5 }} />
        <textarea placeholder="Contenu" value={content} onChange={e => setContent(e.target.value)} rows={3}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontFamily: BODY, fontSize: 13.5, resize: "vertical" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="URL d'une image (optionnel)" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13 }} />
          <input placeholder="URL d'une vidéo (optionnel)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13 }} />
        </div>
        <button onClick={add} style={{ justifySelf: "start", background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Publier</button>
        {status && <div style={{ fontSize: 12.5, color: C.orangeDeep }}>{status}</div>}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map(n => (
          <div key={n.id} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{n.title}</div>
              <div style={{ fontSize: 13, color: C.inkDim, marginTop: 2 }}>{n.content}</div>
            </div>
            <button onClick={() => remove(n.id)} style={{ background: "none", border: "none", color: C.orangeDeep, cursor: "pointer", fontSize: 12, fontFamily: MONO, height: "fit-content" }}>Supprimer</button>
          </div>
        ))}
        {items.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>Aucune actualité pour l'instant.</div>}
      </div>
    </Panel>
  );
}


export function AdminEvents() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", location: "", event_date: "", image_url: "", video_url: "" });
  const [status, setStatus] = useState(null);

  const load = () => apiGet("/api/events/").then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title.trim() || !form.event_date) return;
    try {
      await apiPost("/api/events/", form);
      setForm({ title: "", description: "", location: "", event_date: "", image_url: "", video_url: "" });
      setStatus(null);
      load();
    } catch (e) {
      setStatus("Échec — connectez-vous en tant qu'admin et vérifiez que le backend tourne.");
    }
  };
  const remove = async (id) => { try { await apiDelete("/api/events/" + id + "/"); load(); } catch (e) {} };

  return (
    <Panel>
      <SectionTitle right={items.length + " événement(s)"}>Événements</SectionTitle>
      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <input placeholder="Titre" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5 }} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Lieu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
            style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, minWidth: 140 }} />
          <input type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })}
            style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5 }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="URL d'une image (optionnel)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
            style={{ flex: 1, minWidth: 180, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13 }} />
          <input placeholder="URL d'une vidéo (optionnel)" value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })}
            style={{ flex: 1, minWidth: 180, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13 }} />
        </div>
        <button onClick={add} style={{ justifySelf: "start", background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Ajouter</button>
        {status && <div style={{ fontSize: 12.5, color: C.orangeDeep }}>{status}</div>}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map(ev => (
          <div key={ev.id} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{ev.title}</div>
              <div style={{ fontSize: 12.5, color: C.inkDim }}>{ev.location} — {new Date(ev.event_date).toLocaleString("fr-FR")}</div>
            </div>
            <button onClick={() => remove(ev.id)} style={{ background: "none", border: "none", color: C.orangeDeep, cursor: "pointer", fontSize: 12, fontFamily: MONO, height: "fit-content" }}>Supprimer</button>
          </div>
        ))}
        {items.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>Aucun événement pour l'instant.</div>}
      </div>
    </Panel>
  );
}


export function AdminContent() {
  const [about, setAbout] = useState("");
  const [mission, setMission] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    apiGet("/api/page-content/").then(list => {
      const a = list.find(x => x.key === "about");
      const m = list.find(x => x.key === "mission");
      if (a) setAbout(a.body);
      if (m) setMission(m.body);
    }).catch(() => {});
  }, []);

  const save = async (key, body, setter) => {
    try {
      const list = await apiGet("/api/page-content/");
      const existing = list.find(x => x.key === key);
      if (existing) await apiPut("/api/page-content/" + key + "/", { key, body });
      else await apiPost("/api/page-content/", { key, body });
      setStatus("Enregistré.");
    } catch (e) {
      setStatus("Échec — connectez-vous en tant qu'admin et vérifiez que le backend tourne.");
    }
  };

  return (
    <Panel>
      <SectionTitle>À propos / Notre mission</SectionTitle>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.inkDim, marginBottom: 6, textTransform: "uppercase" }}>Qui sommes-nous</div>
          <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
          <button onClick={() => save("about", about)} style={{ marginTop: 8, background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontFamily: BODY, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Enregistrer</button>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.inkDim, marginBottom: 6, textTransform: "uppercase" }}>Notre mission</div>
          <textarea value={mission} onChange={e => setMission(e.target.value)} rows={4}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
          <button onClick={() => save("mission", mission)} style={{ marginTop: 8, background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontFamily: BODY, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Enregistrer</button>
        </div>
        {status && <div style={{ fontSize: 12.5, color: C.inkDim }}>{status}</div>}
      </div>
    </Panel>
  );
}

