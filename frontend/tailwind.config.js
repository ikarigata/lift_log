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
        // CSS変数でテーマを管理
        
        // 基本カラーパレット
        main: 'rgb(var(--color-main) / <alpha-value>)',
        sub: 'rgb(var(--color-sub) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        container: 'rgb(var(--color-container) / <alpha-value>)',
        pure: 'rgb(var(--color-pure) / <alpha-value>)',

        // デザインシステム - 用途別色定義
        surface: {
          primary: 'rgb(var(--color-surface-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-surface-secondary) / <alpha-value>)',
          container: 'rgb(var(--color-surface-container) / <alpha-value>)',
        },
        
        content: {
          primary: 'rgb(var(--color-content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-content-accent) / <alpha-value>)',
          inverse: 'rgb(var(--color-content-inverse) / <alpha-value>)',
        },
        
        interactive: {
          primary: 'rgb(var(--color-interactive-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-interactive-secondary) / <alpha-value>)',
          surface: 'rgb(var(--color-interactive-surface) / <alpha-value>)',
        },
        
        navigation: {
          bg: 'rgb(var(--color-navigation-bg) / <alpha-value>)',
          text: 'rgb(var(--color-navigation-text) / <alpha-value>)',
          active: 'rgb(var(--color-navigation-active) / <alpha-value>)',
          inactive: 'rgb(var(--color-navigation-inactive) / 0.7)',
        },
        
        input: {
          bg: 'rgb(var(--color-input-bg) / <alpha-value>)',
          text: 'rgb(var(--color-input-text) / <alpha-value>)',
          placeholder: 'rgb(var(--color-input-placeholder) / 0.6)',
        },
      },
      fontFamily: {
        'dotgothic': ['DotGothic16', 'monospace'],
      },
    },
  },
  plugins: [],
}