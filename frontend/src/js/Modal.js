import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { createElement } from '@/helpers/create-element.js';
import clientsApi from '@api/clients-api.js';
import { cloneTemplate } from '@/helpers/clone-template.js';

class Modal {
  modalClassName = 'modal';

  classNames = {
    closeBtn: `${this.modalClassName}__close-btn`,
    title: `${this.modalClassName}__title`,
    body: `${this.modalClassName}__body`,
    contacts: `${this.modalClassName}__contacts`,
    addContactButton: `${this.modalClassName}__add-contact-button`,
    actionButton: `${this.modalClassName}__action-button`,
    cancelButton: `${this.modalClassName}__cancel-button`,
    backdrop: 'backdrop',
  };

  attributes = {
    modalTemplate: 'data-modal-template',
  };

  modalTemplatesList = {
    newClient: 'new-client',
    editClient: 'edit-client',
    delete: 'delete',
  };

  modifiers = {
    fadeIn: '_fade-in',
    fadeOut: '_fade-out',
    hidden: '_hidden',
  };

  locations = {
    body: 'body',
    form: 'form',
    contacts: 'contacts',
  };

  templatesIDs = {
    required: {
      inputs: {
        name: 'inputs',
        id: 'modal-inputs-template',
        location: this.locations.form,
      },
      contacts: {
        name: 'contacts',
        id: 'modal-contacts-template',
        location: this.locations.form,
      },
      errors: {
        name: 'errors',
        id: 'modal-errors-template',
        location: this.locations.body,
      },
      buttons: {
        name: 'buttons',
        id: 'modal-buttons-template',
        location: this.locations.body,
      },
    },
    optional: {
      newContact: {
        name: 'newContact',
        id: 'modal-contact-template',
        location: this.locations.contacts,
      },
    },
  };

  strings = {
    title: {
      new: 'Новый клиент',
      edit: 'Изменить данные',
      delete: 'Удалить клиента',
    },
    buttons: {
      cancel: 'Отменить',
      delete: 'Удалить клиента',
      deleteSmall: 'Удалить',
      save: 'Сохранить',
    },
  };

  modal = null;
  modalTemplate = null;
  closeBtn = null;
  backdrop = null;
  title = null;
  body = null;

  constructor(props) {
    this.modal = props?.modal;

    this.getModalElements();
    this.addEvents();

    return this;
  }

  getModalElements() {
    this.modalTemplate = this.modal?.getAttribute(
      this.attributes.modalTemplate,
    );

    this.closeBtn = this.modal?.querySelector(`.${this.classNames.closeBtn}`);
    this.backdrop = document.querySelector(`.${this.classNames.backdrop}`);
    this.title = this.modal.querySelector(`.${this.classNames.title}`);
    this.body = this.modal.querySelector(`.${this.classNames.body}`);
  }

  addEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
  }

  showModal(client = null) {
    this.fillModal(client);

    this.modal.classList.remove(
      `${this.modalClassName}${this.modifiers.hidden}`,
    );
    this.modal.classList.add(`${this.modalClassName}${this.modifiers.fadeIn}`);
    this.backdrop.classList.remove(
      `${this.classNames.backdrop}${this.modifiers.hidden}`,
    );
    this.backdrop.classList.add(
      `${this.classNames.backdrop}${this.modifiers.fadeIn}`,
    );
    setTimeout(
      () => {
        this.modal.classList.remove(
          `${this.modalClassName}${this.modifiers.fadeIn}`,
        );
        this.backdrop.classList.remove(
          `${this.classNames.backdrop}${this.modifiers.fadeIn}`,
        );
      },
      convertTimeStringToMilliseconds(
        window.getComputedStyle(this.modal).animationDuration,
      ),
    );
  }

  closeModal() {
    this.modal.classList.add(`${this.modalClassName}${this.modifiers.fadeOut}`);
    this.backdrop.classList.add(
      `${this.classNames.backdrop}${this.modifiers.fadeOut}`,
    );

    setTimeout(
      () => {
        this.modal.classList.add(
          `${this.modalClassName}${this.modifiers.hidden}`,
        );
        this.modal.classList.remove(
          `${this.modalClassName}${this.modifiers.fadeOut}`,
        );
        this.backdrop.classList.add(
          `${this.classNames.backdrop}${this.modifiers.hidden}`,
        );
        this.backdrop.classList.remove(
          `${this.classNames.backdrop}${this.modifiers.fadeOut}`,
        );

        this.clearModal();
      },
      convertTimeStringToMilliseconds(
        window.getComputedStyle(this.modal).animationDuration,
      ),
    );
  }

  fillModal(client = null) {
    this.setTitle(client);

    if (this.modalTemplate !== this.modalTemplatesList.delete) {
      this.body.appendChild(this.createForm(client));
      const form = this.body.querySelector('form');

      Object.keys(this.templatesIDs.required).forEach((templateID) => {
        let newElement = cloneTemplate(
          this.templatesIDs.required[templateID].id,
        );

        if (templateID === this.templatesIDs.required.buttons.name) {
          newElement = this.setButtons(newElement);
        }

        if (templateID === this.templatesIDs.required.contacts.name) {
          newElement
            .querySelector(`.${this.classNames.addContactButton}`)
            .addEventListener('click', () => {
              this.addNewContactControl();
            });
        }

        switch (this.templatesIDs.required[templateID].location) {
          case this.locations.body:
            this.body.appendChild(newElement);
            break;

          case this.locations.form:
            form.appendChild(newElement);
            break;

          default:
            break;
        }
      });
    }
  }

  clearModal() {
    this.clearTitle();
    this.clearBody();
  }

  setTitle(client) {
    if (this.modalTemplate === this.modalTemplatesList.delete) {
      this.title.innerText = this.strings.title.delete;
      return;
    }

    if (this.modalTemplate === this.modalTemplatesList.newClient) {
      this.title.innerText = client
        ? this.strings.title.edit
        : this.strings.title.new;
    }
  }

  clearTitle() {
    this.title.innerText = '';
  }

  createForm(client) {
    return createElement({
      tag: 'form',
      attributes: [
        { name: 'name', value: client ? 'edit-client' : 'new-client' },
        { name: 'autocomplete', value: 'off' },
      ],
    });
  }

  clearBody() {
    this.body.innerHTML = '';
  }

  setButtons(buttonsContainer) {
    const cancelButton = buttonsContainer.querySelector(
      `.${this.classNames.cancelButton}`,
    );
    const actionButton = buttonsContainer.querySelector(
      `.${this.classNames.actionButton}`,
    );

    if (this.modalTemplate === this.modalTemplatesList.newClient) {
      actionButton.innerText = this.strings.buttons.save;
      cancelButton.innerText = this.strings.buttons.cancel;

      cancelButton.addEventListener('click', () => {
        this.closeModal();
      });

      actionButton.addEventListener('click', () => {
        // TODO: сделать валидацию и отправку форм. Скорее всего через отдельный класс Form
        console.log('submit form');
        clientsApi
          .addClient({
            name: 'Захар',
            lastName: 'Александрович',
            surname: 'Камчатский',
          })
          .then((response) => {
            console.log(response);
            this.closeModal();
          });
      });
    }

    return buttonsContainer;
  }

  addNewContactControl() {
    this.body
      .querySelector(`.${this.classNames.contacts}`)
      .insertBefore(
        cloneTemplate(this.templatesIDs.optional.newContact.id),
        this.body.querySelector(`.${this.classNames.addContactButton}`),
      );
  }
}

export function initModals() {
  const modals = {};
  document.querySelectorAll('.modal').forEach((modal) => {
    const newModal = new Modal({ modal });
    modals[newModal.modalTemplate] = newModal;
  });
  return modals;
}
