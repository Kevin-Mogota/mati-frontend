import { useState, useEffect } from "react";
import { apiGet, apiPost } from "./api";
import { REGIONS, CROPS } from "./data";
import { computeAdvice, mapBackendAdvisory } from "./advisory";

export function useBackendStatus() {
  const [status, setStatus] = useState("checking"); // checking | connected | offline
  useEffect(() => {
    let cancelled = false;
    apiGet("/api/regions/")
      .then(() => { if (!cancelled) setStatus("connected"); })
      .catch(() => { if (!cancelled) setStatus("offline"); });
    return () => { cancelled = true; };
  }, []);
  return status;
}

// Distinct from useBackendStatus: this tracks the BROWSER's own network connectivity
// (navigator.onLine + online/offline events), which is what the PWA offline mode
// actually cares about — a farmer with no signal at all, not just a backend that
// happens to be unreachable while the browser is otherwise online.
export function useNetworkStatus() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
}


export function useAdminAuth() {
  const [user, setUser] = useState(null); // null = not logged in
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    apiGet("/api/auth/session/")
      .then((d) => setUser(d.authenticated ? { id: d.id, username: d.username, isStaff: d.is_staff, country: d.country, region: d.region, phone: d.phone } : null))
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  const login = async (username, password) => {
    const data = await apiPost("/api/auth/login/", { username, password });
    setUser({ id: data.id, username: data.username, isStaff: data.is_staff, country: data.country, region: data.region, phone: data.phone });
  };
  const register = async (fields) => {
    const data = await apiPost("/api/auth/register/", fields);
    setUser({ id: data.id, username: data.username, isStaff: data.is_staff, country: data.country, region: data.region, phone: data.phone });
  };
  const logout = async () => {
    try { await apiPost("/api/auth/logout/", {}); } catch (e) {}
    setUser(null);
  };

  return { user, checked, login, register, logout };
}

/* ============================================================================
   ASSETS
============================================================================ */

export function useAdvisory(region, crop, backendStatus) {
  const [advice, setAdvice] = useState(() => computeAdvice(region, crop));

  useEffect(() => {
    let cancelled = false;
    if (backendStatus !== "connected") {
      setAdvice(computeAdvice(region, crop));
      return;
    }
    apiGet("/api/advisory/?region=" + encodeURIComponent(region) + "&crop=" + encodeURIComponent(crop))
      .then((data) => { if (!cancelled) setAdvice(mapBackendAdvisory(data)); })
      .catch(() => { if (!cancelled) setAdvice(computeAdvice(region, crop)); });
    return () => { cancelled = true; };
  }, [region, crop, backendStatus]);

  return advice;
}


export function useGeoSelection(backendStatus) {
  const [countries, setCountries] = useState(["Tchad"]);
  const [country, setCountry] = useState("Tchad");
  const [regionsList, setRegionsList] = useState(Object.keys(REGIONS).map(name => ({ name })));
  const [cropsList, setCropsList] = useState(Object.keys(CROPS).map(name => ({ name })));
  const [region, setRegion] = useState("N'Djaména");
  const [crop, setCrop] = useState("Sorgho");
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState(null);

  const refreshCountries = () => {
    if (backendStatus !== "connected") { setCountries(["Tchad"]); return; }
    apiGet("/api/regions/")
      .then(list => {
        const unique = [...new Set(list.map(r => r.country || "Tchad"))];
        setCountries(unique.length ? unique : ["Tchad"]);
      })
      .catch(() => setCountries(["Tchad"]));
  };

  useEffect(refreshCountries, [backendStatus]);

  // Load regions + crops for the selected country.
  useEffect(() => {
    if (backendStatus === "connected") {
      apiGet("/api/regions/")
        .then(list => {
          const filtered = list.filter(r => (r.country || "Tchad") === country);
          setRegionsList(filtered.length ? filtered : Object.keys(REGIONS).map(name => ({ name })));
        })
        .catch(() => setRegionsList(Object.keys(REGIONS).map(name => ({ name }))));
      apiGet("/api/crops/")
        .then(list => {
          const filtered = list.filter(c => (c.country || "Tchad") === country);
          setCropsList(filtered.length ? filtered : Object.keys(CROPS).map(name => ({ name })));
        })
        .catch(() => setCropsList(Object.keys(CROPS).map(name => ({ name }))));
    } else {
      setRegionsList(Object.keys(REGIONS).map(name => ({ name })));
      setCropsList(Object.keys(CROPS).map(name => ({ name })));
    }
  }, [backendStatus, country]);

  // Keep the selected region/crop valid when the list changes (e.g. country switch).
  useEffect(() => {
    if (regionsList.length && !regionsList.some(r => r.name === region)) setRegion(regionsList[0].name);
  }, [regionsList]);
  useEffect(() => {
    if (cropsList.length && !cropsList.some(c => c.name === crop)) setCrop(cropsList[0].name);
  }, [cropsList]);

  // Auto-provisioning: any user can type a country that isn't configured yet.
  // No admin gatekeeping — the backend caches the AI-generated result, so a
  // given country only ever costs one AI call regardless of how many users add it.
  const addCountry = async (newCountry) => {
    const name = newCountry.trim();
    if (!name || countries.includes(name)) { setCountry(name); return; }
    if (backendStatus !== "connected") {
      setProvisionError("Cette fonctionnalité nécessite le backend Django (non joignable dans cet aperçu).");
      return;
    }
    setProvisioning(true);
    setProvisionError(null);
    try {
      const [regionsRes, cropsRes] = await Promise.all([
        apiPost("/api/regions/ensure_country/", { country: name }),
        apiPost("/api/crops/ensure_country/", { country: name }),
      ]);
      setRegionsList(regionsRes);
      setCropsList(cropsRes);
      setCountries(prev => [...prev, name]);
      setCountry(name);
    } catch (e) {
      setProvisionError("Échec de la configuration automatique de ce pays — réessayez.");
    } finally {
      setProvisioning(false);
    }
  };

  return {
    countries, country, setCountry, regionsList, cropsList, region, setRegion, crop, setCrop,
    addCountry, provisioning, provisionError,
  };
}


export function useNotifications(authUser) {
  const [items, setItems] = useState([]);

  const refresh = () => {
    if (!authUser) { setItems([]); return; }
    apiGet("/api/notifications/").then(setItems).catch(() => setItems([]));
  };

  useEffect(() => {
    refresh();
    if (!authUser) return;
    const interval = setInterval(refresh, 30000); // light polling, no websocket in this prototype
    return () => clearInterval(interval);
  }, [authUser]);

  const markAllRead = async () => {
    try {
      await apiPost("/api/notifications/mark_all_read/", {});
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {}
  };

  const unreadCount = items.filter(n => !n.is_read).length;
  return { items, unreadCount, markAllRead, refresh };
}
