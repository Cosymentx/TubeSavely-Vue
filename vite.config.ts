import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['axios']
  },
  server: { 
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:9527',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})