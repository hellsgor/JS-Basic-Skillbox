import { contactTypes } from '@/constants/contact-types.js';

export const store = {
  tableHeadRowItems: [
    {
      name: 'ID',
      idLastPart: 'id',
      isSortable: true,
      isSortActive: true,
    },
    {
      name: 'Фамилия Имя Отчество',
      idLastPart: 'full-name',
      isSortable: true,
      isString: true,
    },
    {
      name: 'Дата и время создания',
      idLastPart: 'create',
      isSortable: true,
    },
    {
      name: 'Последние изменения',
      idLastPart: 'change',
      isSortable: true,
    },
    {
      name: 'Контакты',
      idLastPart: 'contacts',
    },
    {
      name: 'Действия',
      idLastPart: 'actions',
    },
  ],
  contactSelect: {
    options: [
      {
        text: 'Телефон',
        value: contactTypes.PHONE_NUMBER,
        defaultSelected: true,
      },
      { text: 'Доп. телефон', value: contactTypes.ADDITIONAL_PHONE_NUMBER },
      { text: 'Email', value: contactTypes.EMAIL },
      { text: 'Vk', value: contactTypes.VK },
      { text: 'Facebook', value: contactTypes.FACEBOOK },
    ],
  },
};
