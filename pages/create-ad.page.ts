import { Page, Locator, expect } from '@playwright/test';

export class CreateAdPage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly priceInput: Locator;
    readonly fileInput: Locator;
    readonly submitButton: Locator;
    readonly categoryLink: (name: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.locator('input[name="title"]');
        this.descriptionInput = page.locator('textarea[name="desc"]');
        this.priceInput = page.locator('input[name="price"]');
        this.fileInput = page.locator('input[type="file"]');
        this.submitButton = page.getByRole('button', { name: 'Подать объявление' }).nth(1);
        this.categoryLink = (name: string) => page.locator('.Categories_item__RBV65 a', { hasText: name });
    }

    async goto() {
        await this.page.goto('http://market.sedtest-tools.ru/');
        // Ожидаем кнопку "Подать объявление" и кликаем по ней
        const submitButton = this.page.getByRole('button', { name: 'Подать объявление' });
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // Убеждаемся, что перешли на страницу подачи
        await expect(this.page).toHaveURL(/\/item\/add$/, { timeout: 10000 });

        // Ждём появления заголовка "Подача объявления"
        await this.page.locator('#root').waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.page.locator('#root')).toContainText('Подача объявления');
    }

    async fillForm(title: string, description: string, price: string) {
        await this.page.waitForSelector('input[name="title"]');
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.priceInput.fill(price);
    }

    async uploadImages(filePaths: string[]) {
        await this.fileInput.setInputFiles(filePaths);
    }

    async selectCategory(name: string) {
        await this.categoryLink(name).click();
    }

    async submit() {
        await this.submitButton.click();
    }

    async expectFieldError(text: string) {
        const alert = this.page.locator('.MuiFormHelperText-root');
        await expect(alert).toContainText(text);
    }

    async expectTooManyFilesError() {
        const message = this.page.locator('.MuiAlert-message');
        await expect(message).toContainText(/не более 9/i);
    }

    async expectAdCreated(title: string, price: string) {
        // Ждем перехода на страницу аккаунта
        await expect(this.page).toHaveURL('http://market.sedtest-tools.ru/account', { timeout: 30000 });

        // Проверяем, что заголовок "Мои объявления" присутствует
        await expect(this.page.getByText('Мои объявления', { exact: true })).toBeVisible({ timeout: 30000 });    
        //console.log(`Ожидаем карточку с названием: "${title}" и ценой: "${price}"`);

        // Нажимай "Показать ещё", пока она есть и карточка не найдена
        for (let i = 0; i < 5; i++) {
            const card = this.page.locator('.Card_wrap__ZiHIA').filter({
                has: this.page.locator('.Card_name__kuUUr').filter({ hasText: title })
            });

            const isVisible = await card.isVisible().catch(() => false);
            if (isVisible) {
                //console.log('Карточка найдена, проверяем содержимое...');
                await expect(card).toBeVisible({ timeout: 10000 });
                await expect(card.locator('.Card_price__ziptK')).toHaveText(price);
                return;
            }

            const showMoreBtn = this.page.locator('button:has-text("Показать ещё")');
            if (await showMoreBtn.isVisible()) {
                //console.log('Нажимаем кнопку "Показать ещё"...');
                await showMoreBtn.click();
                await this.page.waitForTimeout(1000); // Подождать загрузку
            } else {
                //console.log('Кнопка "Показать ещё" больше не отображается');
                break;
            }
        }

        throw new Error(`Карточка с названием "${title}" не найдена на странице`);
    }
}