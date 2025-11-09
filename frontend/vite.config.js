import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // This is needed to ensure Tailwind works with Vite
      config: './tailwind.config.js'
    })
  ],
})
