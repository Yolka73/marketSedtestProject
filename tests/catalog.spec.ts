//import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { test, expect } from '../fixtures/fixtures';
import { isSortedAsc, isSortedDesc, isSortedByDateDesc, isSortedByDateAsc } from '../utils/sorting';

test.describe('Каталог', () => {

    test('Каталог загружается и отображает товары', async ({ catalog }) => {

        const cards = catalog.getAllProductCards();
        const count = await cards.count();
        expect(count).toBeGreaterThan(0); //проверям что присуствуют карточки товаров
        expect(count).toBe(9); // Проверка, что ровно 9 товаров                
    });

    test('Каждая карточка содержит обязательные поля', async ({ catalog }) => {

        const cards = catalog.getAllProductCards();
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await catalog.validateProductCard(cards.nth(i));
        }
    });

    test('Клик по товару открывает карточку', async ({ catalog, page }) => {
        await catalog.openFirstProductCard();
        await expect(page).toHaveURL(/\/item\//);
    });

    test('Сортировка "По новизне работает некорректно"', async ({ catalog }) => {
        // Клик по сортировке "По новизне"
        await catalog.clickSortOption('По новизне');
        const dates = await catalog.getCreatedDates();//новое
        expect(isSortedByDateAsc(dates)).toBeTruthy();
    });

    test('Сортировка "Сначала дешевые"работает корректно', async ({ catalog }) => {

        await catalog.clickSortOption('Сначала дешевые');
        const prices = await catalog.getPrices();
        expect(isSortedDesc(prices)).toBeTruthy();
    });

    test('Сортировка "Сначала дорогие"работает корректно', async ({ catalog }) => {

        await catalog.clickSortOption('Сначала дорогие');

        const prices = await catalog.getPrices();
        expect(isSortedDesc(prices)).toBeTruthy();
    });

    test('Сброс фильтрации при открытии карточки товара', async ({ catalog, page }) => {
        // Применяем сортировку "Сначала дорогие"
        await catalog.clickSortOption('Сначала дорогие');
        // Открываем карточку товара
        await catalog.openFirstProductCard();
        // Возвращаемся назад
        await page.goBack();
        // Ожидаем загрузку каталога
        await catalog.waitForCatalogLoaded();
        // Получаем текст текущей активной сортировки
        const currentSortText = await catalog.getActiveSortOptionText();
        // Проверяем, что сортировка вернулась к дефолтной ("По новизне")
        expect(currentSortText).toBe('По новизне');
        // Дополнительно проверяем, что карточки отображаются
        const count = await catalog.getAllProductCards().count();
        expect(count).toBeGreaterThan(0);
    });


    test('Кнопка "Показать ещё" увеличивает количество товаров', async ({ catalog }) => {


        const initialCount = await catalog.getAllProductCards().count();
        await catalog.clickShowMore();
        // Ждём увеличения количества карточек
        await expect.poll(async () => {
            return await catalog.getAllProductCards().count();
        }, {
            timeout: 5000,
            message: 'Ожидание увеличения количества карточек',
        }).toBeGreaterThan(initialCount);
        //const newCount = await catalog.getAllProductCards().count();
        // expect(newCount).toBeGreaterThan(initialCount);
    });
});

test('Клик по категории открывает нужный каталог', async ({ catalog }) => {

    await catalog.clickCategory('Техника');

    const categoryTitleLocator = await catalog.currentCategoryTitle();
    await expect(categoryTitleLocator).toContainText('Техника'); // <-- Исправлено
});


