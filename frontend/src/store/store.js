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
    // options: [
    //   {
    //     text: contacts.types.PHONE_NUMBER.text,
    //     value: contacts.types.PHONE_NUMBER.value,
    //   },
    //   {
    //     text: contacts.types.ADDITIONAL_PHONE_NUMBER.text,
    //     value: contacts.types.ADDITIONAL_PHONE_NUMBER.value,
    //   },
    //   { text: contacts.types.EMAIL.text, value: contacts.types.EMAIL.value },
    //   { text: contacts.types.VK.text, value: contacts.types.VK.value },
    //   {
    //     text: contacts.types.FACEBOOK.text,
    //     value: contacts.types.FACEBOOK.value,
    //   },
    //   {
    //     text: contacts.types.TWITTER.text,
    //     value: contacts.types.TWITTER.value,
    //   },
    // ],
    options: Object.values(contacts.types),
  },
};
