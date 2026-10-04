import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["assets/logo.png", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "Mogota Agri-Tech Innovation",
        short_name: "Mogota",
        description: "Conseil agro-climatique pour les producteurs — utilisable hors ligne.",
        theme_color: "#16283F",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        // Android/Chrome's installability check specifically requires a declared
        // icon ≥192px AND a separate one ≥512px — a single 500x500 icon (the
        // previous setup) satisfies neither threshold strictly and can silently
        // block the native "Install app" prompt on some Android versions.
        // These live in /public (not /src/assets) so Vite serves them at a fixed
        // path instead of hashing the filename through the JS import pipeline.
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cache the app shell + all built assets so the interface itself opens offline.
        globPatterns: ["**/*.{js,css,html,png,svg}"],
        runtimeCaching: [
          {
            // Guide de culture and the day's advisory are the two things a farmer
            // most needs available with no signal — cache them as they're fetched,
            // and serve the cached copy instantly on repeat visits/offline.
            urlPattern: ({ url }) => url.pathname.startsWith("/api/crops") || url.pathname.startsWith("/api/advisory"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "mati-advisory-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 1 week
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/regions"),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "mati-regions-cache" },
          },
        ],
      },
    }),
  ],
});
