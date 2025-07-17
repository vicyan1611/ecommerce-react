import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Your backend server address
        changeOrigin: true, // Recommended for virtual-hosted sites
        secure: false, // Set to false if your backend uses a self-signed SSL cert
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: remove /api from the start of the path
      },
    },
  },
});
