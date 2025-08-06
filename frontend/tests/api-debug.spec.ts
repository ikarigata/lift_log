import { test, expect } from '@playwright/test';

test('API request debugging', async ({ page }) => {
  console.log('=== API Request Debug Test ===');
  
  // リクエストとレスポンスを監視
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`📤 API Request: ${request.method()} ${request.url()}`);
      console.log(`   Headers:`, request.headers());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`📥 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  // ログインページにアクセス
  await page.goto('/login');
  
  // 開発用ログインでログイン
  await page.click('button:has-text("🔓 開発用ログイン")');
  
  // ホームページにリダイレクトされるのを待つ
  await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
  
  // トークンを確認
  const token = await page.evaluate(() => localStorage.getItem('lift_log_auth_token'));
  console.log('🎫 Token stored:', token ? `${token.substring(0, 50)}...` : 'none');
  
  // エクササイズページに移動してAPIリクエストを発生させる
  console.log('🚀 Navigating to /exercises to trigger API calls...');
  await page.goto('/exercises');
  
  // 少し待ってAPIリクエストが完了するのを待つ
  await page.waitForTimeout(2000);
  
  const currentUrl = page.url();
  console.log('📍 Final URL:', currentUrl);
  
  if (currentUrl.includes('/login')) {
    console.log('❌ ERROR: Redirected back to login page');
    
    // 認証状態をデバッグ
    const authDebug = await page.evaluate(() => {
      const authToken = localStorage.getItem('lift_log_auth_token');
      if (!authToken) return { error: 'No token in localStorage' };
      
      try {
        const parts = authToken.split('.');
        if (parts.length !== 3) return { error: 'Invalid token format' };
        
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        return {
          tokenExists: true,
          payload,
          isExpired: payload.exp < now,
          timeLeft: payload.exp - now
        };
      } catch (e) {
        return { error: 'Failed to decode token', message: e.message };
      }
    });
    
    console.log('🔍 Auth Debug:', authDebug);
  } else {
    console.log('✅ SUCCESS: Stayed on /exercises page');
  }
});