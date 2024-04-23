import { CONTACTS } from '../constants/contacts.js';
import { MODALS } from '../constants/modals.js';

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
      input: CONTACTS.CLASS_NAMES.input,
    },
  },
  contactSelect: {
    classes: {
      button: CONTACTS.CLASS_NAMES.selectButton,
    },
    options: Object.values(CONTACTS.TYPES),
  },

  modals: {
    attrs: {
      modalTemplate: MODALS.ATTRS.MODAL_TEMPLATE,
    },
    innerTemplates: MODALS.INNER_TEMPLATES,
  },
};
