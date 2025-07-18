import { test, expect } from '../fixtures/fixtures';
import { invalidRegistrationCases, existingUser } from '../data/register-cases';

test.describe('Авторизация', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Авторизация с валидными данными', async ({ loginPage }) => {
    await loginPage.loginWithValidation(existingUser.email, existingUser.password, true);
  });

  test('Авторизация с невалидным логином', async ({ loginPage }) => {
    await loginPage.loginWithValidation('wrong@example.com', existingUser.password, false);
  });

  test('Авторизация с невалидным паролем', async ({ loginPage }) => {

    await loginPage.loginWithValidation(existingUser.email, 'wrongpass', false);
  });

  test('Авторизация с пустыми полями', async ({ loginPage }) => {
    await loginPage.submitEmptyForm();
    await loginPage.expectFieldErrorVisibleWithText('Почта', 'Заполните поле');
    await loginPage.expectFieldErrorVisibleWithText('Пароль', 'Заполните поле');
  });
});
