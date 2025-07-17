export const existingUser = {
  email: 'korobova-k@mail.ru',
  password: 'wq2d3wq2d3',
};

export const invalidRegistrationCases = [

  {
    email: '',
    password: 'Test12345',
    phone: '89991234567',
    desc: 'пустым email',
    field: 'Почта',
    expectedError: 'Заполните поле',
  },
  {
    email: 'invalidemail',
    password: 'Test12345',
    phone: '89991234567',
    desc: 'неверным форматом email',
    field: 'Почта',
    expectedError: 'Неверный формат почты',
  },
  
  {
    email: 'new@example.com',
    password: '123',
    phone: '89991234567',
    desc: 'коротким паролем',
    field: 'Пароль',
    expectedError: 'Мин.длинна - 7 символов',
  },

  {
    email: 'new@example.com',
    password: 'Test12345',
    phone: '12345',
    desc: 'неверным телефоном',
    field: 'Телефон',
    expectedError: 'Неверный формат телефона',
  },
];


