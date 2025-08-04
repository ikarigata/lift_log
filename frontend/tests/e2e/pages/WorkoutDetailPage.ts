import { Page, Locator, expect } from '@playwright/test';

export class WorkoutDetailPage {
  readonly page: Page;
  readonly addExerciseButton: Locator;
  readonly workoutRecords: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addExerciseButton = page.getByTestId('add-exercise-button');
    this.workoutRecords = page.locator('[data-testid="workout-record"]');
  }

  async addExercise() {
    await this.addExerciseButton.waitFor({ state: 'visible' });
    await this.addExerciseButton.click({ force: true });
  }

  async selectExercise(exerciseName: string) {
    await this.page.getByText(exerciseName).first().click();
  }

  async verifyExerciseRecord(exerciseName: string, sets: Array<{weight: number, reps: number}>, memo?: string) {
    const recordElement = this.page.locator(`text=${exerciseName}`).locator('..').locator('..');
    await expect(recordElement).toBeVisible();
    
    for (const [index, set] of sets.entries()) {
      await expect(recordElement.getByText(`${set.weight}kg`)).toBeVisible();
      await expect(recordElement.getByText(`${set.reps}回`)).toBeVisible();
    }
    
    if (memo) {
      await expect(recordElement.getByText(memo)).toBeVisible();
    }
  }
}
