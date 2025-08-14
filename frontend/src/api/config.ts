import { getAuthHeader } from '../utils/auth'

// API設定 - すべて相対パスで統一
const getBaseUrl = (): string => {
  // 開発環境: Viteプロキシ
  // プレビュー環境: MSW推奨
  // 統合テスト: Docker Nginxプロキシ  
  // 本番環境: Nginxプロキシ
  return '/api/v1'
}

export const BASE_URL = getBaseUrl()

// 認証ヘッダー付きのfetch関数
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const authHeaders = getAuthHeader()
  
  // デバッグログ: リクエスト詳細を出力
  console.log('🔐 authenticatedFetch:', {
    url,
    method: options.method || 'GET',
    authHeaders,
    hasToken: Object.keys(authHeaders).length > 0
  })
  
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  }
  
  console.log('📤 Request headers:', mergedOptions.headers)
  
  const response = await fetch(url, mergedOptions)
  
  console.log('📥 Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url
  })
  
  return response
}

// デバッグ用ログ
console.log(`API Base URL: ${BASE_URL} (MSW: ${import.meta.env.VITE_USE_MSW === 'true' ? 'enabled' : 'disabled'})`)

// デフォルトエクスポート
export default { BASE_URL, authenticatedFetch }