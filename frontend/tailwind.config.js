/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === デザインシステム 5色パレット ===
        // メインカラー: #F1EFDF (クリーム/ベージュ)
        // サブカラー: #26272A (ダークグレー/黒)
        // アクセントカラー: #E86029 (オレンジ)
        // コンテナカラー: #3B3C3F (グレー)
        // ホワイト: #FFFFFF
        
        // 基本カラーパレット
        main: '#F1EFDF',        // メインカラー
        sub: '#26272A',         // サブカラー
        accent: '#E86029',      // アクセントカラー
        container: '#3B3C3F',   // コンテナカラー
        pure: '#FFFFFF',        // ピュアホワイト

        // デザインシステム - 用途別色定義
        surface: {
          primary: '#F1EFDF',     // ベース画面背景（ベージュ）
          secondary: '#26272A',   // コンポーネント背景（黒め）
          container: '#3B3C3F',   // 入力欄・内部要素背景
        },
        
        content: {
          primary: '#26272A',     // メインテキスト (ベース背景上)
          secondary: '#F1EFDF',   // セカンダリテキスト (黒背景上)
          accent: '#E86029',      // アクセントテキスト
          inverse: '#FFFFFF',     // 反転テキスト (オレンジ背景上)
        },
        
        interactive: {
          primary: '#E86029',     // プライマリボタン
          secondary: '#3B3C3F',   // セカンダリボタン
          surface: '#26272A',     // インタラクティブサーフェス
        },
        
        navigation: {
          bg: '#E86029',          // ナビゲーション背景
          text: '#FFFFFF',        // ナビゲーションテキスト
          active: '#FFFFFF',      // アクティブ状態
          inactive: 'rgba(255,255,255,0.7)', // 非アクティブ状態
        },
        
        input: {
          bg: '#3B3C3F',          // 入力欄背景
          text: '#F1EFDF',        // 入力テキスト
          placeholder: 'rgba(241,239,223,0.6)', // プレースホルダー
        },
      },
      fontFamily: {
        'dotgothic': ['DotGothic16', 'monospace'],
      },
    },
  },
  plugins: [],
}