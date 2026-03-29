import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Whenever your React app makes a request to '/api', 
      // Vite will automatically forward it to your backend.
      '/api': {
        target: 'http://localhost:5000', // Replace 5000 with your actual Node backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})