export const CONTACTS = {
  TYPES: {
    EMAIL: {
      text: 'Email',
      value: 'email',
      inputType: 'email',
      sortIndex: 3,
      modifier: 'email',
    },
    PHONE_NUMBER: {
      text: 'Телефон',
      value: 'phone-number',
      inputType: 'tel',
      sortIndex: 1,
      modifier: 'phone',
    },
    VK: {
      text: 'Vk',
      value: 'vk',
      inputType: 'url',
      sortIndex: 4,
      modifier: 'vk',
    },
    TWITTER: {
      text: 'Twitter',
      value: 'twitter',
      inputType: 'url',
      sortIndex: null,
      modifier: '',
    },
    ADDITIONAL_PHONE_NUMBER: {
      text: 'Доп. телефон',
      value: 'additional-phone-number',
      inputType: 'tel',
      sortIndex: 2,
      modifier: 'phone',
    },
    FACEBOOK: {
      text: 'Facebook',
      value: 'facebook',
      inputType: 'url',
      sortIndex: 5,
      modifier: 'facebook',
    },
  },
  CLASS_NAMES: {
    input: 'contact-control__input',
    selectButton: 'select__item',
    selectButtonText: 'select__item-text',
    deleteButton: 'delete-contact-btn',
    parentClass: 'modal__contact',
  },
  ATTRS: {
    dataSelectedTypeValue: 'data-selected-value',
    dataContactControlId: 'data-contact-control-id',
  },
};
