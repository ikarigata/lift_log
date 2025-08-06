// JWT認証関連のユーティリティ関数

const TOKEN_KEY = 'lift_log_auth_token'

export interface User {
  id: string
  name?: string
  email?: string
}

export interface JWTPayload {
  userId: string
  exp: number
  iat: number
}

// トークンをlocalStorageに保存
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

// localStorageからトークンを取得
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// トークンを削除（ログアウト）
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// JWTトークンをデコード（簡易版、本番では適切なライブラリを使用）
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    
    const decoded = JSON.parse(atob(payload))
    return decoded as JWTPayload
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

// トークンの有効性をチェック
export const isTokenValid = (token: string): boolean => {
  const payload = decodeJWT(token)
  if (!payload) return false
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}

// 現在のユーザーIDを取得
export const getCurrentUserId = (): string | null => {
  const token = getToken()
  if (!token || !isTokenValid(token)) {
    return null
  }
  
  const payload = decodeJWT(token)
  return payload?.userId || null
}

// 認証状態をチェック
export const isAuthenticated = (): boolean => {
  const token = getToken()
  return token !== null && isTokenValid(token)
}

// Authorization ヘッダーを取得
export const getAuthHeader = (): Record<string, string> => {
  const token = getToken()
  console.log('🎫 getAuthHeader check:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    localStorage: typeof localStorage !== 'undefined' ? 'available' : 'unavailable',
    storageItems: typeof localStorage !== 'undefined' ? Object.keys(localStorage).filter(key => key.includes('lift_log')) : []
  })
  
  if (!token) {
    console.log('❌ No token found in localStorage')
    // デバッグ用：localStorageの内容をすべて確認
    if (typeof localStorage !== 'undefined') {
      console.log('📝 All localStorage items:', Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key)?.substring(0, 50) + '...'
        return acc
      }, {} as Record<string, string>))
    }
    return {}
  }
  
  const isValid = isTokenValid(token)
  console.log('🔍 Token validation:', {
    isValid,
    tokenPayload: token ? decodeJWT(token) : null
  })
  
  if (!isValid) {
    console.log('❌ Token is invalid, removing from storage')
    removeToken() // 無効なトークンを削除
    return {}
  }
  
  const header = {
    Authorization: `Bearer ${token}`
  }
  console.log('✅ Auth header created successfully')
  
  return header
}

// 開発時用: 古いトークンをクリアしてページをリロード
export const clearAuthAndReload = (): void => {
  removeToken()
  // sessionStorageもクリア
  sessionStorage.clear()
  // ページをリロード
  window.location.reload()
}