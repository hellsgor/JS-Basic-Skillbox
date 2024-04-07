import { ERRORS } from '@/constants/errors.js';
import { FORMS } from '@/constants/forms';

export class Form {
  form = null;
  submitButton = null;
  controls = [];
  errorsWrapper = null;

  classNames = {
    modalContact: FORMS.CLASS_NAMES.MODAL_CONTACT,
    modalContactWithError: FORMS.CLASS_NAMES.MODAL_CONTACT_WITH_ERROR,
    formControlInput: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT,
    formControlInputInvalid: FORMS.CLASS_NAMES.FORM_CONTROL_INPUT_INVALID,
  };

  /**
   * @description - Создаёт экземпляр класса Form
   * @param props - объект передаваемых в конструктор свойств
   * @param props.form - элемент формы
   * @param props.submitButton - элемент отправляющий форму
   * @param props.errorsWrapper - элемент в котором будут выведены ошибки при валидации
   * @param props.errors - массив для строк ошибок
   * @returns экземпляр класса Form
   */
  constructor(props) {
    this.form = props?.form || null;
    this.submitButton = props.submitButton || null;
    this.errorsWrapper = props.errorsWrapper || null;
    this.errors = [];

    this.doFormJob();

    return this;
  }

  /**
   * @description - Метод-обёртка для повторного вызова методов формы в случае её изменения, например, валидация не пройдена и после было добавлено еще одно поле контакта, чтобы оно попало в массив контролов
   */
  doFormJob() {
    this.getControls();
    this.validation();
  }

  /**
   * @description - Создаёт массив контролов формы
   */
  getControls() {
    this.controls = this.form.querySelectorAll('input');
  }

  /**
   * @description - Валидирует поля формы
   */
  validation() {
    this.controls.forEach((control) => {
      if (control.required && !control.value) {
        this.errors.push(ERRORS.EF001(control));
        this.addErrorStyle(control);
      }
    });
  }

  /**
   * @description - Добавляет стиль контрола с ошибкой контролу
   * @param control - контрол которому следует добавить стиль контрола с ошибкой
   */
  addErrorStyle(control) {
    let elementFlaggedWithError = null;

    // Для контролов формы
    if (control.closest(`.${this.classNames.modalContact}`)) {
      elementFlaggedWithError = control.closest(
        `.${this.classNames.modalContact}`,
      );
      elementFlaggedWithError.classList.add(
        this.classNames.modalContactWithError,
      );
    }

    // Для контролов контактов
    if (control.classList.contains(this.classNames.formControlInput)) {
      elementFlaggedWithError = control;
      elementFlaggedWithError.classList.add(
        this.classNames.formControlInputInvalid,
      );
    }

    elementFlaggedWithError &&
      elementFlaggedWithError.addEventListener('input', (event) => {
        this.removeErrorStyle(event);
      });
  }

  /**
   * @description - Удаляет стиль с контрола с ошибкой у контрола
   */
  removeErrorStyle(event) {
    event.target.classList.remove(
      `${this.classNames.modalContactWithError}`,
      this.classNames.formControlInputInvalid,
    );
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
