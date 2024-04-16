import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "prompt",
  // includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "ChatPWA",
    short_name: "MiAppChatPWA",
    description: "Chat en React con PWA construida con Vite.",
    theme_color: "#000000",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/chat-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/chat-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      ...manifestForPlugin,
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
