import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // Expose API URL at build time as a fallback constant
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'https://ai-interior-final-project.onrender.com/api'),
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL ? env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  }
})
