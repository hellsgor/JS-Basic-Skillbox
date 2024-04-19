import { FORMS } from '@/constants/forms.js';
import { MODALS } from '@/constants/modals.js';
import { cloneTemplate } from '@/helpers/clone-template.js';
import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { createElement } from '@/helpers/create-element.js';
import { movedFormControlPlaceholder } from '@/helpers/moved-form-control-placeholder.js';
import { Form } from '@/js/Form.js';
import { ModalContactControl } from '@/js/ModalContactControl.js';

/**
 * @description Класс модальных окон. Описывает наполнение в соответствии с одним из шаблонов наполнения и поведение модальных окон.
 * */
class Modal {
  /**
   * @param modal - текущее модальное окно
   * @param modalTemplate - шаблон наполнения модального окна
   * @param closeBtn - кнопка закрытия модального окна
   * @param backdrop - backdrop. Общий для всех модальных окон
   * @param title - заголовок модального окна
   * @param body - условное "тело" модального окна
   * @param maxContactsNumber - максимальное количество контактов
   * @param formInstance - экземпляр класса Form для Modal
   * @param classNames - CSS-классы элементов модального окна
   * */

  modal = null;
  modalTemplate = null;
  closeBtn = null;
  backdrop = null;
  title = null;
  body = null;
  maxContactsNumber = 10;
  formInstance = null;
  client = null;

  classNames = {
    modal: MODALS.CLASS_NAMES.MODAL_CLASS_NAME,
    closeBtn: MODALS.CLASS_NAMES.CLOSE_BTN,
    title: MODALS.CLASS_NAMES.TITLE,
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
    delete: MODALS.TEMPLATES.DELETE,
  };

  /**
   * @param modifiers - модификаторы css-селекторов. Для анимаций
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
    if (client) {
      this.client = client;
    }

    this.fillModal(this.client);

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
   * Скрывает модальное окно
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
   * Наполняет модальное окно в соответствии с шаблоном наполнения
   * */
  fillModal(client = null) {
    this.setTitle(client);

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
          newElement
            .querySelector(`.${this.classNames.addContactButton}`)
            .addEventListener('click', () => {
              this.addContactControl();
              this.disabledAddContactButton();
            });
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
          movedFormControlPlaceholder(control);
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
  setButtons(buttonsContainer, client) {
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
    }

    return buttonsContainer;
  }

  /**
   * Добавляет новый контакт в форму модального окна
   * */
  addContactControl() {
    this.body
      .querySelector(`.${this.classNames.contacts}`)
      .insertBefore(
        new ModalContactControl(),
        this.body.querySelector(`.${this.classNames.addContactButton}`),
      );
  }

  disabledAddContactButton() {
    if (
      this.body.querySelectorAll(`.${this.classNames.contact}`).length >=
      this.maxContactsNumber
    ) {
      this.body
        .querySelector(`.${this.classNames.addContactButton}`)
        .setAttribute('disabled', true);
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

  // TODO: написать метод destroy для класса Modal
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
