import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info', // Show Vite info messages (incl. localhost URL)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
  ],
  build: {
    sourcemap: true, // התוספת הזו מונעת את שגיאת ה-Best Practices
  }
});