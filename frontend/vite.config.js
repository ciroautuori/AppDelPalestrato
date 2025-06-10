import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite"; // Importa il plugin Tailwind

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // Aggiungi il plugin Tailwind
  ],
  server: {
    host: '0.0.0.0', // Configura l'host
    port: 8080        // Configura la porta
  }
});
