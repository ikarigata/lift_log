import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { WorkoutDetailPage } from './pages/WorkoutDetailPage';
import { ExerciseInputPage } from './pages/ExerciseInputPage';

test.describe('Training Input Flow', () => {
  test('should complete full training input flow and display record on detail screen', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithCredentials();

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const plusButton = buttons.find(btn => btn.textContent?.trim() === '+');
      if (plusButton) {
        plusButton.click();
      } else {
        throw new Error('Plus button not found');
      }
    });
    await page.waitForURL(/\/workout\/[a-f0-9-]+$/);

    const workoutDetailPage = new WorkoutDetailPage(page);
    await workoutDetailPage.addExercise();
    await page.waitForURL(/\/workout\/[a-f0-9-]+\/exercises$/);

    await workoutDetailPage.selectExercise('ベンチプレス');
    await page.waitForURL(/\/workout\/[a-f0-9-]+\/exercise\/[a-f0-9-]+$/);

    const exerciseInputPage = new ExerciseInputPage(page);
    
    await exerciseInputPage.addSet(80, 10, 1);
    
    await exerciseInputPage.addSet(85, 8, 2);
    
    await exerciseInputPage.addSet(90, 6, 3);
    
    const testMemo = 'テストメモ - 調子良好';
    await exerciseInputPage.addMemo(testMemo);

    await exerciseInputPage.save();

    await workoutDetailPage.verifyExerciseRecord(
      'ベンチプレス',
      [
        { weight: 80, reps: 10 },
        { weight: 85, reps: 8 },
        { weight: 90, reps: 6 }
      ],
      testMemo
    );

    const expectedVolume = (80 * 10) + (85 * 8) + (90 * 6);
    await expect(page.getByText(`${expectedVolume.toLocaleString()}kg`)).toBeVisible();
  });
});
