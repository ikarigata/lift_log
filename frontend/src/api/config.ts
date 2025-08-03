import { getAuthHeader } from '../utils/auth'

// API設定
const getBaseUrl = (): string => {
  const useMSW = import.meta.env.VITE_USE_MSW === 'true'
  
  if (useMSW) {
    // MSW使用時は相対パス（Service Workerがインターセプト）
    return '/api/v1'
  } else {
    // 実API使用時は環境変数から取得（直接APIサーバーに接続）
    // Docker環境では、VITE_API_BASE_URLが設定されていない場合、相対パス（''）を使用する
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
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
console.log(`API Base URL: ${BASE_URL} (MSW: ${import.meta.env.VITE_USE_MSW})`)

// デフォルトエクスポート
export default { BASE_URL, authenticatedFetch }