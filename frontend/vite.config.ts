import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: Number(process.env.FRONTEND_PORT),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.SERVER_PORT}`,
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: Number(process.env.FRONTEND_PREVIEW_PORT),
    // previewモードでも環境変数を読み込む
    cors: true,
  },
  build: {
    // MSWのService Workerファイルを本番ビルドに含める
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    // 静的アセットをコピー
    assetsDir: 'assets',
  },
  // 本番環境でも静的ファイルを正しく配信
  publicDir: 'public',
})