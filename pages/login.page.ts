import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(public page: Page) { }

  async goto() {
    await this.page.goto('http://market.sedtest-tools.ru/login');
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async login(email: string, password: string) {
    await this.page.locator('input[name="email"]').fill(email);
    await this.page.locator('input[name="password"]').fill(password);
    const loginBtn = this.page.locator('button:has-text("Войти")').nth(1);
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();
    //console.log('Логинимся  как ${email}');
     // Добавь ЯВНОЕ ожидание редиректа:
    await this.page.waitForURL(/\/account$/, { timeout: 10000 });
    //console.log('Успешно вошли, текущий URL:', await this.page.url());

  }

  async submitEmptyForm() {
    const loginBtn = this.page.locator('button:has-text("Войти")').nth(1);
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();
  }

  alert() {
    return this.page.locator('.MuiAlert-message');
  }

  async expectAlertVisibleWithText(text: string) {
    const alert = this.alert();
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(text);
  }

 async expectFieldErrorVisibleWithText(labelText: string, expectedText: string) {
  const fieldWrapper = this.page.locator(`div:has(label:text-is("${labelText}"))`);
  const errorText = fieldWrapper.locator('.MuiFormHelperText-root.Mui-error');
  await expect(errorText.first()).toHaveText(expectedText);
}
}
