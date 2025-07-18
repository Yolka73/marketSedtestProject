import { test, expect } from '../fixtures/fixtures';
import { invalidRegistrationCases, existingUser } from '../data/register-cases';

const validFirstName = 'Анна';
const validLastName = 'Иванова';
const validPhone = '89991234567';
const validPassword = 'Test12345';

test.describe('Регистрация', () => {
  
  test('Успешная регистрация нового пользователя', async ({ registerPage }) => {
    await registerPage.registerNewUser();
    await expect(registerPage.page).toHaveURL(/\/account$/);
    await expect(registerPage.page.locator('.UserAdvertList_right__kg90g .MuiBox-root')).toHaveText('Объявлений нет');
    const nameLocator = registerPage.page.locator('.MuiBox-root.css-9kubtj');
    await expect(nameLocator).toBeVisible();
    await expect(nameLocator).toHaveText('Анна')
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


