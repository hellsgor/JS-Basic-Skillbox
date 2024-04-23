import { API } from '@/constants/api.js';
import { ERRORS } from '@/constants/errors.js';
import { FORMS } from '@/constants/forms';
import { MODALS } from '@/constants/modals.js';
import { regexps } from '@/constants/regexps.js';
import { clearPhoneNumber } from '@/helpers/clearPhoneNumber.js';
import { createElement } from '@/helpers/create-element.js';
import { clientsTable } from '@/js/ClientsTable.js';
import clientsApi from '@api/Clients-api.js';

export class Form {
  form = null;
  submitButton = null;
  controls = [];
  errorsWrapper = null;
  errorsCounter = 0;
  clientID = null;
  modalTemplate = null;
  callback = null;

  classNames = {
    modalContact: FORMS.CLASS_NAMES.MODAL_CONTACT,
    modalContactWithError: FORMS.CLASS_NAMES.MODAL_CONTACT_WITH_ERROR,
    formControlInput: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT,
    formControlInputInvalid: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT_INVALID,
    modalError: FORMS.CLASS_NAMES.MODAL_ERROR,
  };

  validatedFormControlsTypes = [
    {
      type: 'email',
      regexp: regexps.EMAIL,
    },
    {
      type: 'tel',
      regexp: regexps.PHONE_NUMBER,
    },
    {
      type: 'text',
      regexp: null,
    },
    {
      type: 'url',
      regexp: null,
    },
  ];

  /**
   * @description - Создаёт экземпляр класса Form
   * @param {Object || null} props - объект передаваемых в конструктор свойств
   * @param {HTMLFormElement || null} props.form - элемент формы
   * @param {HTMLElement || null} props.submitButton - элемент отправляющий форму
   * @param {HTMLDivElement || null} props.errorsWrapper - элемент в котором будут выведены ошибки при валидации
   * @param {string || null} props.clientID - id клиента
   * @param {string || null} props.modalTemplate - шаблон модального окна для идентификации метода API
   * @returns {Form} экземпляр класса Form
   */
  constructor(props) {
    this.form = props?.form || null;
    this.submitButton = props.submitButton || null;
    this.errorsWrapper = props.errorsWrapper || null;
    this.clientID = props.client ? props.client.id : null;
    this.modalTemplate = props.modalTemplate || null;
    this.callback = props.callback || null;

    this.doFormJob();

    return this;
  }

  /**
   * @description - Метод-обёртка для повторного вызова методов формы в случае её изменения, например, валидация не пройдена и после было добавлено еще одно поле контакта, чтобы оно попало в массив контролов
   */
  doFormJob() {
    this.resetErrors();
    this.getControls();

    if (this.validation()) {
      this.submitForm();
    }
  }

  /**
   * @description - Создаёт массив контролов формы
   */
  getControls() {
    this.controls = this.form.querySelectorAll('input');
  }

  /**
   * @description - Валидирует поля формы
   * @return {boolean} - флаг успешной валидации
   */
  validation() {
    let validationFlag = true;

    this.controls.forEach((control) => {
      if (control.required && !control.value.trim()) {
        validationFlag = false;
        this.invalidate(control, { code: 'EF001', text: null });
      }

      if (control.value) {
        const actualRegexp = control.hasAttribute(
          FORMS.ATTRS.VALIDATION_REGEXP_NAME,
        )
          ? regexps[
              `${control.getAttribute(FORMS.ATTRS.VALIDATION_REGEXP_NAME).toUpperCase()}`
            ]
          : this.validatedFormControlsTypes.find(
              (validatedType) => validatedType.type === control.type,
            ).regexp;

        if (
          actualRegexp &&
          !this.convertControlValue(control).match(actualRegexp)
        ) {
          validationFlag = false;
          this.invalidate(control, { code: 'EF002', text: null });
        }
      }
    });

    return validationFlag;
  }

  /**
   * @description - Добавляет стиль контрола с ошибкой и data-атрибут с "индексом" ошибки контролу (input'у или его обёртке)
   * @param {HTMLInputElement} control - контрол, которому следует добавить стиль контрола с ошибкой
   * @param {boolean} isNeededErrorIndex - необязательный параметр для проверки необходимости присвоения индекса ошибки контролу
   */
  addErrorStyle = (control, isNeededErrorIndex = true) => {
    let elementFlaggedWithError = null;
    let input = null;

    const addErrorClass = (control) => {
      // Для контролов контактов формы
      if (control.closest(`.${this.classNames.modalContact}`)) {
        input = control;
        elementFlaggedWithError = control.closest(
          `.${this.classNames.modalContact}`,
        );
        elementFlaggedWithError.classList.add(
          this.classNames.modalContactWithError,
        );
      }

      // Для контролов формы
      if (control.classList.contains(this.classNames.formControlInput)) {
        elementFlaggedWithError = control;
        elementFlaggedWithError.classList.add(
          this.classNames.formControlInputInvalid,
        );
      }
    };

    addErrorClass(control);

    if (isNeededErrorIndex) {
      // добавление "индекса" ошибки контролу
      (input ? input : elementFlaggedWithError).setAttribute(
        FORMS.ATTRS.ERROR_INDEX,
        this.errorsCounter,
      );
      (input ? input : elementFlaggedWithError).addEventListener(
        'input',
        this.removeError,
      );
    }
  };

  /**
   * @description - Метод-обёртка для удаления стилей ошибки с контрола и удаления элемента с текстом ошибки
   * @param {InputEvent} event - событие ввода на контроле
   * @param {boolean} isNeedRemoveElement - необязательный параметр для вызова метода удаления элемента с текстом ошибки
   * */
  removeError = (event, isNeedRemoveElement = true) => {
    isNeedRemoveElement && this.removeErrorTextElement(event.target);
    this.removeErrorStyle(event.target);
    event.target.removeEventListener('input', this.removeError);
  };

  /**
   * @description - Удаляет стиль с контрола с ошибкой у контрола
   * @param {HTMLInputElement} controlInput - контрол текст ошибки которого нужно удалить из this. errorsWrapper
   */
  removeErrorStyle(controlInput) {
    if (controlInput.hasAttribute(FORMS.ATTRS.ERROR_INDEX)) {
      controlInput.removeAttribute(FORMS.ATTRS.ERROR_INDEX);
    }

    (controlInput.closest(`.${this.classNames.modalContact}`)
      ? controlInput.closest(`.${this.classNames.modalContact}`)
      : controlInput
    ).classList.remove(
      `${this.classNames.modalContactWithError}`,
      this.classNames.formControlInputInvalid,
    );
  }

  /**
   * @description - Удаляет элемент с текстом ошибки
   * @param controlInput {HTMLInputElement} - контрол текст ошибки которого нужно удалить из this.errorsWrapper
   * */
  removeErrorTextElement(controlInput) {
    this.errorsWrapper
      .querySelector(
        `[
      ${FORMS.ATTRS.ERROR_INDEX}="${controlInput.getAttribute(FORMS.ATTRS.ERROR_INDEX)}"
    ]`,
      )
      .remove();
  }

  /**
   * @description - Добавляет элемент с текстом ошибки в this.errorsWrapper
   * @param {string | null} errorText - текст ошибки
   * */
  showError(errorText) {
    if (!errorText) {
      return;
    }

    this.errorsWrapper.appendChild(
      createElement({
        tag: 'span',
        classes: this.classNames.modalError,
        text: errorText,
        attributes: [
          {
            name: FORMS.ATTRS.ERROR_INDEX,
            value: this.errorsCounter,
          },
        ],
      }),
    );
  }

  /**
   * @description - Сбрасывает ошибки и индексы ошибок
   * */
  resetErrors() {
    this.errorsCounter = 0;
    this.errorsWrapper.innerHTML = '';
    this.controls.forEach((control) => {
      this.removeErrorStyle(control);
    });
  }

  /**
   * @description - Отправляет данные формы
   * */
  submitForm() {
    let method = '';

    switch (this.modalTemplate) {
      case MODALS.TEMPLATES.NEW_CLIENT:
        method = API.METHODS.ADD_CLIENT;
        break;
      case MODALS.TEMPLATES.EDIT_CLIENT:
        method = API.METHODS.EDIT_CLIENT;
        break;

      default:
        break;
    }

    clientsApi[method](this.serializeForm(), this.clientID).then((response) => {
      this.processingResponse(response);
    });
  }

  /**
   * @description - метод-обёртка, который вызывается в случае, если контрол не прошел валидацию
   * @param {HTMLInputElement} control - обрабатываемый контрол
   * @param {Object || null} errorProps - объект с кодом или текстом ошибки
   * @param {string || null} errorProps.code - код ошибки
   * @param {string || null} errorProps.text - текст ошибки
   * */
  invalidate(control, errorProps) {
    this.errorsCounter += 1;
    this.addErrorStyle(control);
    if (errorProps) {
      this.showError(
        errorProps.code ? ERRORS[errorProps.code](control) : errorProps.text,
      );
    }
  }

  /**
   * @description - Преобразует значение контрола контакта
   * @param {HTMLInputElement} control - инпут контрола значение которого следует преобразовать
   * @return {string} - преобразованное значение
   * */
  convertControlValue(control) {
    switch (control.type) {
      case 'tel':
        return clearPhoneNumber(control.value);
      default:
        return control.value.trim();
    }
  }

  /**
   * @description - Освобождает ресурсы, связанные с экземпляром класса Form и удаляет обработчики событий.
   * @memberof Form
   */
  destroy() {
    this.controls.forEach((control) => {
      control.removeEventListener('input', this.removeError);
    });

    this.controls = [];

    this.resetErrors();
    this.form = null;
    this.submitButton = null;
    this.errorsWrapper = null;
  }

  /**
   * @description - Собирает значения полей в объект для отправки.
   * @returns {Object} Объект со следующими свойствами:
   * - name {string}: Имя.
   * - surname {string}: Фамилия.
   * - lastname {string}: Отчество.
   * - contacts {Object[]} Массив объектов контактов, каждый объект имеет следующие свойства:
   *   - type {string}: Тип контакта.
   *   - value {string}: Значение контакта.
   */
  serializeForm() {
    const data = {
      contacts: [],
    };
    Array.from(this.controls).map((control) => {
      if (control.name) {
        data[control.name] = this.convertControlValue(control);
      }

      if (!control.name) {
        data.contacts.push({
          type: control
            .closest(`.${this.classNames.modalContact}`)
            .querySelector('button span').textContent,
          value: this.convertControlValue(control),
        });
      }
    });

    return data;
  }

  /**
   * @description - Обрабатывает ответ сервера
   * @param response - объект ответа сервера (Axios)
   * */
  processingResponse(response) {
    // console.log('Статус ответа сервера:', response.status);
    // console.log('Ответ', response);

    if (response.error) {
      this.processingResponseErrors(response);
    }

    if (response.status === 200 || response.status === 201) {
      clientsTable.removeClient(this.clientID);
      if (response.data && response.data.id) {
        clientsTable.addClient(response.data);
      }
      clientsTable.renderClients();
      this.callback && this.callback();
    }
  }

  /**
   * @description - Обрабатывает ошибки из ответа сервера
   * @param response - объект ответа сервера (Axios)
   * */
  processingResponseErrors(response) {
    if (
      response.error.code === 'ERR_NETWORK' ||
      response.error.response.status === 404 ||
      response.error.response.status >= 500
    ) {
      this.showError(ERRORS.EF003());
      return;
    }

    if (response.error.response.status === 422) {
      response.error.response.data.errors.forEach((error) => {
        if (error.field !== FORMS.CLIENT_OBJECT_CONTACTS_PROPERTY_NAME) {
          this.invalidate(
            Array.from(this.controls).find(
              (control) => control.name === error.field,
            ),
            { text: error.message, code: null },
          );
        } else {
          this.controls.forEach((control) => {
            if (
              control.closest(`.${this.classNames.modalContact}`) &&
              !control.value.trim()
            ) {
              ++this.errorsCounter;
              this.addErrorStyle(control, false);
              control.addEventListener('input', (event) => {
                const errorText = error.message;
                let isSomeContactsWithError = false;

                this.removeError(event, false);

                this.controls.forEach((control) => {
                  if (
                    control.closest(`.${this.classNames.modalContact}`) &&
                    control
                      .closest(`.${this.classNames.modalContact}`)
                      .classList.contains(
                        `${this.classNames.modalContactWithError}`,
                      )
                  ) {
                    isSomeContactsWithError = true;
                  }
                });
                if (!isSomeContactsWithError) {
                  const contactsErrorElement = Array.from(
                    this.errorsWrapper.querySelectorAll(
                      `.${this.classNames.modalError}`,
                    ),
                  ).find(
                    (errorElement) => errorElement.textContent === errorText,
                  );

                  contactsErrorElement && contactsErrorElement.remove();
                }
              });
            }
          });
          this.showError(error.message);
        }
      });
    }
  }
}

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
