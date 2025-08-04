import { Page, Locator } from '@playwright/test';

export class ExerciseInputPage {
  readonly page: Page;
  readonly addSetButton: Locator;
  readonly saveButton: Locator;
  readonly memoTextarea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addSetButton = page.getByText('+ セット追加');
    this.saveButton = page.getByText('保存');
    this.memoTextarea = page.getByPlaceholder('今日のトレーニングメモを入力...');
  }

  async addSet(weight: number, reps: number, setNumber: number = 1) {
    if (setNumber > 1) {
      await this.addSetButton.click();
      await this.page.waitForTimeout(500);
    }
    
    const weightInput = this.page.locator('input[placeholder="重量"]').nth(setNumber - 1);
    const repsInput = this.page.locator('input[placeholder="回数"]').nth(setNumber - 1);
    
    await weightInput.fill(weight.toString());
    await repsInput.fill(reps.toString());
  }

  async addMemo(memo: string) {
    await this.memoTextarea.fill(memo);
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForURL(/\/workout\/[a-f0-9-]+$/);
  }
}
