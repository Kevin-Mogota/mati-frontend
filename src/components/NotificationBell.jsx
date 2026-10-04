import React, { useState } from "react";
import { C, MONO, BODY } from "../theme";

export function NotificationBell({ notifications }) {
  const [open, setOpen] = useState(false);
  const { items, unreadCount, markAllRead } = notifications;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }} style={{
        position: "relative", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
        width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3a5 5 0 00-5 5v3.5L5 15h14l-2-3.5V8a5 5 0 00-5-5z" stroke="#fff" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
          <path d="M9.5 18a2.5 2.5 0 005 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2, background: C.orange, color: "#fff",
            fontFamily: MONO, fontSize: 10, fontWeight: 700, borderRadius: 999,
            minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
          }}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: 44, right: 0, width: 300, maxHeight: 360, overflowY: "auto",
          background: C.bg, border: "1px solid " + C.border, borderRadius: 12, boxShadow: "0 8px 24px rgba(15,30,51,0.18)",
          zIndex: 20, padding: 8,
        }}>
          {items.length === 0 && (
            <div style={{ fontSize: 13, color: C.inkDim, padding: 12 }}>Aucune notification.</div>
          )}
          {items.map(n => (
            <div key={n.id} style={{ padding: "10px 10px", borderBottom: "1px solid " + C.border, fontSize: 13, color: C.ink, lineHeight: 1.4 }}>
              {n.message}
              <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.inkDim, marginTop: 3 }}>
                {new Date(n.created_at).toLocaleString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
