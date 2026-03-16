import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';
import packageJson from './package.json';

export default defineConfig({
  define: {
    '__APP_VERSION__': JSON.stringify(packageJson.version),
  },
  plugins: [
    vue(), 
    tailwindcss(),
    VitePWA({
      // Auto-actualiza la app en segundo plano cuando s lanza una nueva versión
      registerType: 'autoUpdate', 
      
      // Archivos estáticos de public/ que la PWA guardará en caché
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-32x32.png', 'favicon-16x16.png'], 
      
      // El manifiesto que lee Chrome/Safari para instalar la app
      manifest: {
        name: 'CercAPP Plataforma Financiera',
        short_name: 'CercAPP',
        description: 'Gestión de portafolios, inversiones y pagos.',
        theme_color: '#0f172a', // Azul cercapp-navy
        background_color: '#f8fafc', // Fondo slate-50
        display: 'standalone', // Hace que se abra sin la barra de direcciones del navegador
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Importante para que Android le ponga fondo dinámico al ícono
          }
        ]
      }
    })
  ],
})
