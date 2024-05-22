import { FORMS } from '@/constants/forms.js';
import { MODALS } from '@/constants/modals.js';
import { cloneTemplate } from '@/helpers/clone-template.js';
import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { createElement } from '@/helpers/create-element.js';
import { movedFormControlPlaceholder } from '@/helpers/moved-form-control-placeholder.js';
import { Form } from '@/js/Form.js';
import { ModalContactControl } from '@/js/ModalContactControl.js';
import { CONTACTS } from '@/constants/contacts.js';
import clientsApi from '@api/Clients-api.js';
import { preloaderInstance } from '@/js/Preloader.js';
import { backdrop } from '@/js/Backdrop.js';

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
   * @param description - элемент содержащий в себе описание модального окна если оно предусмотрено
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
  description = null;
  body = null;
  form = null;
  maxContactsNumber = 10;
  formInstance = null;
  addContactButton = null;

  classNames = {
    modal: MODALS.CLASS_NAMES.MODAL_CLASS_NAME,
    closeBtn: MODALS.CLASS_NAMES.CLOSE_BTN,
    title: MODALS.CLASS_NAMES.TITLE,
    id: MODALS.CLASS_NAMES.ID,
    idItem: MODALS.CLASS_NAMES.ID_ITEM,
    description: MODALS.CLASS_NAMES.DESCRIPTION,
    body: MODALS.CLASS_NAMES.BODY,
    contacts: MODALS.CLASS_NAMES.CONTACTS,
    addContactButton: MODALS.CLASS_NAMES.ADD_CONTACT_BUTTON,
    actionButton: MODALS.CLASS_NAMES.ACTION_BUTTON,
    actionButtonPreloader: MODALS.CLASS_NAMES.ACTION_BUTTON_PRELOADER,
    actionButtonText: MODALS.CLASS_NAMES.ACTION_BUTTON_TEXT,
    cancelButton: MODALS.CLASS_NAMES.CANCEL_BUTTON,
    contact: MODALS.CLASS_NAMES.CONTACT,
    errorsWrapper: MODALS.CLASS_NAMES.ERRORS_WRAPPER,
    backdrop: MODALS.CLASS_NAMES.BACKDROP,
    formControlInput: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT,
  };

  /**
   * @param attributes - data-атрибуты используемые в модальном окне
   * @param attributes.modalTemplate - data-атрибут для хранения идентификатора шаблона модельного окна
   * @param attributes.isNeedOpenEditModal - data-атрибут, фактически флаг, свидетельствующий о необходимости открыть окно редактирования при закрытии окна удаления клиента
   */
  attributes = {
    modalTemplate: MODALS.ATTRS.MODAL_TEMPLATE,
    isNeedOpenEditModal: MODALS.ATTRS.IS_NEED_OPEN_EDIT_MODAL,
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
    centered: MODALS.MODIFIERS.CENTERED,
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
    descriptions: {
      delete: 'Вы&#160;действительно хотите удалить<br/>данного клиента?',
    },
  };

  /**
   * @param errors - объект для текстов ошибок
   * */
  errors = {
    clientDataError: 'Ошибка получения данных клиента:',
  };

  constructor(props = {}) {
    this.modal = props.modal || null;
    this.modalTemplate = this.modal
      ? this.modal.getAttribute(this.attributes.modalTemplate)
      : null;

    if (this.modal) {
      this.getModalElements();
      this.addEvents();
    }
  }

  /**
   * @description - Определяет элементы модального окна
   * */
  getModalElements() {
    this.closeBtn = this.modal.querySelector(`.${this.classNames.closeBtn}`);
    this.backdrop = document.querySelector(`.${this.classNames.backdrop}`);
    this.title = this.modal.querySelector(`.${this.classNames.title}`);
    this.id = this.modal.querySelector(`.${this.classNames.id}`);
    this.idItem = this.modal.querySelector(`.${this.classNames.idItem}`);
    this.description = this.modal.querySelector(
      `.${this.classNames.description}`,
    );
    this.body = this.modal.querySelector(`.${this.classNames.body}`);
  }

  /**
   * @description - Добавляет базовые события элементам модального окна
   * */
  addEvents() {
    this.closeBtn.addEventListener('click', () => this.closeModal());
  }

  /**
   * @description - Показывает модальное окно
   * @param {Object} client - Объект с информацией о клиенте
   * */
  showModal(client = null) {
    this.togglePointerEventValue('none');
    this.fillModal(client);

    if (client && this.modalTemplate === this.modalTemplatesList.editClient) {
      this.setHash(client.id);
    }
    backdrop.show();

    this.modal.classList.remove(
      `${this.classNames.modal}${this.modifiers.hidden}`,
    );
    this.modal.classList.add(
      `${this.classNames.modal}${this.modifiers.fadeIn}`,
    );

    setTimeout(
      () => {
        this.modal.classList.remove(
          `${this.classNames.modal}${this.modifiers.fadeIn}`,
        );
        this.togglePointerEventValue('auto');
      },
      convertTimeStringToMilliseconds(
        window.getComputedStyle(this.modal).animationDuration,
      ) + 1,
    );
  }

  /**
   * @description - Скрывает модальное окно
   * */
  closeModal() {
    this.modal.classList.add(
      `${this.classNames.modal}${this.modifiers.fadeOut}`,
    );
    backdrop.hide();

    setTimeout(
      () => {
        this.modal.classList.add(
          `${this.classNames.modal}${this.modifiers.hidden}`,
        );

        this.removeHash();
        this.clearModal();
        this.destroyForm();
      },
      convertTimeStringToMilliseconds(
        window.getComputedStyle(this.modal).animationDuration,
      ),
    );

    setTimeout(
      () => {
        this.modal.classList.remove(
          `${this.classNames.modal}${this.modifiers.fadeOut}`,
        );
      },
      convertTimeStringToMilliseconds(
        window.getComputedStyle(this.modal).animationDuration,
      ) + 5,
    );
  }

  /**
   * @description - Наполняет модальное окно в соответствии с шаблоном наполнения
   * @param {Object} client - Объект с информацией о клиенте
   * */
  fillModal(client = null) {
    this.setTitle(client);
    this.setID(client);
    this.setDescription();

    this.body.appendChild(this.createForm());
    this.form = this.body.querySelector('form');

    Object.keys(this.templatesIDs.required).forEach((templateID) => {
      if (
        this.modalTemplate === this.modalTemplatesList.delete &&
        (templateID === this.templatesIDs.required.contacts.name ||
          templateID === this.templatesIDs.required.inputs.name)
      ) {
        return;
      }

      let newElement = cloneTemplate(this.templatesIDs.required[templateID].id);

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

  /**
   * @description - Очищает модальное окно
   * */
  clearModal() {
    this.clearTitle();
    this.clearID();
    this.clearDescription();
    this.clearBody();
    this.modal.removeAttribute(this.attributes.isNeedOpenEditModal);
  }

  /**
   * @description - Устанавливает заголовок модального окна
   * @param {Object} client - Объект с информацией о клиенте
   * */
  setTitle(client) {
    if (this.modalTemplate === this.modalTemplatesList.delete) {
      this.title.innerText = this.strings.title.delete;
      this.title.classList.add(
        `${this.classNames.title}${this.modifiers.centered}`,
      );
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
    if (
      this.modalTemplate === this.modalTemplatesList.delete ||
      !client ||
      !client.id
    ) {
      return;
    }

    this.idItem.innerText = client.id.slice(-6);
    this.id.classList.remove(`${this.classNames.id}${this.modifiers.hidden}`);
  }

  /**
   * @description - Устанавливает описание модального окна если оно предусмотрено
   * */
  setDescription() {
    switch (this.modalTemplate) {
      case this.modalTemplatesList.delete:
        this.description.innerHTML = this.strings.descriptions.delete;
        break;

      default:
        break;
    }

    if (this.description.textContent) {
      this.description.classList.remove(
        `${this.classNames.description}${this.modifiers.hidden}`,
      );
    }
  }

  /**
   * @description - Очищает заголовок модального окна
   * */
  clearTitle() {
    this.title.innerText = '';
    this.title.classList.remove(
      `${this.classNames.title}${this.modifiers.centered}`,
    );
  }

  /**
   * @description - Очищает элемент с id клиента
   * */
  clearID() {
    this.idItem.innerText = '';
  }

  /**
   * @description - Очищает элемент с описанием модального окна
   * */
  clearDescription() {
    this.description.textContent = '';
    this.description.classList.add(
      `${this.classNames.description}${this.modifiers.hidden}`,
    );
  }

  /**
   * @description - Создаёт форму в модальном окне в соответствии с шаблоном наполнения
   * */
  createForm() {
    return createElement({
      tag: 'form',
      attributes: [
        { name: 'name', value: this.modalTemplate },
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
   * Устанавливает текст и события кнопок модального окна в соответствии с шаблоном наполнения.
   * @param {DocumentFragment} buttonsContainer - Контейнер для кнопок модального окна.
   * @param {Object} client - Объект с информацией о клиенте.
   * @returns {DocumentFragment} - Блок кнопок модального окна.
   */
  setButtons(buttonsContainer, client) {
    const cancelButton = buttonsContainer.querySelector(
      `.${this.classNames.cancelButton}`,
    );
    const actionButton = this.addActionButtonPreloader(
      buttonsContainer.querySelector(`.${this.classNames.actionButton}`),
    );

    this.setButtonsTexts(actionButton, cancelButton);

    cancelButton.addEventListener('click', async () => {
      this.closeModal();

      let eventName = null;
      let currentClient = null;

      if (this.modalTemplate === this.modalTemplatesList.editClient) {
        eventName = MODALS.CUSTOM_EVENTS.DELETE_MODAL_REQUEST;
      } else if (
        this.modalTemplate === this.modalTemplatesList.delete &&
        this.modal.getAttribute(this.attributes.isNeedOpenEditModal) === 'true'
      ) {
        eventName = MODALS.CUSTOM_EVENTS.EDIT_MODAL_REQUEST;
      }

      if (this.modalTemplate === this.modalTemplatesList.delete) {
        try {
          currentClient = await clientsApi.getClient({ id: client.id });
        } catch (error) {
          console.error(this.errors.clientDataError, error);
          return;
        }
      } else {
        currentClient = client;
      }

      if (eventName) {
        this.modal.dispatchEvent(
          new CustomEvent(eventName, { detail: currentClient }),
        );
      }
    });

    actionButton.addEventListener('click', () => {
      if (this.formInstance) {
        this.formInstance.doFormJob();
      } else {
        this.formInstance = new Form({
          form: this.form,
          submitButton: actionButton,
          cancelButton,
          errorsWrapper: this.modal.querySelector(
            `.${this.classNames.errorsWrapper}`,
          ),
          client: client || null,
          modalTemplate: this.modalTemplate,
          callback: () => this.closeModal(),
        });
      }
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

    this.addContactButton.addEventListener('click', () => {
      this.addContactControl();
      this.accessibilityAddContactButton();
    });

    if (client && client.contacts.length) {
      client.contacts.forEach((contact) => {
        this.addContactControl(contactsContainer, contact);
      });

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

    (parent || this.body)
      .querySelector(`.${this.classNames.contacts}`)
      .insertBefore(modalContactControl, this.addContactButton);
  }

  /**
   * @description - Управляет доступностью кнопки добавления контакта (проверка на максимальное количество контактов клиента)
   * */
  accessibilityAddContactButton() {
    this.addContactButton.disabled =
      this.body.querySelectorAll(`.${this.classNames.contact}`).length >=
      this.maxContactsNumber;
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
    const actionButtonText = actionButton.querySelector(
      `.${this.classNames.actionButtonText}`,
    );
    switch (this.modalTemplate) {
      case this.modalTemplatesList.newClient:
        actionButtonText.innerText = this.strings.buttons.save;
        cancelButton.innerText = this.strings.buttons.cancel;
        break;

      case this.modalTemplatesList.editClient:
        actionButtonText.innerText = this.strings.buttons.save;
        cancelButton.innerText = this.strings.buttons.delete;
        break;

      case this.modalTemplatesList.delete:
        actionButtonText.innerText = this.strings.buttons.deleteSmall;
        cancelButton.innerText = this.strings.buttons.cancel;
        break;

      default:
        break;
    }
  }

  /**
   * @description Добавляет прелоадер к кнопке действия.
   * @param {HTMLElement} actionButton - Элемент кнопки действия.
   * @returns {HTMLElement} - Элемент кнопки действия с прелоадером.
   */
  addActionButtonPreloader(actionButton) {
    const preloaderContainer = createElement({
      tag: 'div',
      classes: [
        this.classNames.actionButtonPreloader,
        `${this.classNames.actionButtonPreloader}${this.modifiers.hidden}`,
      ],
    });

    preloaderContainer.appendChild(preloaderInstance.create(true));

    actionButton
      .querySelector('.button__wrapper')
      .insertBefore(
        preloaderContainer,
        actionButton.querySelector('.button__text'),
      );

    return actionButton;
  }

  /**
   * @description Устанавливает хэш в адресной строке браузера.
   * @param {string} clientId - Идентификатор клиента, который будет установлен в качестве хэша.
   */
  setHash(clientId) {
    window.location.hash = clientId;
  }

  /**
   * @description Удаляет хэш из адресной строки браузера.
   */
  removeHash() {
    history.replaceState(null, null, ' ');
  }

  /**
   * @description Устанавливает значение свойства pointer-events для модального окна и его подложки.
   * @param {string} value Значение свойства pointer-events, например, "none" или "auto".
   */
  togglePointerEventValue(value) {
    this.modal.style = `pointer-events: ${value};`;
  }
}

/**
 * @description - Инициализирует все модальные окна на странице. Следует запустить один раз из js-файла страницы
 * */
export function initModals() {
  const modals = {};
  const modalElements = document.getElementsByClassName('modal');

  for (const modal of modalElements) {
    const newModal = new Modal({ modal });
    if (newModal.modalTemplate) {
      modals[newModal.modalTemplate] = newModal;
    }
  }

  return Object.keys(modals).length > 0 ? modals : null;
}