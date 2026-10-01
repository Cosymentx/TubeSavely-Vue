import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['axios']
  },
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'https://tubesavely-server.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})