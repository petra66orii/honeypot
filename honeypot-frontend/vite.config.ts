import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_ASSET_BASE || '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
