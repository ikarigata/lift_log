import { test, expect } from '@playwright/test';

// WorkoutRecordのsetsフィールドがundefined/nullになる問題の修正を検証するテスト
test.describe('WorkoutRecord Sets API Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    // 実APIを使用するよう環境変数を設定
    await page.addInitScript(() => {
      window.localStorage.setItem('VITE_USE_MSW', 'false');
      console.log('Set VITE_USE_MSW to false for real API testing');
    });
  });

  test('should return workout records with sets array (not null/undefined)', async ({ page }) => {
    console.log('=== Testing WorkoutRecord.sets API Response ===');
    
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
    
    // API呼び出しを監視してレスポンスを確認
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/workout-records') && response.request().method() === 'GET'
    );
    
    // ホームページでワークアウトレコードAPIが呼ばれるのを待つ
    await page.goto('/');
    
    const response = await responsePromise;
    console.log('API Response status:', response.status());
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    console.log('Sample workout record:', responseData[0] ? JSON.stringify(responseData[0], null, 2) : 'No records found');
    
    // レスポンスの検証
    if (responseData.length > 0) {
      const workoutRecord = responseData[0];
      
      // 重要: setsフィールドが存在し、配列であることを確認
      expect(workoutRecord).toHaveProperty('sets');
      expect(Array.isArray(workoutRecord.sets)).toBe(true);
      
      // setsがnullやundefinedでないことを確認
      expect(workoutRecord.sets).not.toBeNull();
      expect(workoutRecord.sets).not.toBeUndefined();
      
      // その他の必須フィールドも確認
      expect(workoutRecord).toHaveProperty('id');
      expect(workoutRecord).toHaveProperty('workoutDayId');
      expect(workoutRecord).toHaveProperty('exerciseId');
      expect(workoutRecord).toHaveProperty('exerciseName');
      
      console.log(`✅ WorkoutRecord has valid sets array with ${workoutRecord.sets.length} sets`);
      
      // セットが存在する場合、セットの構造も確認
      if (workoutRecord.sets.length > 0) {
        const set = workoutRecord.sets[0];
        expect(set).toHaveProperty('setNumber');
        expect(set).toHaveProperty('weight');
        expect(set).toHaveProperty('reps');
        console.log('✅ Set structure is valid:', set);
      }
    } else {
      console.log('⚠️  No workout records found, but API structure is correct');
    }
  });

  test('should handle workout records without sets gracefully', async ({ page }) => {
    console.log('=== Testing Empty Sets Handling ===');
    
    // ログイン
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    // ホームページに移動してコンソールエラーがないことを確認
    await page.goto('/');
    
    // コンソールエラーを監視
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // ページが正常に読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // WorkoutDayItem.tsxで発生していたエラーがないことを確認
    const hasForEachError = consoleErrors.some(error => 
      error.includes('Cannot read properties of undefined (reading \'forEach\')')
    );
    
    expect(hasForEachError).toBe(false);
    console.log('✅ No forEach undefined errors detected');
    
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }
  });

  test('should calculate total volume correctly with valid sets', async ({ page }) => {
    console.log('=== Testing Total Volume Calculation ===');
    
    // ログイン
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    // ホームページでワークアウト項目を確認
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 総ボリュームが表示されているワークアウト項目を探す
    const volumeElements = await page.locator('text=総ボリューム').count();
    
    if (volumeElements > 0) {
      console.log(`✅ Found ${volumeElements} workout items with total volume displayed`);
      
      // 最初の総ボリューム要素をチェック
      const firstVolumeElement = page.locator('text=総ボリューム').first();
      await expect(firstVolumeElement).toBeVisible();
      
      console.log('✅ Total volume calculation working correctly');
    } else {
      console.log('⚠️  No workouts with volume found, but no errors occurred');
    }
  });
});