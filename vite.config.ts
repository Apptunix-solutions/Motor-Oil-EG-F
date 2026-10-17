import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'zaytstore-icon.svg', 'zaytstore-favicon.svg'],
      manifest: {
        name: 'ZaytStore — زيوت السيارات في سوريا',
        short_name: 'ZaytStore',
        description: 'متجر ZaytStore لزيوت السيارات وقطع الغيار الأصلية في سوريا.',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#0F3D20',
        background_color: '#0F3D20',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/zaytstore-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/zaytstore-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: { navigateFallback: '/' },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
