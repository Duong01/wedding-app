import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:51763',
        changeOrigin: true,
        secure: false,

        rewrite: (path) => path
      }
    },

    client: {
      overlay: false
    }
  },

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url)
      )
    }
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
})
