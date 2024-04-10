import { ERRORS } from '@/constants/errors.js';
import { FORMS } from '@/constants/forms';
import { createElement } from '@/helpers/create-element.js';
import { regexps } from '@/constants/regexps.js';
import { clearPhoneNumber } from '@/helpers/clearPhoneNumber.js';

export class Form {
  form = null;
  submitButton = null;
  controls = [];
  errorsWrapper = null;
  errorsCounter = 0;

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
  ];

  /**
   * @description - Создаёт экземпляр класса Form
   * @param {Object} props - объект передаваемых в конструктор свойств
   * @param {HTMLFormElement} props.form - элемент формы
   * @param {HTMLElement} props.submitButton - элемент отправляющий форму
   * @param {HTMLDivElement} props.errorsWrapper - элемент в котором будут выведены ошибки при валидации
   * @returns {Form} экземпляр класса Form
   */
  constructor(props) {
    this.form = props?.form || null;
    this.submitButton = props.submitButton || null;
    this.errorsWrapper = props.errorsWrapper || null;

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
        this.invalidate(control, 'EF001');
      }

      if (control.value) {
        if (
          !this.convertControlValue(control).match(
            control.hasAttribute(FORMS.ATTRS.VALIDATION_REGEXP_NAME)
              ? regexps[
                  `${control.getAttribute(FORMS.ATTRS.VALIDATION_REGEXP_NAME).toUpperCase()}`
                ]
              : this.validatedFormControlsTypes.find(
                  (validatedType) => validatedType.type === control.type,
                ),
          )
        ) {
          validationFlag = false;
          this.invalidate(control, 'EF002');
        }
      }
    });

    return validationFlag;
  }

  /**
   * @description - Добавляет стиль контрола с ошибкой и data-атрибут с "индексом" ошибки контролу (input'у или его обёртке)
   * @param {HTMLInputElement} control - контрол, которому следует добавить стиль контрола с ошибкой
   */
  addErrorStyle = (control) => {
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

    // добавление "индекса" ошибки контролу
    (input ? input : elementFlaggedWithError).setAttribute(
      FORMS.ATTRS.ERROR_INDEX,
      this.errorsCounter,
    );
    (input ? input : elementFlaggedWithError).addEventListener(
      'input',
      this.removeError,
    );
  };

  /**
   * @description - Метод-обёртка для удаления стилей ошибки с контрола и удаления элемента с текстом ошибки
   * @param {InputEvent} event - событие ввода на контроле
   * */
  removeError = (event) => {
    this.removeErrorTextElement(event.target);
    this.removeErrorStyle(event.target);
    event.target.removeEventListener('input', this.removeError);
  };

  /**
   * @description - Удаляет стиль с контрола с ошибкой у контрола
   * @param {HTMLInputElement} controlInput - контрол текст ошибки которого нужно удалить из this. errorsWrapper
   */
  removeErrorStyle(controlInput) {
    controlInput.removeAttribute(FORMS.ATTRS.ERROR_INDEX);

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
   * @param {string} errorText - текст ошибки
   * */
  showError(errorText) {
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
    console.log('submitForm');
    // TODO: написать отправку данных в Form
  }

  /**
   * @description - метод-обёртка, который вызывается в случае, если контрол не прошел валидацию
   * @param {HTMLInputElement} control - обрабатываемый контрол
   * @param {string} errorCode - код ошибки
   * */
  invalidate(control, errorCode) {
    this.errorsCounter += 1;
    this.addErrorStyle(control);
    this.showError(ERRORS[errorCode](control));
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
