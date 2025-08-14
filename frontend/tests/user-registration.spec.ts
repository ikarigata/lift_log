import { test, expect } from '@playwright/test';

test.describe('ユーザー新規登録 E2E テスト', () => {
  test.beforeEach(async ({ page }) => {
    // テスト実行前にサインアップページに移動
    await page.goto('/signup');
  });

  test('正常な新規登録フローが動作すること', async ({ page }) => {
    // ユニークなメールアドレスを生成（テスト実行時の重複を避けるため）
    const timestamp = Date.now();
    const testEmail = `test-user-${timestamp}@example.com`;
    const testPassword = 'SecurePassword123';

    // ページタイトルと見出しの確認
    await expect(page.locator('h1')).toHaveText('lift_log');
    await expect(page.locator('h2')).toHaveText('新規登録');

    // フォームフィールドの存在確認
    const nameInput = page.locator('input[placeholder="ユーザーネーム"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const passwordConfirmInput = page.locator('input[type="password"]').nth(1);
    const submitButton = page.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(passwordConfirmInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // フォームに入力
    await nameInput.fill('Test User');
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await passwordConfirmInput.fill(testPassword);

    // APIレスポンスを待機するためのネットワークリクエストをモック
    await page.route('**/api/v1/users', async (route) => {
      if (route.request().method() === 'POST') {
        // 成功レスポンスをモック
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '12345678-1234-1234-1234-123456789012',
            name: 'Test User',
            email: testEmail,
            passwordHash: 'hashedPassword',
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    // 登録ボタンをクリック
    await submitButton.click();

    // 成功メッセージの表示を確認
    await expect(page.locator('text=新規登録が成功しました')).toBeVisible();

    // ログインページへのリダイレクト（タイムアウトを考慮して少し待機）
    await page.waitForURL('/login', { timeout: 3000 });
    await expect(page).toHaveURL('/login');
  });

  test('パスワード不一致時にエラーメッセージが表示されること', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test-mismatch-${timestamp}@example.com`;

    // フォームに入力（パスワードを異なるものにする）
    await page.locator('input[placeholder="ユーザーネーム"]').fill('Test User');
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').first().fill('Password123');
    await page.locator('input[type="password"]').nth(1).fill('DifferentPassword456');

    // 登録ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // エラーメッセージの表示を確認
    await expect(page.locator('text=パスワードが一致しません')).toBeVisible();
    
    // ページが変遷していないことを確認
    await expect(page).toHaveURL('/signup');
  });

  test('必須フィールドが空の場合にブラウザバリデーションが働くこと', async ({ page }) => {
    // メールアドレスを空のまま登録ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // ブラウザの標準バリデーションにより、フォームが送信されないことを確認
    // （ページが変遷しないことで確認）
    await expect(page).toHaveURL('/signup');
  });

  test('APIエラー時にエラーメッセージが表示されること', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test-error-${timestamp}@example.com`;
    const testPassword = 'SecurePassword123';

    // APIエラーレスポンスをモック
    await page.route('**/api/v1/users', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'このメールアドレスは既に登録されています'
          })
        });
      }
    });

    // フォームに入力
    await page.locator('input[placeholder="ユーザーネーム"]').fill('Test User');
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').first().fill(testPassword);
    await page.locator('input[type="password"]').nth(1).fill(testPassword);

    // 登録ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // エラーメッセージの表示を確認
    await expect(page.locator('text=このメールアドレスは既に登録されています')).toBeVisible();
    
    // ページが変遷していないことを確認
    await expect(page).toHaveURL('/signup');
  });

  test('フォームのアクセシビリティが適切であること', async ({ page }) => {
    // プレースホルダーテキストの確認
    await expect(page.locator('input[placeholder="ユーザーネーム"]')).toBeVisible();
    await expect(page.locator('input[placeholder="メールアドレス"]')).toBeVisible();
    await expect(page.locator('input[placeholder="パスワード"]')).toBeVisible();
    await expect(page.locator('input[placeholder="パスワード（確認）"]')).toBeVisible();

    // ボタンテキストの確認
    await expect(page.locator('button[type="submit"]')).toHaveText('登録');

    // フォーカス操作のテスト
    await page.locator('input[placeholder="ユーザーネーム"]').focus();
    await expect(page.locator('input[placeholder="ユーザーネーム"]')).toBeFocused();

    // Tab キーでナビゲーション
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]').first()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]').nth(1)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('レスポンシブデザインが機能すること', async ({ page }) => {
    // デスクトップサイズでの表示確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.w-80')).toBeVisible(); // フォーム要素の幅クラス

    // モバイルサイズでの表示確認
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // フォーム要素がビューポート内に収まっていることを確認
    const formBounds = await page.locator('form').boundingBox();
    expect(formBounds?.width).toBeLessThanOrEqual(375);
  });
});