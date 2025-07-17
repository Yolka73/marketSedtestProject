import { test, expect } from '../fixtures/fixtures';
import { invalidRegistrationCases, existingUser } from '../data/register-cases';

const validFirstName = 'Анна';
const validLastName = 'Иванова';
const validPhone = '89991234567';
const validPassword = 'Test12345';

test.describe('Регистрация', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test('Успешная регистрация нового пользователя', async ({ registerPage }) => {
    await registerPage.registerNewUser();
    await expect(registerPage.page).toHaveURL(/\/account$/);
    await expect(registerPage.page.locator('.UserAdvertList_right__kg90g .MuiBox-root')).toHaveText('Объявлений нет');
  });

  test('Регистрация с уже существующим email', async ({ registerPage }) => {
    await registerPage.fillForm(existingUser.email, validPassword, validFirstName, validLastName, validPhone);
    await registerPage.submit();
    await registerPage.expectAlertVisibleWithText('Такой пользователь уже существует');
  });

  test.describe('Невалидные регистрации', () => {
    for (const { email, password, phone, desc, field, expectedError } of invalidRegistrationCases) {
      test(`Регистрация с ${desc}`, async ({ registerPage }) => {
        await registerPage.fillForm(email, password, validFirstName, validLastName, phone);
        await registerPage.submit();
        await registerPage.expectFieldErrorVisibleWithText(field, expectedError);
      });
    }
  });
});
//
test.describe('Авторизация', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Авторизация с валидными данными', async ({ loginPage }) => {
    await loginPage.login(existingUser.email, existingUser.password);
    await expect(loginPage.page).toHaveURL(/\/account$/);
  });

  test('Авторизация с невалидным логином', async ({ loginPage }) => {
    await loginPage.login('wrong@example.com', existingUser.password);
    await loginPage.expectAlertVisibleWithText('Неправильный логин или пароль');
  });

  test('Авторизация с невалидным паролем', async ({ loginPage }) => {
    await loginPage.login(existingUser.email, 'wrongpass');
    await loginPage.expectAlertVisibleWithText('Неправильный логин или пароль');
  });

  test('Авторизация с пустыми полями', async ({ loginPage }) => {
    await loginPage.submitEmptyForm();
    await loginPage.expectFieldErrorVisibleWithText('Почта', 'Заполните поле');
    await loginPage.expectFieldErrorVisibleWithText('Пароль', 'Заполните поле');
  });
});
