import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { createElement } from '@/helpers/create-element.js';
import clientsApi from '@api/clients-api.js';
import { cloneTemplate } from '@/helpers/clone-template.js';
import { Select } from '@/js/Select.js';

/**
 * @description Класс модальных окон. Описывает наполнение в соответствии с одним из шаблонов наполнения и поведение модальных окон.
 * */
class Modal {
  /**
   * @param modalClassName - класс любого модального окна
   * */
  modalClassName = 'modal';

  /**
   * @param classNames - классы элементов модального окна
   * */
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

  /**
   * @param modalTemplate - data-атрибут для хранения идентификатора шаблона модельного окна
   */
  attributes = {
    modalTemplate: 'data-modal-template',
  };

  /**
   * @param modalTemplatesList - идентификаторы шаблонов модальных окон
   * */
  modalTemplatesList = {
    newClient: 'new-client',
    editClient: 'edit-client',
    delete: 'delete',
  };

  /**
   * @param modifiers - модификаторы css-селекторов. Для анимаций
   * */
  modifiers = {
    fadeIn: '_fade-in',
    fadeOut: '_fade-out',
    hidden: '_hidden',
  };

  /**
   * @param locations - список родителей элементов модального окна. Нужны для более простой идентификации родителя добавляемого элемента
   * */
  locations = {
    body: 'body',
    form: 'form',
    contacts: 'contacts',
  };

  /**
   * @param templatesIDs - HTML-шаблоны элементов модального окна. Обязательные и опциональные
   * */
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

  /**
   * @param strings - объект для строковых значений, например, текста кнопок или текста заголовков модальных окон
   * */
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

  /**
   * @param modal - текущее модальное окно
   * @param modalTemplate - шаблон наполнения модального окна
   * @param closeBtn - кнопка закрытия модального окна
   * @param backdrop - backdrop. Общий для всех модальных окон
   * @param title - заголовок модального окна
   * @param body - условное "тело" модального окна
   * */
  modal = null;
  modalTemplate = null;
  closeBtn = null;
  backdrop = null;
  title = null;
  body = null;

  constructor(props) {
    this.modal = props?.modal;

    this.modalTemplate = this.modal?.getAttribute(
      this.attributes.modalTemplate,
    );

    this.getModalElements();
    this.addEvents();

    return this;
  }

  /**
   * Определяет элементы модального окна
   * */
  getModalElements() {
    this.closeBtn = this.modal?.querySelector(`.${this.classNames.closeBtn}`);
    this.backdrop = document.querySelector(`.${this.classNames.backdrop}`);
    this.title = this.modal?.querySelector(`.${this.classNames.title}`);
    this.body = this.modal?.querySelector(`.${this.classNames.body}`);
  }

  /**
   * Добавляет базовые события элементам модального окна
   * */
  addEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
  }

  /**
   * Показывает модальное окно
   * */
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

  /**
   * Скрывает модальное окно
   * */
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

  /**
   * Наполняет модальное окно в соответствии с шаблоном наполнения
   * */
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
              this.createContactControl();
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

  /**
   * Очищает модальное окно
   * */
  clearModal() {
    this.clearTitle();
    this.clearBody();
  }

  /**
   * Устанавливает заголовок модального окна
   * */
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

  /**
   * Очищает заголовок модального окна
   * */
  clearTitle() {
    this.title.innerText = '';
  }

  /**
   * Создаёт форму в модальном окне в соответствии с шаблоном наполнения
   * */
  createForm(client) {
    return createElement({
      tag: 'form',
      attributes: [
        { name: 'name', value: client ? 'edit-client' : 'new-client' },
        { name: 'autocomplete', value: 'off' },
      ],
    });
  }

  /**
   * Очищает "тело" модального окна
   * */
  clearBody() {
    this.body.innerHTML = '';
  }

  /**
   * Устанавливает текст и события кнопок модального окна в соответствии с шаблоном наполнения
   * */
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

  /**
   * Добавляет новый контакт в форму модального окна
   * */
  createContactControl() {
    const newContact = cloneTemplate(this.templatesIDs.optional.newContact.id);
    const newSelect = new Select({
      select: newContact.querySelector('.select'),
    });

    this.body
      .querySelector(`.${this.classNames.contacts}`)
      .insertBefore(
        newContact,
        this.body.querySelector(`.${this.classNames.addContactButton}`),
      );
  }
}

/**
 * Инициализирует все модальные окна на странице. Следует запустить один раз из js-файла страницы
 * */
export function initModals() {
  const modals = {};
  document.querySelectorAll('.modal').forEach((modal) => {
    const newModal = new Modal({ modal });
    modals[newModal.modalTemplate] = newModal;
  });
  return modals;
}
