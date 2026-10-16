import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Se actualiza sola cuando cambies el código
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Mi Entrenador Personal',
        short_name: 'Coach',
        description: 'Programa híbrido de Calistenia y Carrera',
        theme_color: '#111827', // Color de la barra de estado del celular (gris oscuro)
        background_color: '#030712',
        display: 'standalone', // Esto oculta la barra del navegador
        icons: [
          {
            // Usamos un ícono provisional de internet para que funcione rápido
            src: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})