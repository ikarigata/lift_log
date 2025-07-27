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
  if (!token || !isTokenValid(token)) {
    return {}
  }
  
  return {
    Authorization: `Bearer ${token}`
  }
}