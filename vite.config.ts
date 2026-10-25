import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Solo para `npm run dev`: el navegador cree que sitio y backend son el mismo origen (sin CORS) y las `url`
    // relativas de las fotos (`/photos/...`) funcionan tal cual. En producción lo hace el servidor web.
    proxy: {
      '/api': 'http://localhost:3001',
      '/photos': 'http://localhost:3001',
    },
  },
})
