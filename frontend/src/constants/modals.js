const MODAL_CLASS_NAME = 'modal';

export const MODALS = {
  TEMPLATES: {
    NEW_CLIENT: 'new-client',
    EDIT_CLIENT: 'edit-client',
    DELETE_CLIENT: 'delete-client',
  },

  INNER_TEMPLATES: {
    INPUTS: {
      NAME: 'inputs',
      ID: 'modal-inputs-template',
    },
    CONTACTS: {
      NAME: 'contacts',
      ID: 'modal-contacts-template',
    },
    ERRORS: {
      NAME: 'errors',
      ID: 'modal-errors-template',
    },
    BUTTONS: {
      NAME: 'buttons',
      ID: 'modal-buttons-template',
    },
  },

  LOCATIONS: {
    BODY: 'body',
    FORM: 'form',
    CONTACTS: 'contacts',
  },

  ATTRS: {
    MODAL_TEMPLATE: 'data-modal-template',
    IS_NEED_OPEN_EDIT_MODAL: 'data-is-need-open-edit-modal',
  },

  CLASS_NAMES: {
    MODAL_CLASS_NAME: MODAL_CLASS_NAME,
    CLOSE_BTN: `${MODAL_CLASS_NAME}__close-btn`,
    TITLE: `${MODAL_CLASS_NAME}__title`,
    ID: `${MODAL_CLASS_NAME}__id`,
    ID_ITEM: `${MODAL_CLASS_NAME}__id-item`,
    DESCRIPTION: `${MODAL_CLASS_NAME}__description`,
    BODY: `${MODAL_CLASS_NAME}__body`,
    CONTACTS: `${MODAL_CLASS_NAME}__contacts`,
    ADD_CONTACT_BUTTON: `${MODAL_CLASS_NAME}__add-contact-button`,
    ACTION_BUTTON: `${MODAL_CLASS_NAME}__action-button`,
    CANCEL_BUTTON: `${MODAL_CLASS_NAME}__cancel-button`,
    CONTACT: `${MODAL_CLASS_NAME}__contact`,
    CONTACT_TYPE_SELECT: `${MODAL_CLASS_NAME}__contact-type`,
    CONTACT_DELETE_BUTTON: `${MODAL_CLASS_NAME}__delete-contact-btn`,
    ERRORS_WRAPPER: `${MODAL_CLASS_NAME}__errors`,
    ERROR: `${MODAL_CLASS_NAME}__error`,
    FORM_CONTROLS: `${MODAL_CLASS_NAME}__form-controls`,
    BACKDROP: 'backdrop',
  },

  MODIFIERS: {
    FADE_IN: '_fade-in',
    FADE_OUT: '_fade-out',
    HIDDEN: '_hidden',
    CENTERED: '_centered',
  },

  CUSTOM_EVENTS: {
    DELETE_MODAL_REQUEST: 'delete-modal-request',
    EDIT_MODAL_REQUEST: 'edit-modal-request',
  },
};
