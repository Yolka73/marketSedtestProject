import { test, expect } from '../fixtures/fixtures';
import { existingUser } from '../data/register-cases';
import { createAd } from '../utils/utils';
import { invalidAdCases } from '../data/create-ad-cases';

test.describe('Подача объявления', () => {
    test('Невозможно подать объявление без авторизации', async ({ page }) => {
        await page.goto('http://market.sedtest-tools.ru/');
        await page.getByRole('button', { name: /подать объявление/i }).click();
        await expect(page).toHaveURL(/\/login/);
        // Проверяем наличие кнопки "Войти"
        const loginButton = page.locator('button:has-text("Войти")').nth(1); // регистронезависимо, строго "Войти"
        await expect(loginButton).toBeVisible();
    });


    test.describe('С авторизацией', () => {
        
        test('Клик по кнопке "Подать объявление" ведет на страницу подачи обявления', async ({ authorizedPage }) => {
            await expect(authorizedPage.getByRole('button', { name: 'Подать объявление' })).toBeVisible();
            await authorizedPage.getByRole('button', { name: 'Подать объявление' }).click();
            await expect(authorizedPage).toHaveURL(/\/item\/add$/);
            await expect(authorizedPage.locator('#root')).toContainText('Подача объявления');
        });

        test.describe('Негативные кейсы', () => {
            for (const { title, description, price, expectedError, desc } of invalidAdCases) {
                test(`Ошибка при ${desc}`, async ({authorizedPage, createAdPage }) => {
                    await createAdPage.goto();
                    await createAdPage.fillForm(title, description, price);
                    await createAdPage.submit();
                    await createAdPage.expectFieldError(expectedError);
                });
            }

            test('Кнопка "Добавить фотографии" становится неактивной при загрузке более 9 изображений', async ({authorizedPage, createAdPage }) => {
                await createAdPage.goto();
                const files = Array(10).fill('tests/assets/sample.jpg');
                await createAdPage.uploadImages(files);
                const uploadButton = createAdPage.page.getByRole('button', { name: /Добавить фотографии/i });
                await expect(uploadButton).toBeDisabled();
            });
        });

        test('Успешная подача объявления с ценой 0 = "Договорная"', async ({authorizedPage, createAdPage }) => {
            const uniqueTitle = `Тестовый товар ${Date.now()}`;
            await createAd(createAdPage, {
                title: uniqueTitle,
                description: 'Описание объявления',
                price: '0',
                images: ['tests/assets/sample.jpg'],
            });
            await createAdPage.expectAdCreated(uniqueTitle, 'Договорная');
        });

        test('Успешная подача объявления с названием из спецсимволов', async ({authorizedPage, createAdPage }) => {
            const specialTitle = `~@#$%^&*()_+|-=\\{}[]:”;’<>?,./®©£¥¢¦§«»€ ${Date.now()}`;
            await createAd(createAdPage, {
                title: specialTitle,
                description: 'Описание со спецсимволами',
                price: '500',
                images: ['tests/assets/sample.jpg'],
            });
            await createAdPage.expectAdCreated(specialTitle, '500 ₽');
        });
    });
});
