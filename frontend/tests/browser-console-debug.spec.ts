import { test, expect } from '@playwright/test';

test('browser console debug', async ({ page }) => {
  console.log('=== Browser Console Debug Test ===');
  
  // ブラウザのコンソールログを監視
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('🎫') || text.includes('❌') || text.includes('✅') || text.includes('🔍') || 
        text.includes('🔐') || text.includes('💾') || text.includes('🔄') || text.includes('📊') ||
        text.includes('🧹') || text.includes('localStorage')) {
      console.log(`[BROWSER] ${text}`);
    }
  });
  
  // localStorage変更をトレース
  await page.addInitScript(() => {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;
    
    localStorage.setItem = function(key, value) {
      console.log('📝 localStorage.setItem:', key, value.substring(0, 50) + '...');
      return originalSetItem.call(this, key, value);
    };
    
    localStorage.removeItem = function(key) {
      console.log('🗑️ localStorage.removeItem:', key);
      return originalRemoveItem.call(this, key);
    };
    
    localStorage.clear = function() {
      console.log('💥 localStorage.clear() called');
      console.trace('localStorage.clear stack trace');
      return originalClear.call(this);
    };
  });
  
  // ログインページにアクセス
  await page.goto('/login');
  
  // ページのHTMLを確認
  const loginButtonExists = await page.locator('button:has-text("🔓 開発用ログイン")').count();
  console.log('🔍 Dev login button count:', loginButtonExists);
  
  if (loginButtonExists === 0) {
    console.log('❌ Dev login button not found, looking for other buttons...');
    const allButtons = await page.locator('button').all();
    console.log('📋 All buttons:', await Promise.all(allButtons.map(b => b.textContent())));
  }
  
  // 開発用ログインでログイン
  await page.click('button:has-text("🔓 開発用ログイン")');
  
  // ホームページにリダイレクトされるのを待つ
  await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
  
  console.log('✅ Login successful, now moving to /exercises');
  
  // エクササイズページに移動してAPIリクエストを発生させる
  await page.goto('/exercises');
  
  // 少し待ってAPIリクエストが完了するのを待つ
  await page.waitForTimeout(3000);
  
  const currentUrl = page.url();
  console.log('📍 Final URL:', currentUrl);
});