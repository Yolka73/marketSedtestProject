export const invalidAdCases = [
  {
    title: '',
    description: 'Описание товара',
    price: '100',
    expectedError: 'Заполните поле',
    desc: 'отсутствии названия',
  },
  {
    title: 'Товар без описания',
    description: '',
    price: '100',
    expectedError: 'Заполните поле',
    desc: 'отсутствии описания',
  },
  {
    title: 'Товар без цены',
    description: 'Описание есть',
    price: '',
    expectedError: 'Заполните поле',
    desc: 'отсутствии цены',
  },
];