import { getAuthHeader } from '../utils/auth'

// API設定
const getBaseUrl = (): string => {
  const useMSW = import.meta.env.VITE_USE_MSW === 'true'
  
  if (useMSW) {
    // MSW使用時は相対パス（Service Workerがインターセプト）
    return '/api/v1'
  } else {
    // 実API使用時は環境変数から取得（直接APIサーバーに接続）
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    return `${apiBaseUrl}/api/v1`
  }
}

export const BASE_URL = getBaseUrl()

// 認証ヘッダー付きのfetch関数
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const authHeaders = getAuthHeader()
  
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  }
  
  return fetch(url, mergedOptions)
}

// デバッグ用ログ
console.log(`API Base URL: ${BASE_URL}`)
console.log(`VITE_USE_MSW: ${import.meta.env.VITE_USE_MSW}`)
console.log(`VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}`)
console.log(`import.meta.env.DEV: ${import.meta.env.DEV}`)
console.log(`import.meta.env.PROD: ${import.meta.env.PROD}`)

// デフォルトエクスポート
export default { BASE_URL, authenticatedFetch }