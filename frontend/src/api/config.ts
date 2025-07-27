// API設定
const getBaseUrl = (): string => {
  const useMSW = import.meta.env.VITE_USE_MSW === 'true'
  
  if (useMSW) {
    // MSW使用時は相対パス（Service Workerがインターセプト）
    return '/api'
  } else {
    // 実API使用時は環境変数から取得、またはプロキシ経由の相対パス
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    if (apiBaseUrl) {
      return `${apiBaseUrl}/api`
    }
    // プロキシ経由の場合は相対パス
    return '/api'
  }
}

export const BASE_URL = getBaseUrl()

// デバッグ用ログ
console.log(`API Base URL: ${BASE_URL} (MSW: ${import.meta.env.VITE_USE_MSW})`)