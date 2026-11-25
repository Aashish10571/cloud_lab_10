import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api is proxied to your Express server, so no CORS setup is needed in dev.
// Change the port if your backend runs elsewhere.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:8080" } },
});
