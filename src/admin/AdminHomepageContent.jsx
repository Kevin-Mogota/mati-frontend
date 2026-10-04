import React, { useState, useEffect } from "react";
import { C, MONO, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet, apiPost, apiDelete } from "../api";

function SimpleCrudList({ endpoint, fields, renderItem, emptyLabel }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(Object.fromEntries(fields.map(f => [f.key, ""])));
  const [status, setStatus] = useState(null);

  const load = () => apiGet(endpoint).then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const add = async () => {
    const required = fields.filter(f => f.required !== false);
    if (required.some(f => !form[f.key])) return;
    try {
      await apiPost(endpoint, form);
      setForm(Object.fromEntries(fields.map(f => [f.key, ""])));
      setStatus(null);
      load();
    } catch (e) {
      setStatus("Échec — connectez-vous en tant qu'admin et vérifiez que le backend tourne.");
    }
  };

  const remove = async (id) => { try { await apiDelete(endpoint + id + "/"); load(); } catch (e) {} };

  return (
    <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
      {fields.map(f => (
        <input key={f.key} placeholder={f.label} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
      ))}
      <button onClick={add} style={{ justifySelf: "start", background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Ajouter</button>
      {status && <div style={{ fontSize: 12.5, color: C.orangeDeep }}>{status}</div>}

      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            {renderItem(item)}
            <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", color: C.orangeDeep, cursor: "pointer", fontSize: 12, fontFamily: MONO }}>Supprimer</button>
          </div>
        ))}
        {items.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>{emptyLabel}</div>}
      </div>
    </div>
  );
}

export function AdminPartners() {
  return (
    <Panel>
      <SectionTitle>Logos partenaires</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 14 }}>Défilent automatiquement sur la page d'accueil et la page À propos.</div>
      <SimpleCrudList
        endpoint="/api/partners/"
        fields={[
          { key: "name", label: "Nom du partenaire" },
          { key: "logo_url", label: "URL du logo (image)" },
          { key: "website_url", label: "Site web (optionnel)", required: false },
        ]}
        renderItem={(p) => (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={p.logo_url} alt={p.name} style={{ height: 28, objectFit: "contain" }} />
            <span style={{ fontSize: 13.5, color: C.ink }}>{p.name}</span>
          </div>
        )}
        emptyLabel="Aucun partenaire pour l'instant."
      />
    </Panel>
  );
}

export function AdminTeam() {
  return (
    <Panel>
      <SectionTitle>Membres de l'équipe</SectionTitle>
      <SimpleCrudList
        endpoint="/api/team/"
        fields={[
          { key: "full_name", label: "Nom complet" },
          { key: "title", label: "Titre (ex : Fondateur)", required: false },
          { key: "role", label: "Poste (ex : Responsable agronomie)", required: false },
          { key: "photo_url", label: "URL de la photo (optionnel)", required: false },
        ]}
        renderItem={(m) => (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {m.photo_url && <img src={m.photo_url} alt={m.full_name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />}
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{m.full_name}</div>
              <div style={{ fontSize: 12, color: C.inkDim }}>{[m.title, m.role].filter(Boolean).join(" · ")}</div>
            </div>
          </div>
        )}
        emptyLabel="Aucun membre pour l'instant."
      />
    </Panel>
  );
}

export function AdminHeroMedia() {
  return (
    <Panel>
      <SectionTitle>Bandeau vidéo/image de l'accueil</SectionTitle>
      <div style={{ fontSize: 13, color: C.inkDim, marginBottom: 14 }}>
        Remplace les illustrations animées par défaut. Renseignez soit une image, soit une vidéo (la vidéo est prioritaire si les deux sont remplies).
      </div>
      <SimpleCrudList
        endpoint="/api/hero-media/"
        fields={[
          { key: "title", label: "Titre" },
          { key: "text", label: "Texte descriptif", required: false },
          { key: "image_url", label: "URL de l'image (optionnel)", required: false },
          { key: "video_url", label: "URL de la vidéo (optionnel)", required: false },
        ]}
        renderItem={(m) => <div style={{ fontSize: 13.5, color: C.ink }}>{m.title}{m.video_url ? " · vidéo" : m.image_url ? " · image" : ""}</div>}
        emptyLabel="Aucun média personnalisé — les illustrations par défaut sont affichées."
      />
    </Panel>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(null);

  const load = () => apiGet("/api/admin/users/").then(setUsers).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);

  const remove = async (id, username) => {
    if (!window.confirm("Supprimer le compte de " + username + " ?")) return;
    try {
      await apiDelete("/api/admin/users/" + id + "/");
      load();
    } catch (e) {
      setStatus("Échec de la suppression.");
    }
  };

  return (
    <Panel>
      <SectionTitle right={users.length + " compte(s)"}>Comptes utilisateurs</SectionTitle>
      {status && <div style={{ fontSize: 12.5, color: C.orangeDeep, marginBottom: 10 }}>{status}</div>}
      <div style={{ display: "grid", gap: 8 }}>
        {users.map(u => (
          <div key={u.id} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{u.username} {u.is_staff && <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.orangeDeep }}>ADMIN</span>}</div>
              <div style={{ fontSize: 12, color: C.inkDim }}>{u.email} · {u.country || "—"} · {u.mogota_id}</div>
            </div>
            {!u.is_staff && (
              <button onClick={() => remove(u.id, u.username)} style={{ background: "none", border: "none", color: C.orangeDeep, cursor: "pointer", fontSize: 12, fontFamily: MONO }}>Supprimer</button>
            )}
          </div>
        ))}
        {users.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>Aucun compte.</div>}
      </div>
    </Panel>
  );
}
