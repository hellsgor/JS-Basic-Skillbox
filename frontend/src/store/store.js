import { contacts } from '../constants/contacts.js';

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
  contactInput: {
    classes: {
      input: contacts.classNames.input,
    },
  },
  contactSelect: {
    classes: {
      button: contacts.classNames.selectButton,
    },
    options: [
      {
        text: 'Телефон',
        value: contacts.types.PHONE_NUMBER,
      },
      { text: 'Доп. телефон', value: contacts.types.ADDITIONAL_PHONE_NUMBER },
      { text: 'Email', value: contacts.types.EMAIL },
      { text: 'Vk', value: contacts.types.VK },
      { text: 'Facebook', value: contacts.types.FACEBOOK },
    ],
  },
};
