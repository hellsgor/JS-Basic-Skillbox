import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';

class Modal {
  modalClassName = 'modal';

  classNames = {
    closeBtn: '__close-btn',
    backdrop: 'backdrop',
  };

  attributes = {
    modalName: 'data-modal-template',
  };

  modifiers = {
    fadeIn: '_fade-in',
    fadeOut: '_fade-out',
    hidden: '_hidden',
  };

  modal = null;
  modalName = null;
  closeBtn = null;
  backdrop = null;

  constructor(props) {
    this.modal = props.modal;

    this.getModalElements();
    this.addEvents();

    return this;
  }

  addEvents() {
    this.modal.addEventListener('click', (event) => {
      event.target === this.modal && this.closeModal();
    });

    this.closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
  }

  showModal() {
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
      },
      convertTimeStringToMilliseconds(
        window.getComputedStyle(this.modal).animationDuration,
      ),
    );
  }

  getModalElements() {
    this.modalName = this.modal?.getAttribute(this.attributes.modalName);

    this.closeBtn = this.modal?.querySelector(
      `.${this.modalClassName}${this.classNames.closeBtn}`,
    );
    this.backdrop = document.querySelector(`.${this.classNames.backdrop}`);
  }
}

export function initModals() {
  const modals = {};
  document.querySelectorAll('.modal').forEach((modal) => {
    const newModal = new Modal({ modal });
    modals[newModal.modalName] = newModal;
  });
  return modals;
}
