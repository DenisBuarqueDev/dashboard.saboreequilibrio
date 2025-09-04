import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // força rodar na porta 3000
    host: true, // permite acessar pela rede local também (opcional)
  },
})
