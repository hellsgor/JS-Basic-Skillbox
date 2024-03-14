import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { createElement } from '@/helpers/create-element.js';

class Modal {
  modalClassName = 'modal';

  classNames = {
    closeBtn: `${this.modalClassName}__close-btn`,
    title: `${this.modalClassName}__title`,
    body: `${this.modalClassName}__body`,
    backdrop: 'backdrop',
  };

  attributes = {
    modalTemplate: 'data-modal-template',
  };

  modalTemplatesList = {
    client: 'client',
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
  };

  templatesIDs = {
    inputs: {
      name: 'modal-inputs-template',
      location: this.locations.form,
    },
    contacts: {
      name: 'modal-contacts-template',
      location: this.locations.form,
    },
    errors: {
      name: 'modal-errors-template',
      location: this.locations.body,
    },
  };

  strings = {
    title: {
      new: 'Новый клиент',
      edit: 'Изменить данные',
      delete: 'Удалить клиента',
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

      Object.keys(this.templatesIDs).forEach((templateID) => {
        const newElement = document
          .getElementById(this.templatesIDs[templateID].name)
          .content.cloneNode(true);

        this.templatesIDs[templateID].location === this.locations.body &&
          this.body.appendChild(newElement);

        this.templatesIDs[templateID].location === this.locations.form &&
          form.appendChild(newElement);
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

    if (this.modalTemplate === this.modalTemplatesList.client) {
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
}

export function initModals() {
  const modals = {};
  document.querySelectorAll('.modal').forEach((modal) => {
    const newModal = new Modal({ modal });
    modals[newModal.modalTemplate] = newModal;
  });
  return modals;
}
