import { env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ownerLoginServer = env.OWNER_LOGIN_SERVER_URL || 'http://localhost:3000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/owner-auth': {
        target: ownerLoginServer,
        changeOrigin: true,
        rewrite: () => '/login',
      },
    },
  },
})
