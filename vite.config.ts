import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  server: {
    port: 5175,
    proxy: {
      '/v1': {
        target: 'https://backend.digantara.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
