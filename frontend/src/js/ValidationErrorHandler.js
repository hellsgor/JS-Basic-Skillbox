import { ERRORS } from '@/constants/errors.js';
import { createElement } from '@/helpers/create-element.js';
import { FORMS } from '@/constants/forms.js';

/**
 * Класс для обработки ошибок валидации формы.
 */
export class ValidationErrorHandler {
  classNames = null;
  errorsWrapper = null;
  errorsCounter = 0;

  /**
   * Создает экземпляр класса ValidationErrorHandler.
   * @param {Object} classNames - Объект с классами для стилизации элементов формы.
   * @param {HTMLDivElement} errorsWrapper - Элемент, в котором будут отображаться сообщения об ошибках.
   */
  constructor(classNames, errorsWrapper) {
    this.classNames = classNames;
    this.errorsWrapper = errorsWrapper;
  }

  /**
   * Метод вызывается при невалидном контроле для добавления стиля ошибки и отображения сообщения об ошибке.
   * @param {HTMLInputElement} control - Невалидный контрол.
   * @param {Object} errorProps - Объект с информацией об ошибке.
   * @param {string} [errorProps.code] - Код ошибки.
   * @param {string} [errorProps.text] - Текст ошибки.
   */
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
   * Добавляет стили для контрола с ошибкой и присваивает индекс ошибки контролу.
   * @param {HTMLInputElement} control - Контрол с ошибкой.
   * @param {boolean} [isNeededErrorIndex=true] - Флаг, указывающий на необходимость присваивания индекса ошибки.
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
   * Отображает текст ошибки.
   * @param {string} errorText - Текст ошибки.
   */
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
   * Сбрасывает ошибки и индексы ошибок.
   * @param {HTMLInputElement[]} controls - Массив контролов.
   */
  resetErrors(controls) {
    this.errorsCounter = 0;
    this.errorsWrapper.innerHTML = '';
    controls.forEach((control) => {
      this.removeErrorStyle(control);
    });
  }

  /**
   * Удаляет стили ошибки с контрола и элемент с текстом ошибки.
   * @param {InputEvent} event - Событие ввода на контроле.
   * @param {boolean} [isNeedRemoveElement=true] - Флаг, указывающий на необходимость удаления элемента с текстом ошибки.
   */
  removeError = (event, isNeedRemoveElement = true) => {
    isNeedRemoveElement && this.removeErrorTextElement(event.target);
    this.removeErrorStyle(event.target);
    event.target.removeEventListener('input', this.removeError);
  };

  /**
   * Удаляет стили ошибки с контрола.
   * @param {HTMLInputElement} controlInput - Контрол, с которого нужно удалить стили ошибки.
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
   * Удаляет элемент с текстом ошибки.
   * @param {HTMLInputElement} controlInput - Контрол, для которого нужно удалить текст ошибки.
   */
  removeErrorTextElement(controlInput) {
    this.errorsWrapper
      .querySelector(
        `[
      ${FORMS.ATTRS.ERROR_INDEX}="${controlInput.getAttribute(FORMS.ATTRS.ERROR_INDEX)}"
    ]`,
      )
      .remove();
  }
}
