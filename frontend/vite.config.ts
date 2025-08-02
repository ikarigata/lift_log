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
    port: 5173,
    // プロキシなし - MSWまたは直接APIコールを使用
  },
  preview: {
    port: 4173,
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