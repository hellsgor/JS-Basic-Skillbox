import { API } from '@/constants/api.js';
import { FORMS } from '@/constants/forms';
import { MODALS } from '@/constants/modals.js';
import { clientsTable } from '@/js/ClientsTable.js';
import clientsApi from '@api/Clients-api.js';
import { CONTACTS } from '@/constants/contacts.js';
import { SELECTS } from '@/constants/selects.js';
import { preloaderInstance } from '@/js/Preloader.js';
import { Validation } from '@/js/Validation.js';
import { convertControlValue } from '@/helpers/convert-control-value.js';
import { FormResponseErrorsHandler } from '@/js/FormResponseErrorsHandler.js';
import { ValidationErrorHandler } from '@/js/ValidationErrorHandler.js';

/**
 * Класс для работы с формами.
 */
export class Form {
  form = null;
  submitButton = null;
  controls = [];
  errorsWrapper = null;
  clientID = null;
  modalTemplate = null;
  callback = null;

  classNames = {
    modalContact: FORMS.CLASS_NAMES.MODAL_CONTACT,
    modalContactWithError: FORMS.CLASS_NAMES.MODAL_CONTACT_WITH_ERROR,
    modalContactType: FORMS.CLASS_NAMES.MODAL_CONTACT_TYPE_SELECT,
    formControlInput: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT,
    formControlInputInvalid: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT_INVALID,
    modalError: FORMS.CLASS_NAMES.MODAL_ERROR,
  };

  /**
   * Создает экземпляр класса Form.
   * @param {Object} props - Объект свойств для конструктора.
   * @param {HTMLFormElement} props.form - Элемент формы.
   * @param {HTMLElement} props.submitButton - Кнопка отправки формы.
   * @param {HTMLElement} [props.cancelButton] - Кнопка отмены отправки формы (опционально).
   * @param {HTMLDivElement} props.errorsWrapper - Обертка для отображения ошибок валидации.
   * @param {Object} props.client - Информация о клиенте.
   * @param {string} props.clientID - ID клиента.
   * @param {string} props.modalTemplate - Шаблон модального окна.
   * @param {Function} [props.callback] - Функция обратного вызова (опционально).
   */
  constructor(props) {
    this.form = props?.form || null;
    this.submitButton = props?.submitButton || null;
    this.cancelButton = props?.cancelButton || null;
    this.errorsWrapper = props?.errorsWrapper || null;
    this.clientID = props?.client?.id || null;
    this.modalTemplate = props?.modalTemplate || null;
    this.callback = props?.callback || null;

    this.validationErrorHandler = new ValidationErrorHandler(
      this.classNames,
      this.errorsWrapper,
    );

    this.validation = new Validation(this.validationErrorHandler);

    this.formResponseErrorsHandlerInstance = new FormResponseErrorsHandler(
      this.controls,
      this.validationErrorHandler,
      this.classNames,
      this.errorsWrapper,
    );

    this.doFormJob();
  }

  /**
   * Выполняет работу с формой.
   */
  doFormJob() {
    this.validationErrorHandler.resetErrors(this.controls);
    this.getElements();

    this.showSubmitButtonPreloader();
    this.setControlsAvailability(true);

    if (this.validation.validation(this.controls)) {
      this.submitForm();
    } else {
      this.setControlsAvailability(false);
      this.hideSubmitButtonPreloader();
    }
  }

  /**
   * Создает массив контролов формы.
   */
  getElements() {
    this.controls = this.form.querySelectorAll('input');
  }

  /**
   * Отправляет данные формы.
   */
  submitForm() {
    let method = '';

    switch (this.modalTemplate) {
      case MODALS.TEMPLATES.NEW_CLIENT:
        method = API.METHODS.ADD_CLIENT;
        break;

      case MODALS.TEMPLATES.EDIT_CLIENT:
        method = API.METHODS.EDIT_CLIENT;
        break;

      case MODALS.TEMPLATES.DELETE_CLIENT:
        method = API.METHODS.DELETE_CLIENT;
        break;

      default:
        console.error(
          'Неизвестный шаблон модального окна:',
          this.modalTemplate,
        );
        return;
    }

    if (!method) {
      console.error(
        'Метод не определен для шаблона модального окна:',
        this.modalTemplate,
      );
      return;
    }

    clientsApi[method]({
      data: this.serializeForm(),
      id: this.clientID,
    }).then((response) => {
      this.processingResponse(response);
    });
  }

  /**
   * Уничтожает экземпляр класса и освобождает ресурсы.
   */
  destroy() {
    this.controls.forEach((control) => {
      control.removeEventListener(
        'input',
        this.validation.errorsHandler.removeError,
      );
      this.validation.errorsHandler.removeErrorStyle(control);
    });

    this.errorsWrapper = null;
    this.controls = null;
    this.form = null;
    this.submitButton = null;
  }

  /**
   * Собирает значения полей формы для отправки.
   * @returns {Object} Объект со значениями полей формы
   * - name {string}: Имя.
   * - surname {string}: Фамилия.
   * - lastname {string}: Отчество.
   * - contacts {Object[]} Массив объектов контактов, каждый объект имеет следующие свойства:
   *   - type {string}: Тип контакта.
   *   - value {string}: Значение контакта.
   */
  serializeForm() {
    return Array.from(this.controls).reduce(
      (data, control) => {
        if (control.name) {
          data[control.name] = convertControlValue(control);
        } else {
          data.contacts.push({
            type: control
              .closest(`.${this.classNames.modalContact}`)
              .querySelector('button span').textContent,
            value: convertControlValue(control),
          });
        }
        return data;
      },
      { contacts: [] },
    );
  }

  /**
   * Обрабатывает ответ сервера.
   * @param {Object} response - Ответ сервера.
   */
  processingResponse(response) {
    // console.log('Ответ', response);
    // console.log(
    //   'Статус ответа сервера:',
    //   response.status || response.response.status,
    // );

    if (response.response && response.response.data.errors.length) {
      this.setControlsAvailability(false);
      this.hideSubmitButtonPreloader();
      this.formResponseErrorsHandlerInstance.processingResponseErrors(response);
    }

    if (response.status === 200 || response.status === 201) {
      clientsTable.initClients().then(() => {
        clientsTable.renderClients();
      });
      this.callback && this.callback();
    }
  }

  /**
   * Устанавливает доступность элементов управления формой.
   * @param {boolean} isMakeDisabled - Флаг, указывающий на необходимость установки элементов управления в неактивное состояние.
   */
  setControlsAvailability(isMakeDisabled) {
    const method = isMakeDisabled ? 'setAttribute' : 'removeAttribute';

    this.controls.forEach((control) => {
      control[method]('disabled', 'true');

      if (control.classList.contains(CONTACTS.CLASS_NAMES.input)) {
        const contactControl = control.closest(
          `.${this.classNames.modalContact}`,
        );
        contactControl
          .querySelector(`.${SELECTS.CLASS_NAMES.BUTTON}`)
          [method]('disabled', 'true');
        contactControl
          .querySelector(`.${MODALS.CLASS_NAMES.CONTACT_DELETE_BUTTON}`)
          [method]('disabled', 'true');
      }
    });

    if (this.form.querySelector(`.${MODALS.CLASS_NAMES.ADD_CONTACT_BUTTON}`)) {
      this.form
        .querySelector(`.${MODALS.CLASS_NAMES.ADD_CONTACT_BUTTON}`)
        [method]('disabled', 'true');
    }

    this.submitButton[method]('disabled', 'true');
    this.cancelButton[method]('disabled', 'true');
  }

  /**
   * Показывает прелоадер на кнопке отправки формы.
   */
  showSubmitButtonPreloader() {
    preloaderInstance.show({
      element: this.submitButton.querySelector(
        `.${MODALS.CLASS_NAMES.ACTION_BUTTON_PRELOADER}`,
      ),
      className: MODALS.CLASS_NAMES.ACTION_BUTTON_PRELOADER,
    });
    this.submitButton.querySelector(
      `.${MODALS.CLASS_NAMES.ACTION_BUTTON_TEXT}`,
    ).style = 'display: none';
  }

  /**
   * Скрывает прелоадер на кнопке отправки формы.
   */
  hideSubmitButtonPreloader() {
    preloaderInstance.hide({
      element: this.submitButton.querySelector(
        `.${MODALS.CLASS_NAMES.ACTION_BUTTON_PRELOADER}`,
      ),
      className: MODALS.CLASS_NAMES.ACTION_BUTTON_PRELOADER,
    });
    this.submitButton
      .querySelector(`.${MODALS.CLASS_NAMES.ACTION_BUTTON_TEXT}`)
      .removeAttribute('style');
  }
}

/**
 * Автоматически инициализирует формы на странице, помеченные атрибутом данных.
 */
export function autoInitForms() {
  document
    .querySelectorAll(`form[${FORMS.ATTRS.FORM_AUTO_INIT_DATA_ATTR}]`)
    .forEach((form) => {
      new Form({
        form,
        submitButton: document.querySelector(
          `[${FORMS.ATTRS.SUBMIT_BUTTON_AUTO_INIT_DATA_ATTR}="${form.name}"]`,
        ),
      });
    });
}
