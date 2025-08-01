/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === ライトテーマカラーパレット ===
        // アクセントカラー: #0D6EFD (青)
        
        // 基本カラーパレット
        main: '#F8F9FA',        // メイン背景
        sub: '#212529',         // メインテキスト
        accent: '#0D6EFD',      // アクセントカラー
        container: '#E9ECEF',   // コンテナ背景
        pure: '#FFFFFF',        // ピュアホワイト
        secondary: '#6C757D',   // セカンダリテキスト

        // デザインシステム - 用途別色定義
        surface: {
          primary: '#F8F9FA',     // ベース画面背景
          secondary: '#FFFFFF',   // コンポーネント背景
          container: '#E9ECEF',   // 入力欄・内部要素背景
        },
        
        content: {
          primary: '#212529',     // メインテキスト
          secondary: '#6C757D',   // セカンダリテキスト
          accent: '#0D6EFD',      // アクセントテキスト
          inverse: '#FFFFFF',     // 反転テキスト (青背景上)
        },
        
        interactive: {
          primary: '#0D6EFD',     // プライマリボタン
          secondary: '#E9ECEF',   // セカンダリボタン
          surface: '#FFFFFF',     // インタラクティブサーフェス
        },
        
        navigation: {
          bg: '#FFFFFF',          // ナビゲーション背景
          text: '#6C757D',        // ナビゲーションテキスト
          active: '#0D6EFD',      // アクティブ状態
          inactive: '#6C757D',    // 非アクティブ状態
        },
        
        input: {
          bg: '#E9ECEF',          // 入力欄背景
          text: '#212529',        // 入力テキスト
          placeholder: 'rgba(108, 117, 125, 0.6)', // プレースホルダー
        },
      },
      fontFamily: {
        'dotgothic': ['DotGothic16', 'monospace'],
      },
    },
  },
  plugins: [],
}