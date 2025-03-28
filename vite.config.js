import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/naver/token": {
        target: "https://nid.naver.com/oauth2.0",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver\/token/, "/token"),
      },
     "/api/naver/user": {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver\/user/, "/v1/nid/me"),
      },
    },
  },
});
