import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true, // This allows access from outside the container
    port: 5173, // Ensure this matches your Docker EXPOSE and -p port
    watch: {
      usePolling: true, // Necessary if you want Hot Module Replacement (HMR) to work on Windows/Docker
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
