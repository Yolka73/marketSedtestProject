import { CreateAdPage } from '../pages/create-ad.page';

interface CreateAdOptions {
  title: string;
  description: string;
  price: string;
  images?: string[];
}

export async function createAd(
  createAdPage: CreateAdPage,
  { title, description, price, images = [] }: CreateAdOptions
) {
  await createAdPage.goto();
  await createAdPage.fillForm(title, description, price);

  if (images.length > 0) {
    await createAdPage.uploadImages(images);
  }

  await createAdPage.submit();
}