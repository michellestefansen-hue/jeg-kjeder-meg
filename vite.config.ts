import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Skru av service worker caching av navigasjonsruter
      workbox: {
        navigateFallback: null,
        runtimeCaching: [],
      },
      manifest: {
        name: 'Lokka',
        short_name: 'Lokka',
        description: 'Planlegg gøye ting med vennene dine',
        theme_color: '#ec4899',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/favicon.png', sizes: '192x192', type: 'image/png' },
          { src: '/favicon.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
