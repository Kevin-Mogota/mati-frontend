import React, { useState, useEffect } from "react";
import { C, MONO, DISPLAY, BODY } from "../theme";
import { Panel, SectionTitle } from "../components/common";
import { apiGet, apiPost } from "../api";

function CommunityPicker({ communities, activeId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
      <button onClick={() => onSelect(null)} style={{
        background: activeId === null ? C.navy : C.bgAlt, color: activeId === null ? "#fff" : C.ink,
        border: "1px solid " + (activeId === null ? C.navy : C.border), borderRadius: 999,
        padding: "7px 14px", fontFamily: BODY, fontWeight: 600, fontSize: 13, cursor: "pointer",
      }}>Toutes les communautés</button>
      {communities.map(c => (
        <button key={c.id} onClick={() => onSelect(c.id)} style={{
          background: activeId === c.id ? C.navy : C.bgAlt, color: activeId === c.id ? "#fff" : C.ink,
          border: "1px solid " + (activeId === c.id ? C.navy : C.border), borderRadius: 999,
          padding: "7px 14px", fontFamily: BODY, fontWeight: 600, fontSize: 13, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <span>{c.icon}</span>{c.name}
          <span style={{ fontFamily: MONO, fontSize: 11, opacity: 0.75 }}>· {c.members_count}</span>
        </button>
      ))}
    </div>
  );
}

function CommunityJoinCard({ community, onToggled }) {
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    setLoading(true);
    try {
      const action = community.joined_by_me ? "leave" : "join";
      const res = await apiPost("/api/communities/" + community.id + "/" + action + "/", {});
      onToggled(community.id, res);
    } catch (e) {} finally { setLoading(false); }
  };
  return (
    <Panel style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{community.icon} {community.name}</div>
        <div style={{ fontSize: 12.5, color: C.inkDim, marginTop: 2 }}>{community.description}</div>
        <div style={{ fontFamily: MONO, fontSize: 11.5, color: C.inkDim, marginTop: 4 }}>{community.members_count} membre(s)</div>
      </div>
      <button onClick={toggle} disabled={loading} style={{
        background: community.joined_by_me ? C.bgAlt : C.green, color: community.joined_by_me ? C.ink : "#fff",
        border: "1px solid " + (community.joined_by_me ? C.border : C.green), borderRadius: 8,
        padding: "8px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1,
      }}>{community.joined_by_me ? "Quitter" : "Rejoindre"}</button>
    </Panel>
  );
}

export function ForumPostForm({ communities, defaultCommunityId, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState(defaultCommunityId || (communities[0] && communities[0].id) || "");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (defaultCommunityId) setCommunityId(defaultCommunityId); }, [defaultCommunityId]);

  const submit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      await apiPost("/api/forum/posts/", {
        title, content, community: communityId || null,
        image_url: imageUrl || "", video_url: videoUrl || "",
      });
      setTitle(""); setContent(""); setImageUrl(""); setVideoUrl("");
      onCreated();
    } catch (e) {
      setStatus("Échec — un compte connecté est nécessaire pour publier (et le backend doit être joignable).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel>
      <SectionTitle>Poser une question / signaler un problème</SectionTitle>
      <div style={{ display: "grid", gap: 8 }}>
        {communities.length > 0 && (
          <select className="mati-select" value={communityId} onChange={e => setCommunityId(e.target.value)}>
            {communities.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        )}
        <input placeholder="Titre (ex : Feuilles jaunes sur mon sorgho)" value={title} onChange={e => setTitle(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
        <textarea placeholder="Décrivez le problème…" value={content} onChange={e => setContent(e.target.value)} rows={3}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY, resize: "vertical" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="URL d'une photo (optionnel)" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, fontFamily: BODY }} />
          <input placeholder="URL d'une vidéo (optionnel)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13, fontFamily: BODY }} />
        </div>
        <button onClick={submit} disabled={loading} style={{
          justifySelf: "start", background: C.green, color: "#fff", border: "none", borderRadius: 8,
          padding: "9px 18px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: loading ? 0.6 : 1,
        }}>{loading ? "Publication…" : "Publier"}</button>
        {status && <div style={{ fontSize: 12.5, color: C.orangeDeep }}>{status}</div>}
      </div>
    </Panel>
  );
}

export function ForumPostDetail({ post, onBack, onLikeToggled }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState(null);

  const loadComments = () => apiGet("/api/forum/comments/?post=" + post.id).then(setComments).catch(() => setComments([]));
  useEffect(() => { loadComments(); }, [post.id]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await apiPost("/api/forum/comments/", { post: post.id, content: newComment });
      setNewComment("");
      loadComments();
    } catch (e) {
      setStatus("Échec — un compte connecté est nécessaire pour commenter.");
    }
  };

  return (
    <Panel>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.inkDim, cursor: "pointer", fontSize: 12.5, fontFamily: MONO, marginBottom: 14, padding: 0 }}>← Retour au forum</button>
      {post.community_name && (
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.greenDeep, textTransform: "uppercase", marginBottom: 6 }}>{post.community_name}</div>
      )}
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: C.navy, marginBottom: 4 }}>{post.title}</div>
      <div style={{ fontSize: 12, color: C.inkDim, marginBottom: 12 }}>{post.author_username} — {new Date(post.created_at).toLocaleString("fr-FR")}</div>
      <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, marginBottom: 16 }}>{post.content}</div>

      {post.image_url && <img src={post.image_url} alt="" style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 16 }} />}
      {post.video_url && <video src={post.video_url} controls style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 16 }} />}

      <button onClick={() => onLikeToggled(post)} style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: post.liked_by_me ? C.greenTint : C.bgAlt,
        border: "1px solid " + C.border, borderRadius: 999, padding: "5px 12px", fontFamily: BODY, fontSize: 12.5,
        fontWeight: 600, color: post.liked_by_me ? C.greenDeep : C.ink, cursor: "pointer", marginBottom: 20,
      }}>👍 {post.likes_count} {post.liked_by_me ? "· vous aimez" : ""}</button>

      <div style={{ fontSize: 12, fontWeight: 700, color: C.inkDim, textTransform: "uppercase", marginBottom: 10 }}>
        {comments.length} commentaire(s)
      </div>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {comments.map(c => (
          <div key={c.id} style={{ background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{c.author_username}</div>
            <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{c.content}</div>
          </div>
        ))}
        {comments.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>Aucun commentaire pour l'instant — soyez le premier à répondre.</div>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder="Votre réponse…" value={newComment} onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") addComment(); }}
          style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid " + C.border, fontSize: 13.5, fontFamily: BODY }} />
        <button onClick={addComment} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: BODY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Répondre</button>
      </div>
      {status && <div style={{ fontSize: 12.5, color: C.orangeDeep, marginTop: 8 }}>{status}</div>}
    </Panel>
  );
}

export function TabForum() {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const loadPosts = () => apiGet("/api/forum/posts/").then(setPosts).catch(() => setLoadError(
    "Le forum nécessite le backend Django (voir mogota-backend-django.zip) — non joignable dans cet aperçu."
  ));
  const loadCommunities = () => apiGet("/api/communities/").then(setCommunities).catch(() => setCommunities([]));

  useEffect(() => { loadPosts(); loadCommunities(); }, []);

  const toggleLike = async (post) => {
    try {
      const res = await apiPost("/api/forum/posts/" + post.id + "/like/", {});
      const update = (p) => p.id === post.id ? { ...p, liked_by_me: res.liked, likes_count: res.likes_count } : p;
      setPosts(prev => prev.map(update));
      if (selected && selected.id === post.id) setSelected(update(selected));
    } catch (e) {}
  };

  const onCommunityToggled = (id, res) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, joined_by_me: res.joined, members_count: res.members_count } : c));
  };

  if (selected) {
    return <ForumPostDetail post={selected} onBack={() => { setSelected(null); loadPosts(); }} onLikeToggled={toggleLike} />;
  }

  const visiblePosts = activeCommunity ? posts.filter(p => p.community === activeCommunity) : posts;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {communities.length > 0 && <CommunityPicker communities={communities} activeId={activeCommunity} onSelect={setActiveCommunity} />}

      {activeCommunity && (
        <CommunityJoinCard community={communities.find(c => c.id === activeCommunity)} onToggled={onCommunityToggled} />
      )}

      <ForumPostForm communities={communities} defaultCommunityId={activeCommunity} onCreated={() => { loadPosts(); loadCommunities(); }} />

      <Panel>
        <SectionTitle right={visiblePosts.length + " publication(s)"}>
          {activeCommunity ? communities.find(c => c.id === activeCommunity)?.name : "Toutes les discussions"}
        </SectionTitle>
        {loadError && <div style={{ fontSize: 13, color: C.orangeDeep }}>{loadError}</div>}
        <div style={{ display: "grid", gap: 10 }}>
          {visiblePosts.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{
              background: C.bgAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 14, cursor: "pointer",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{p.title}</div>
                <div style={{ fontSize: 11.5, color: C.inkDim, fontFamily: MONO, whiteSpace: "nowrap" }}>{p.author_username}</div>
              </div>
              {p.community_name && <div style={{ fontSize: 11, color: C.greenDeep, marginTop: 2 }}>{p.community_name}</div>}
              <div style={{ fontSize: 13, color: C.inkDim, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.content}</div>
              <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: C.inkDim }}>
                <span>👍 {p.likes_count}</span>
                <span>💬 {p.comments_count}</span>
                {(p.image_url || p.video_url) && <span>📎</span>}
              </div>
            </div>
          ))}
          {!loadError && visiblePosts.length === 0 && <div style={{ fontSize: 13, color: C.inkDim }}>Aucune discussion pour l'instant — soyez le premier à poster.</div>}
        </div>
      </Panel>
    </div>
  );
}
