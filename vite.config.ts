import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'CarnesGO',
        short_name: 'CarnesGO',
        description: 'Tiendas CarnesGO — venta de carnes en barrios cerrados',
        theme_color: '#1D9E75',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/productos/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-productos' }
          },
          {
            urlPattern: /\/api\/admin/,
            handler: 'NetworkOnly'
          },
          {
            urlPattern: /\/api\/ventas/,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})