import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 環境変数を読み込み
  const useMSW = process.env.VITE_USE_MSW === 'true'
  const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      // MSW使用時はプロキシを無効化、実API使用時はプロキシを有効化
      proxy: useMSW ? {} : {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
      },
    },
  }
})