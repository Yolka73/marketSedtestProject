import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { CatalogPage } from '../pages/catalog.page';
import { CreateAdPage } from '../pages/create-ad.page';


type Pages = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  catalog: CatalogPage;
  createAdPage: CreateAdPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
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
});

export { expect };