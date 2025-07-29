import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/exchange': {
        target: 'https://tw.rter.info',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exchange/, '/capi.php')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})