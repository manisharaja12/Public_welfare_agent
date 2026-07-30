import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/emergency/chat':           { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/analyse':        { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/severity':       { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/firstaid':       { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/report':         { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/hospitals':      { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/hospital':       { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/share-location': { target: 'http://localhost:5001', changeOrigin: true },
      '/emergency/sos':            { target: 'http://localhost:5001', changeOrigin: true },
      '/health':                   { target: 'http://localhost:5001', changeOrigin: true },
      '/chatbot/chat':              { target: 'http://localhost:5002', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
