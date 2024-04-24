import { FORMS } from '@/constants/forms.js';
import { MODALS } from '@/constants/modals.js';
import { cloneTemplate } from '@/helpers/clone-template.js';
import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { createElement } from '@/helpers/create-element.js';
import { movedFormControlPlaceholder } from '@/helpers/moved-form-control-placeholder.js';
import { Form } from '@/js/Form.js';
import { ModalContactControl } from '@/js/ModalContactControl.js';
import { CONTACTS } from '@/constants/contacts.js';

/**
 * @description - Класс модальных окон. Описывает наполнение в соответствии с одним из шаблонов наполнения и поведение модальных окон.
 * */
class Modal {
  /**
   * @param modal - текущее модальное окно
   * @param modalTemplate - шаблон наполнения модального окна
   * @param closeBtn - кнопка закрытия модального окна
   * @param backdrop - backdrop. Общий для всех модальных окон
   * @param title - заголовок модального окна
   * @param id - контейнер для id клиента
   * @param idItem - элемент содержащий в себе id клиента
   * @param body - условное "тело" модального окна
   * @param maxContactsNumber - максимальное количество контактов
   * @param formInstance - экземпляр класса Form для Modal
   * @param classNames - CSS-классы элементов модального окна
   * @param addContactButton - кнопка добавления контрола контакта клиента
   * */

  modal = null;
  modalTemplate = null;
  closeBtn = null;
  backdrop = null;
  title = null;
  id = null;
  idItem = null;
  body = null;
  maxContactsNumber = 10;
  formInstance = null;
  addContactButton = null;

  classNames = {
    modal: MODALS.CLASS_NAMES.MODAL_CLASS_NAME,
    closeBtn: MODALS.CLASS_NAMES.CLOSE_BTN,
    title: MODALS.CLASS_NAMES.TITLE,
    id: MODALS.CLASS_NAMES.ID,
    idItem: MODALS.CLASS_NAMES.ID_ITEM,
    body: MODALS.CLASS_NAMES.BODY,
    contacts: MODALS.CLASS_NAMES.CONTACTS,
    addContactButton: MODALS.CLASS_NAMES.ADD_CONTACT_BUTTON,
    actionButton: MODALS.CLASS_NAMES.ACTION_BUTTON,
    cancelButton: MODALS.CLASS_NAMES.CANCEL_BUTTON,
    contact: MODALS.CLASS_NAMES.CONTACT,
    errorsWrapper: MODALS.CLASS_NAMES.ERRORS_WRAPPER,
    backdrop: MODALS.CLASS_NAMES.BACKDROP,
    formControlInput: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT,
  };

  /**
   * @param modalTemplate - data-атрибут для хранения идентификатора шаблона модельного окна
   */
  attributes = {
    modalTemplate: MODALS.ATTRS.MODAL_TEMPLATE,
  };

  /**
   * @param modalTemplatesList - идентификаторы шаблонов модальных окон
   * */
  modalTemplatesList = {
    newClient: MODALS.TEMPLATES.NEW_CLIENT,
    editClient: MODALS.TEMPLATES.EDIT_CLIENT,
    delete: MODALS.TEMPLATES.DELETE_CLIENT,
  };

  /**
   * @param modifiers - модификаторы css-селекторов.
   * */
  modifiers = {
    fadeIn: MODALS.MODIFIERS.FADE_IN,
    fadeOut: MODALS.MODIFIERS.FADE_OUT,
    hidden: MODALS.MODIFIERS.HIDDEN,
  };

  /**
   * @param locations - список родителей элементов модального окна. Нужны для более простой идентификации родителя добавляемого элемента
   * */
  locations = {
    body: MODALS.LOCATIONS.BODY,
    form: MODALS.LOCATIONS.FORM,
    contacts: MODALS.LOCATIONS.CONTACTS,
  };

  /**
   * @param templatesIDs - HTML-шаблоны элементов модального окна.
   * */
  templatesIDs = {
    required: {
      inputs: {
        name: MODALS.INNER_TEMPLATES.INPUTS.NAME,
        id: MODALS.INNER_TEMPLATES.INPUTS.ID,
        location: this.locations.form,
      },
      contacts: {
        name: MODALS.INNER_TEMPLATES.CONTACTS.NAME,
        id: MODALS.INNER_TEMPLATES.CONTACTS.ID,
        location: this.locations.form,
      },
      errors: {
        name: MODALS.INNER_TEMPLATES.ERRORS.NAME,
        id: MODALS.INNER_TEMPLATES.ERRORS.ID,
        location: this.locations.body,
      },
      buttons: {
        name: MODALS.INNER_TEMPLATES.BUTTONS.NAME,
        id: MODALS.INNER_TEMPLATES.BUTTONS.ID,
        location: this.locations.body,
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
   * @description - Определяет элементы модального окна
   * */
  getModalElements() {
    this.closeBtn = this.modal?.querySelector(`.${this.classNames.closeBtn}`);
    this.backdrop = document.querySelector(`.${this.classNames.backdrop}`);
    this.title = this.modal?.querySelector(`.${this.classNames.title}`);
    this.id = this.modal?.querySelector(`.${this.classNames.id}`);
    this.idItem = this.modal?.querySelector(`.${this.classNames.idItem}`);
    this.body = this.modal?.querySelector(`.${this.classNames.body}`);
  }

  /**
   * @description - Добавляет базовые события элементам модального окна
   * */
  addEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
  }

  /**
   * @description - Показывает модальное окно
   * @param {Object} client - Объект с информацией о клиенте
   * */
  showModal(client = null) {
    this.fillModal(client);

    this.modal.classList.remove(
      `${this.classNames.modal}${this.modifiers.hidden}`,
    );
    this.modal.classList.add(
      `${this.classNames.modal}${this.modifiers.fadeIn}`,
    );
    this.backdrop.classList.remove(
      `${this.classNames.backdrop}${this.modifiers.hidden}`,
    );
    this.backdrop.classList.add(
      `${this.classNames.backdrop}${this.modifiers.fadeIn}`,
    );
    setTimeout(
      () => {
        this.modal.classList.remove(
          `${this.classNames.modal}${this.modifiers.fadeIn}`,
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
   * @description - Скрывает модальное окно
   * */
  closeModal() {
    this.modal.classList.add(
      `${this.classNames.modal}${this.modifiers.fadeOut}`,
    );
    this.backdrop.classList.add(
      `${this.classNames.backdrop}${this.modifiers.fadeOut}`,
    );

    setTimeout(
      () => {
        this.modal.classList.add(
          `${this.classNames.modal}${this.modifiers.hidden}`,
        );
        this.modal.classList.remove(
          `${this.classNames.modal}${this.modifiers.fadeOut}`,
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

    this.destroyForm();
  }

  /**
   * @description - Наполняет модальное окно в соответствии с шаблоном наполнения
   * @param {Object} client - Объект с информацией о клиенте
   * */
  fillModal(client = null) {
    this.setTitle(client);
    this.setID(client);

    if (this.modalTemplate !== this.modalTemplatesList.delete) {
      this.body.appendChild(this.createForm(client));
      this.form = this.body.querySelector('form');

      Object.keys(this.templatesIDs.required).forEach((templateID) => {
        let newElement = cloneTemplate(
          this.templatesIDs.required[templateID].id,
        );

        if (templateID === this.templatesIDs.required.buttons.name) {
          newElement = this.setButtons(newElement, client);
        }

        if (templateID === this.templatesIDs.required.contacts.name) {
          newElement = this.setContacts(newElement, client);
        }

        switch (this.templatesIDs.required[templateID].location) {
          case this.locations.body:
            this.body.appendChild(newElement);
            break;

          case this.locations.form:
            this.form.appendChild(newElement);
            break;

          default:
            break;
        }
      });

      this.form
        .querySelectorAll(`.${this.classNames.formControlInput}`)
        .forEach((control) => {
          control.value = client ? client[control.name] : '';
          movedFormControlPlaceholder(control);
        });
    }
  }

  /**
   * @description - Очищает модальное окно
   * */
  clearModal() {
    this.clearTitle();
    this.clearID();
    this.clearBody();
  }

  /**
   * @description - Устанавливает заголовок модального окна
   * @param {Object} client - Объект с информацией о клиенте
   * */
  setTitle(client) {
    if (this.modalTemplate === this.modalTemplatesList.delete) {
      this.title.innerText = this.strings.title.delete;
      return;
    }

    this.title.innerText = client
      ? this.strings.title.edit
      : this.strings.title.new;
  }

  /**
   * @description - Устанавливает id клиента
   * @param {Object} client - Объект с информацией о клиенте
   * */
  setID(client) {
    if (!client || !client.id) {
      return;
    }

    this.idItem.innerText = client.id;
    this.id.classList.remove(`${this.classNames.id}${this.modifiers.hidden}`);
  }

  /**
   * @description - Очищает заголовок модального окна
   * */
  clearTitle() {
    this.title.innerText = '';
  }

  /**
   * @description - Очищает элемент с id клиента
   * */
  clearID() {
    this.idItem.innerText = '';
  }

  /**
   * @description - Создаёт форму в модальном окне в соответствии с шаблоном наполнения
   * @param {Object} client - Объект с информацией о клиенте
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
   * @description - Очищает "тело" модального окна
   * */
  clearBody() {
    this.body.innerHTML = '';
  }

  /**
   * @description - Устанавливает текст и события кнопок модального окна в соответствии с шаблоном наполнения
   * @param {DocumentFragment} buttonsContainer - Контейнер для кнопок модального окна
   * @param {Object} client - Объект с информацией о клиенте
   * @returns {DocumentFragment} - Блок кнопок модального окна
   * */
  setButtons(buttonsContainer, client) {
    const cancelButton = buttonsContainer.querySelector(
      `.${this.classNames.cancelButton}`,
    );
    const actionButton = buttonsContainer.querySelector(
      `.${this.classNames.actionButton}`,
    );

    this.setButtonsTexts(actionButton, cancelButton);

    cancelButton.addEventListener('click', () => {
      this.closeModal();

      if (this.modalTemplate === this.modalTemplatesList.editClient) {
        console.log('вывести модальное окно удаления');
        // TODO: модальное окно "удалить клиента"
      }

      if (this.modalTemplate === this.modalTemplatesList.delete) {
        console.log('вывести модальное окно редактирования клиента');
        // TODO: модальное окно редактирования клиента если окно удаления было открыто из окна редактирования
      }
    });

    actionButton.addEventListener('click', () => {
      if (this.formInstance) {
        this.formInstance.doFormJob();
      } else {
        this.formInstance = new Form({
          form: this.form,
          submitButton: actionButton,
          errorsWrapper: this.modal.querySelector(
            `.${this.classNames.errorsWrapper}`,
          ),
          client: client ? client : null,
          modalTemplate: this.modalTemplate,
          callback: () => this.closeModal(),
        });
      }
      console.log('formInstance', this.formInstance);
    });

    return buttonsContainer;
  }

  /**
   * @description Добавляет контакты клиента к элементу интерфейса.
   * @param {DocumentFragment} contactsContainer - Элемент интерфейса, к которому добавляются контакты.
   * @param {Object} client - Объект с информацией о клиенте.
   * @returns {DocumentFragment} - Блок контактов модального окна с добавленными контактами.
   */
  setContacts(contactsContainer, client) {
    this.addContactButton = contactsContainer.querySelector(
      `.${this.classNames.addContactButton}`,
    );

    // Добавление обработчика события для кнопки добавления контакта
    this.addContactButton.addEventListener('click', () => {
      this.addContactControl();
      this.accessibilityAddContactButton();
    });

    // Если у клиента есть контакты, добавляем их к новому элементу интерфейса
    if (client && client.contacts.length) {
      client.contacts.forEach((contact) => {
        this.addContactControl(contactsContainer, contact);
      });

      // Если количество контактов клиента достигло максимального значения, блокируем кнопку добавления контакта
      if (client.contacts.length >= this.maxContactsNumber) {
        this.addContactButton.setAttribute('disabled', 'true');
      }
    }

    return contactsContainer;
  }

  /**
   * @description - Добавляет новый контакт в форму модального окна и устанавливает слушатель события на кнопку удаления контакта
   * */
  addContactControl(parent = null, contact = null) {
    const modalContactControl = new ModalContactControl(contact);
    modalContactControl
      .querySelector(`.${CONTACTS.CLASS_NAMES.deleteButton}`)
      .addEventListener('click', this.accessibilityAddContactButton.bind(this));
    // FIXME: код работает верно, но редактор не понимает тип возвращаемый из ModalContactControl - нужно попробовать исправить

    (parent ? parent : this.body)
      .querySelector(`.${this.classNames.contacts}`)
      .insertBefore(modalContactControl, this.addContactButton);
  }

  /**
   * @description - Управляет доступностью кнопки добавления контакта (проверка на максимальное количество контактов клиента)
   * */
  accessibilityAddContactButton() {
    if (
      this.body.querySelectorAll(`.${this.classNames.contact}`).length >=
      this.maxContactsNumber
    ) {
      this.addContactButton.setAttribute('disabled', true);
    } else {
      if (this.addContactButton.hasAttribute('disabled')) {
        this.addContactButton.removeAttribute('disabled');
      }
    }
  }

  /**
   * @description - Уничтожает экземпляр класса Form если он уже был создан
   * */
  destroyForm() {
    if (this.formInstance) {
      this.formInstance.destroy();
      this.formInstance = null;
    }
  }

  /**
   * @description - Устанавливает тексты для кнопок действий и отмены в зависимости от шаблона модального окна.
   * @param {HTMLButtonElement} actionButton - Элемент кнопки действия.
   * @param {HTMLButtonElement} cancelButton - Элемент кнопки отмены.
   */
  setButtonsTexts(actionButton, cancelButton) {
    switch (this.modalTemplate) {
      case this.modalTemplatesList.newClient:
        actionButton.innerText = this.strings.buttons.save;
        cancelButton.innerText = this.strings.buttons.cancel;
        break;

      case this.modalTemplatesList.editClient:
        actionButton.innerText = this.strings.buttons.save;
        cancelButton.innerText = this.strings.buttons.delete;
        break;

      case this.modalTemplatesList.delete:
        actionButton.innerText = this.strings.buttons.deleteSmall;
        cancelButton.innerText = this.strings.buttons.cancel;
        break;

      default:
        break;
    }
  }
}

// TODO: написать метод destroy для класса Modal. Не забыть о событиях на кнопках удаления контакта

/**
 * @description - Инициализирует все модальные окна на странице. Следует запустить один раз из js-файла страницы
 * */
export function initModals() {
  const modals = {};
  document.querySelectorAll('.modal').forEach((modal) => {
    const newModal = new Modal({ modal });
    modals[newModal.modalTemplate] = newModal;
  });
  return modals;
}
