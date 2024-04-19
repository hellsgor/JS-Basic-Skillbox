export const contacts = {
  types: {
    PHONE_NUMBER: { text: 'Телефон', value: 'phone-number', inputType: 'tel' },
    ADDITIONAL_PHONE_NUMBER: {
      text: 'Доп. телефон',
      value: 'additional-phone-number',
      inputType: 'tel',
    },
    EMAIL: { text: 'Email', value: 'email', inputType: 'email' },
    VK: { text: 'Vk', value: 'vk', inputType: 'url' },
    FACEBOOK: { text: 'Facebook', value: 'facebook', inputType: 'url' },
    TWITTER: { text: 'Twitter', value: 'twitter', inputType: 'url' },
  },
  classNames: {
    input: 'contact-control__input',
    selectButton: 'select__item',
    deleteButton: 'delete-contact-btn',
    parentClass: 'modal__contact',
  },
  attrs: {
    dataSelectedTypeValue: 'data-selected-value',
    dataContactControlId: 'data-contact-control-id',
  },
};
