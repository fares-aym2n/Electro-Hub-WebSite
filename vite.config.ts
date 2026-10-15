import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api/wishlist': {
        target: 'https://electro-hub-1.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/wishlist/, '/api/whitelist'),
      },
      '/api': {
        target: 'https://electro-hub-1.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
