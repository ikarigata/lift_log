import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('lift_log');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('ログイン');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    const token = await page.evaluate(() => localStorage.getItem('lift_log_auth_token'));
    expect(token).toBeTruthy();
    expect(token).toMatch(/^[A-Za-z0-9-_]+=*\.[A-Za-z0-9-_]+=*\.[A-Za-z0-9-_]+=*$/); // JWT format
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=メールアドレスまたはパスワードが正しくありません。')).toBeVisible();
    
    const token = await page.evaluate(() => localStorage.getItem('lift_log_auth_token'));
    expect(token).toBeNull();
  });

  test('should show error with empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/login');
    
    const token = await page.evaluate(() => localStorage.getItem('lift_log_auth_token'));
    expect(token).toBeNull();
  });

  test('should use development login button', async ({ page }) => {
    await page.click('text=🔓 開発用ログイン');
    
    await expect(page).toHaveURL('/');
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=新規登録');
    
    await expect(page).toHaveURL('/signup');
  });
});

test.describe('Authentication state', () => {
  test('should redirect to login when accessing protected routes without authentication', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveURL('/login');
  });

  test('should maintain authentication state after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    await page.reload();
    
    await expect(page).toHaveURL('/');
  });
});
