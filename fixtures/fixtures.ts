import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { CatalogPage } from '../pages/catalog.page';
import { CreateAdPage } from '../pages/create-ad.page';
import { existingUser } from '../data/register-cases';

type Pages = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  catalog: CatalogPage;
  createAdPage: CreateAdPage;
  authorizedPage: Page;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(); 
    await use(loginPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },

  catalog: async ({ page }, use) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await catalog.waitForCatalogLoaded();
    await use(catalog);
  },
  createAdPage: async ({ page }, use) => {
    const createAdPage = new CreateAdPage(page);
    await use(createAdPage);
  },
  // 💡 Эта фикстура будет логинить пользователя перед тестами, где она явно используется
  authorizedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(existingUser.email, existingUser.password);
    await use(page);
  },
});

export { expect };