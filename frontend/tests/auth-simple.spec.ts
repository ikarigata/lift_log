import { test, expect } from '@playwright/test';

test('simple login and API test', async ({ page }) => {
  console.log('Testing simple login and API call...');
  
  // ログインページに移動
  await page.goto('/login');
  
  // デバッグ: ページタイトルを確認
  const title = await page.title();
  console.log('Page title:', title);
  
  // デバッグ: MSW状態を確認
  const mswStatus = await page.evaluate(() => {
    // @ts-ignore
    const viteEnv = window.import?.meta?.env?.VITE_USE_MSW;
    return {
      hasServiceWorker: !!navigator.serviceWorker,
      localStorageCheck: localStorage.getItem('VITE_USE_MSW'),
      windowViteEnv: viteEnv
    };
  });
  console.log('MSW Status:', mswStatus);
  
  // 開発用ログインボタンをクリック
  await page.click('button:has-text("🔓 開発用ログイン")');
  
  // リダイレクト先を確認
  await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
  
  // トークンをチェック
  const token = await page.evaluate(() => localStorage.getItem('lift_log_auth_token'));
  console.log('Token after login:', token ? `${token.substring(0, 50)}...` : 'none');
  
  // APIリクエストが発生するページに移動
  await page.goto('/exercises');
  
  // ページの状態を確認
  const currentUrl = page.url();
  console.log('Current URL after going to /exercises:', currentUrl);
  
  if (currentUrl.includes('/login')) {
    console.log('❌ Redirected to login - authentication not working');
    // デバッグ: 認証チェック関数の状態を確認
    const authDebug = await page.evaluate(() => {
      const token = localStorage.getItem('lift_log_auth_token');
      if (!token) return { error: 'No token found' };
      
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        const now = Math.floor(Date.now() / 1000);
        return {
          hasToken: true,
          tokenExp: decoded.exp,
          currentTime: now,
          isExpired: decoded.exp <= now,
          userId: decoded.userId
        };
      } catch (e) {
        return { error: 'Failed to decode token', tokenPreview: token.substring(0, 20) };
      }
    });
    console.log('Auth debug info:', authDebug);
  } else {
    console.log('✅ Successfully accessed /exercises page');
  }
});