import { MODALS } from '@/constants/modals.js';

export const FORMS = {
  ATTRS: {
    FORM_AUTO_INIT_DATA_ATTR: 'data-form-auto-init',
    SUBMIT_BUTTON_AUTO_INIT_DATA_ATTR: 'data-submit-button-auto-init',
    ERROR_INDEX: 'data-error-index',
    VALIDATION_REGEXP_NAME: 'data-validation-regexp-name',
  },

  CLASS_NAMES: {
    MODAL_CONTACT: MODALS.CLASS_NAMES.CONTACT,
    MODAL_CONTACT_WITH_ERROR: `${MODALS.CLASS_NAMES.CONTACT}_with-error`,
    MODAL_ERROR: MODALS.CLASS_NAMES.ERROR,
    FORM_CONTROL_INPUT: 'form-control__input',
    FORM_CONTROL_INPUT_INVALID: 'form-control__input_invalid',
    MODAL_CONTACT_TYPE_SELECT: MODALS.CLASS_NAMES.CONTACT_TYPE_SELECT,
  },

  CLIENT_OBJECT_CONTACTS_PROPERTY_NAME: 'contacts',
};
