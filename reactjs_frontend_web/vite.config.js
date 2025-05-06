import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // 👉 cần dòng này
  },
  define: {
    global: "window",
  },
});