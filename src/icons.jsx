import React from "react";
import { C } from "./theme";

export const Icon = {
  Seed: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C7 6 5 10 5 14a7 7 0 0014 0c0-4-2-8-7-12z" stroke={C.navy} strokeWidth="1.4" fill={C.green}/><path d="M12 22V13" stroke={C.navy} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Drop: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3s6 7 6 11.5A6 6 0 016 14.5C6 10 12 3 12 3z" stroke={C.navy} strokeWidth="1.4" fill={C.orange}/></svg>),
  Rain: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 14a5 5 0 019.9-1.1A4 4 0 0117 21H7a4.5 4.5 0 01-.5-8.9" stroke={C.navy} strokeWidth="1.4" fill={C.bgAlt}/><path d="M8 19l-1 3M12 19l-1 3M16 19l-1 3" stroke={C.orange} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Sun: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" fill={C.orange} stroke={C.navy} strokeWidth="1.2"/><g stroke={C.orangeDeep} strokeWidth="1.4" strokeLinecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></g></svg>),
  Alert: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3L2 20h20L12 3z" stroke={C.navy} strokeWidth="1.4" fill={C.orange}/><path d="M12 10v4M12 17h.01" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Sms: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="13" rx="2" stroke={C.navy} strokeWidth="1.4" fill={C.bgAlt}/><path d="M6 9h12M6 12.5h8" stroke={C.greenDeep} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Send: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 16-3-6-7-2z" stroke={C.bg} strokeWidth="1.6" fill={C.bg} strokeLinejoin="round"/></svg>),
  Bot: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="12" rx="3" stroke={C.navy} strokeWidth="1.4" fill={C.bgAlt}/><circle cx="9" cy="13" r="1.4" fill={C.green}/><circle cx="15" cy="13" r="1.4" fill={C.green}/><path d="M12 3v4" stroke={C.navy} strokeWidth="1.4"/><circle cx="12" cy="3" r="1.2" fill={C.orange}/></svg>),
  Soil: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke={C.navy} strokeWidth="1.4"/><path d="M3 21c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke={C.orange} strokeWidth="1.4"/><path d="M6 15l1.5-4M12 15l1-5M18 15l-1-4" stroke={C.greenDeep} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Care: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 21c-4-2-7-5.5-7-9a7 7 0 0114 0c0 3.5-3 7-7 9z" stroke={C.navy} strokeWidth="1.3" fill={C.greenTint}/><path d="M12 16V9M12 9c-1.5 0-2.5-1-2.5-2.5M12 9c1.5 0 2.5-1 2.5-2.5" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Harvest: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3c3 2 5 6 5 10a5 5 0 01-10 0c0-4 2-8 5-10z" stroke={C.navy} strokeWidth="1.3" fill={C.orangeTint}/><path d="M12 21v-8" stroke={C.orangeDeep} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Storage: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 9l6-5 6 5v10a1 1 0 01-1 1H7a1 1 0 01-1-1V9z" stroke={C.navy} strokeWidth="1.3" fill={C.bgAlt}/><path d="M9 20v-6h6v6" stroke={C.greenDeep} strokeWidth="1.3"/></svg>),
};


export const STAGE_ICON = { soil: Icon.Soil, seed: Icon.Seed, care: Icon.Care, harvest: Icon.Harvest, storage: Icon.Storage };

/* ============================================================================
   REUSABLE PIECES
============================================================================ */
