import { test, expect} from '../fixtures/fixtures';
import { existingUser } from '../data/register-cases';

test.describe('Авторизация', () => {

  test('Авторизация с валидными данными', async ({ loginPage }) => {
    await loginPage.loginWithValidation(existingUser.email, existingUser.password, true);
    await expect(loginPage.page).toHaveURL(/\/account$/);
    await expect(loginPage.page.locator('#root')).toContainText('Мои объявления');
    // Проверка имени пользователя "Ирина"
    const nameLocator = loginPage.page.locator('.MuiBox-root.css-9kubtj');
    await expect(nameLocator).toBeVisible();
    await expect(nameLocator).toHaveText('Ирина')
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
