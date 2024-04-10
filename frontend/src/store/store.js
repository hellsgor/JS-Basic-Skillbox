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
  clientControls: [
    {
      name: 'surname',
      placeholder: 'Фамилия',
      required: true,
      validationRegexpName: 'SURNAME',
    },
    {
      name: 'name',
      placeholder: 'Имя',
      required: true,
      validationRegexpName: 'NAME_OR_PATRONYMIC',
    },
    {
      name: 'lastName',
      placeholder: 'Отчество',
      required: false,
      validationRegexpName: 'NAME_OR_PATRONYMIC',
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
    options: Object.values(contacts.types),
  },
};
