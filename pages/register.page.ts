import { expect, Page } from '@playwright/test';

export class RegisterPage {
  constructor(public page: Page) { }

  async goto() {
    await this.page.goto('http://market.sedtest-tools.ru/login');
    await expect(this.page.locator('text=Еще не зарегистрированы ?')).toBeVisible();
    await this.page.goto('http://market.sedtest-tools.ru/login');
    await this.page.getByText('Еще не зарегистрированы ?').click();
    await expect(this.page.getByText('Регистрация')).toBeVisible();
  }

  async fillForm(email: string, password: string, name: string, surname: string, phone: string) {
    await this.page.locator('input[name="email"]').fill(email);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('input[name="name"]').fill(name);
    await this.page.locator('input[name="surname"]').fill(surname);
    await this.page.locator('input[name="phone"]').fill(phone);
  }

  async submit() {
    await this.page.locator('button:has-text("Зарегестрироватся")').click();
  }

  async registerNewUser() {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await this.fillForm(uniqueEmail, 'Test12345', 'Анна', 'Иванова', '89991234567');
    await this.submit();
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
    const fieldWrapper = this.page.locator(`div:has(label:has-text("${labelText}"))`);
    const errorText = fieldWrapper.locator('.MuiFormHelperText-root.Mui-error');
    await expect(errorText).toHaveText(expectedText);
  }
}
