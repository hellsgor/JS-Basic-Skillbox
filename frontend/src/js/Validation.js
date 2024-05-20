import { regexps } from '@/constants/regexps.js';
import { FORMS } from '@/constants/forms.js';
import { convertControlValue } from '@/helpers/convert-control-value.js';

/**
 * Класс для валидации полей формы.
 */
export class Validation {
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
   * Создает экземпляр класса Validation.
   * @param {ValidationErrorHandler} errorHandler - Обработчик ошибок валидации формы.
   */
  constructor(errorHandler) {
    this.errorsHandler = errorHandler;
  }

  /**
   * Валидирует поля формы.
   * @param {HTMLInputElement[]} controls - Массив контролов формы для валидации.
   * @returns {boolean} - Флаг успешной валидации.
   */
  validation(controls) {
    let validationFlag = true;

    controls.forEach((control) => {
      if (control.required && !control.value.trim()) {
        validationFlag = false;
        this.errorsHandler.invalidate(control, { code: 'EF001', text: null });
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

        if (actualRegexp && !convertControlValue(control).match(actualRegexp)) {
          validationFlag = false;
          this.errorsHandler.invalidate(control, { code: 'EF002', text: null });
        }
      }
    });

    return validationFlag;
  }
}
