import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // This makes the server accessible from other devices on your network
    port: 5173, // Optional: explicitly set the port (default is 5173)
  }
})
