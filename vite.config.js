import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  // ==========================================
  // DEVELOPMENT SERVER
  // ==========================================
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:51763',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },

      // Ảnh / nhạc upload lên server API
      '/Uploads': {
        target: 'http://localhost:51763',
        changeOrigin: true,
        secure: false
      }
    },

    client: {
      overlay: false
    }
  },

  // ==========================================
  // ALIAS
  // ==========================================
  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url)
      )
    }
  },

  // ==========================================
  // PLUGINS
  // ==========================================
  plugins: [
    vue(),

    vuetify({
      autoImport: true
    })
  ],

  // ==========================================
  // PRODUCTION BUILD
  // ==========================================
  build: {
    // Không tạo source map cho production
    sourcemap: false,

    // Minify JavaScript
    minify: 'esbuild',

    // Minify CSS
    cssMinify: true,

    // Xóa console và debugger khi build production
    esbuild: {
      drop: ['console', 'debugger']
    },

    rollupOptions: {
      output: {
        // Tên file có hash
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})