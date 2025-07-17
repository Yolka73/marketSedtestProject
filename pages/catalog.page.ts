import { Locator, Page, expect } from '@playwright/test';

export class CatalogPage {
    constructor(public readonly page: Page) { }

    async goto() {
        await this.page.goto('http://market.sedtest-tools.ru/category/1');
        //await expect(this.page).toHaveURL(/\/login$/);
    }

    async waitForCatalogLoaded(): Promise<void> {
        await this.page.waitForSelector('.Card_wrap__ZiHIA', { timeout: 10000 });
    }

    getAllProductCards() {
        return this.page.locator('.Card_wrap__ZiHIA');
    }

    async validateProductCard(card: Locator) {
        await expect(card.locator('.Card_name__kuUUr')).toBeVisible();
        await expect(card.locator('.Card_category__Zww3w')).toBeVisible();
        await expect(card.locator('.Card_username__rzzGJ')).toBeVisible();
        await expect(card.locator('.Card_time__6mDOe')).toBeVisible();
        await expect(card.locator('.Card_price__ziptK')).toBeVisible();
    }

    async openFirstProductCard(): Promise<void> {
        await this.waitForCatalogLoaded();
        await this.page.locator('.Card_wrap__ZiHIA .Card_go__mltsg').first().click();
    }

    async clickSortOption(name: string): Promise<void> {
        const locator = this.page.locator(`.MuiBox-root`, { hasText: name }).last();
        await locator.click();
        await this.waitForCatalogLoaded();
    }

    async getCreatedDates(): Promise<Date[]> {//новое
        const dateLocators = this.page.locator('.Card_time__6mDOe');
        const count = await dateLocators.count();
        const dates: Date[] = [];

        for (let i = 0; i < count; i++) {
            const text = await dateLocators.nth(i).innerText(); // Пример: "24.03.2023 в 04:57"
            const match = text.match(/^(\d{2})\.(\d{2})\.(\d{4})/); // Берем только дату

            if (match) {
                const [, day, month, year] = match;
                const dateOnly = new Date(`${year}-${month}-${day}T00:00:00`);

                if (!isNaN(dateOnly.getTime())) {
                    dates.push(dateOnly);
                } else {
                    console.warn(`⚠️ Не удалось распарсить дату: ${text}`);
                }
            } else {
                console.warn(`⚠️ Невалидный формат даты: "${text}"`);
            }
        }

        return dates;

    }

    async getPrices(): Promise<number[]> {//новое
        const priceLocators = this.page.locator('.Card_price__L0K9l');
        const count = await priceLocators.count();
        const prices: number[] = [];
        
        for (let i = 0; i < count; i++) {
            const text = await priceLocators.nth(i).innerText();
            const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');// Удаляем всё, кроме цифр и запятой/точки, заменяем запятую на точку

            const price = parseFloat(cleaned);

            if (!isNaN(price)) {
                prices.push(price);
            } else {
                console.warn(`⚠️ Не удалось преобразовать цену: "${text}"`);
            }
        }

        return prices;
    }

    async clickShowMore() {
        /*const before = await catalog.getAllProductCards().count();
        await expect(page.locator('button:has-text("Показать ещё")')).toBeVisible();
        await catalog.clickShowMore();
        const after = await catalog.getAllProductCards().count();
        expect(after).toBeGreaterThan(before);*/
        /*const showMore = this.page.locator('button:has-text("Показать ещё")');
        if (await showMore.isVisible()) {
            await showMore.click();
            await this.waitForCatalogLoaded();
        }*/
        await this.page.locator('button:has-text("Показать ещё")').click();
    }


    async clickCategory(name: string): Promise<void> {
        // Ищем второй элемент с нужным текстом (nth(1) — это второй, с учётом 0-индексации)
        const category = this.page.getByText(name).nth(1);

        // Клик по категории
        await category.click();

        // Ожидаем загрузки товаров после клика
        await this.waitForCatalogLoaded();
    }


    currentCategoryTitle(): Locator {
        return this.page.locator('.ListCard_title__YqVEd');
    }
    getActiveSortOptionText(): Promise<string> {
        return this.page.locator('.MuiBox-root.css-q0gqsn').innerText();
    }
}
