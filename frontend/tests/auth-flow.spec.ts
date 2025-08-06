import { test, expect } from '@playwright/test';

// JWT認証フローのe2eテスト - MSWなしで実際のAPIとの通信をテスト
test.describe('JWT Authentication Flow (Real API)', () => {
  test.beforeEach(async ({ page }) => {
    // 実APIを使用するよう環境変数を設定
    await page.addInitScript(() => {
      window.localStorage.setItem('VITE_USE_MSW', 'false');
      // デバッグ用
      console.log('Set VITE_USE_MSW to false');
    });
  });

  test('should successfully login and receive JWT token', async ({ page }) => {
    console.log('=== Testing Login Flow ===');
    
    // 古いトークンをクリア
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await expect(page).toHaveTitle(/lift_log/);
    
    // 通常のログインフォームに入力
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // ホームページにリダイレクトされることを確認
    await expect(page).toHaveURL('/');
    
    // トークンがlocalStorageに保存されていることを確認
    const token = await page.evaluate(() => {
      return localStorage.getItem('lift_log_auth_token');
    });
    
    console.log('Stored token:', token ? `${token.substring(0, 50)}...` : 'none');
    expect(token).toBeTruthy();
    expect(token).toMatch(/^eyJ/); // JWT token starts with 'eyJ'
    
    // JWTトークンの形式を検証
    const tokenParts = token?.split('.');
    expect(tokenParts).toHaveLength(3); // header.payload.signature
  });

  test('should make authenticated API calls after login', async ({ page }) => {
    console.log('=== Testing Authenticated API Calls ===');
    
    // まずログイン
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    // 通常のログインフォームに入力
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    // API呼び出しを監視
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/exercises') && response.request().method() === 'GET'
    );
    
    // エクササイズページに移動（API呼び出しが発生）
    await page.goto('/exercises');
    
    // API レスポンスを待つ
    const response = await responsePromise;
    console.log('API Response status:', response.status());
    console.log('API Response URL:', response.url());
    
    // API呼び出しが成功することを確認
    expect(response.status()).toBe(200);
    
    // レスポンスヘッダーを確認
    const authHeader = response.request().headers()['authorization'];
    console.log('Authorization header:', authHeader ? `${authHeader.substring(0, 30)}...` : 'none');
    expect(authHeader).toBeTruthy();
    expect(authHeader).toMatch(/^Bearer /);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    console.log('=== Testing API Error Handling ===');
    
    // 無効なトークンを設定
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('lift_log_auth_token', 'invalid.jwt.token');
    });
    
    // ページを再読み込み
    await page.reload();
    
    // API呼び出しエラーを監視
    const errorResponsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/exercises') && 
      (response.status() === 401 || response.status() === 403)
    );
    
    // エクササイズページに移動
    await page.goto('/exercises');
    
    // エラーレスポンスを確認
    const errorResponse = await errorResponsePromise;
    console.log('Error response status:', errorResponse.status());
    expect([401, 403]).toContain(errorResponse.status());
  });

  test('should maintain authentication across page reloads', async ({ page }) => {
    console.log('=== Testing Authentication Persistence ===');
    
    // ログイン
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    // 通常のログインフォームに入力
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    // トークンを確認
    const tokenBefore = await page.evaluate(() => {
      return localStorage.getItem('lift_log_auth_token');
    });
    expect(tokenBefore).toBeTruthy();
    
    // ページをリロード
    await page.reload();
    
    // トークンが維持されていることを確認
    const tokenAfter = await page.evaluate(() => {
      return localStorage.getItem('lift_log_auth_token');
    });
    expect(tokenAfter).toBe(tokenBefore);
    
    // 認証が必要なページにアクセスできることを確認
    await page.goto('/exercises');
    await expect(page).toHaveURL('/exercises');
  });

  test('should logout and clear authentication', async ({ page }) => {
    console.log('=== Testing Logout Flow ===');
    
    // ログイン
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    // 通常のログインフォームに入力
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    // ログアウト
    await page.click('text=ログアウト');
    
    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/login');
    
    // トークンがクリアされていることを確認
    const token = await page.evaluate(() => {
      return localStorage.getItem('lift_log_auth_token');
    });
    expect(token).toBeNull();
  });
});