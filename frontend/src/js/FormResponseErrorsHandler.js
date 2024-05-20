import { ERRORS } from '@/constants/errors.js';
import { FORMS } from '@/constants/forms.js';

/**
 * Класс FormResponseErrorsHandler обрабатывает ошибки, полученные в ответе от сервера при отправке формы.
 */
export class FormResponseErrorsHandler {
  $controls = [];
  validationErrorHandler = null;
  classNames = null;
  errorsCounter = 0;
  $errorsWrapper = null;

  /**
   * Создает экземпляр класса FormResponseErrorsHandler.
   * @param {HTMLInputElement[]} controls - Список контролов формы.
   * @param {Object} errorHandler - Объект для обработки ошибок валидации.
   * @param {Object} classNames - Классы стилей элементов формы.
   * @param {HTMLElement} errorsWrapper - Элемент, в котором отображаются ошибки.
   */
  constructor(controls, errorHandler, classNames, errorsWrapper) {
    this.$controls = controls;
    this.validationErrorHandler = errorHandler;
    this.classNames = classNames;
    this.$errorsWrapper = errorsWrapper;
  }

  /**
   * @description Обрабатывает ошибки из ответа сервера.
   * @param {Object} response - Объект ответа сервера (Axios).
   */
  processingResponseErrors(response) {
    if (this.handleNetworkError(response)) {
      return;
    }

    if (this.handleValidationErrors(response)) {
      return;
    }
  }

  /**
   * @description Обрабатывает ошибки сети и статус 404.
   * @param {Object} response - Объект ответа сервера (Axios).
   * @returns {boolean} Возвращает true, если ошибка сети или статус 404, иначе false.
   */
  handleNetworkError(response) {
    if (
      response.code === 'ERR_NETWORK' ||
      response.response.status === 404 ||
      response.response.status >= 500
    ) {
      this.validationErrorHandler.showError(ERRORS.EF003());
      return true;
    }
    return false;
  }

  /**
   * @description Обрабатывает ошибки валидации.
   * @param {Object} response - Объект ответа сервера (Axios).
   * @returns {boolean} Возвращает true, если есть ошибки валидации, иначе false.
   */
  handleValidationErrors(response) {
    if (response.response.status === 422) {
      response.response.data.errors.forEach((error) => {
        if (error.field !== FORMS.CLIENT_OBJECT_CONTACTS_PROPERTY_NAME) {
          this.handleControlError(error);
        } else {
          this.handleContactError(error);
        }
      });
      return true;
    }
    return false;
  }

  /**
   * @description Обрабатывает ошибки контролов формы.
   * @param {Object} error - Объект с информацией об ошибке.
   */
  handleControlError(error) {
    const control = Array.from(this.$controls).find(
      (control) => control.name === error.field,
    );
    if (control) {
      this.validationErrorHandler.invalidate(control, {
        text: error.message,
      });
    }
  }

  /**
   * @description Обрабатывает ошибки контактов формы.
   * @param {Object} error - Объект с информацией об ошибке.
   */
  handleContactError(error) {
    this.$controls.forEach((control) => {
      if (
        control.closest(`.${this.classNames.modalContact}`) &&
        !control.value.trim()
      ) {
        this.handleEmptyContact(control, error.message);
      }
    });
  }

  /**
   * @description Обрабатывает ошибки пустых контактов формы.
   * @param {HTMLInputElement} control - Контрол контакта, у которого значение пустое.
   * @param {string} errorMessage - Текст ошибки.
   */
  handleEmptyContact(control, errorMessage) {
    ++this.errorsCounter;
    this.validationErrorHandler.addErrorStyle(control, false);
    control.addEventListener('input', () =>
      this.removeEmptyContactError(errorMessage),
    );
    this.validationErrorHandler.showError(errorMessage);
  }

  /**
   * @description Удаляет ошибки пустых контактов формы.
   * @param {string} errorMessage - Текст ошибки.
   */
  removeEmptyContactError(errorMessage) {
    const isSomeContactsWithError = Array.from(this.$controls).some(
      (control) =>
        control.closest(`.${this.classNames.modalContact}`) &&
        control
          .closest(`.${this.classNames.modalContact}`)
          .classList.contains(`${this.classNames.modalContactWithError}`),
    );
    if (!isSomeContactsWithError) {
      const contactsErrorElement = Array.from(
        this.$errorsWrapper.querySelectorAll(`.${this.classNames.modalError}`),
      ).find((errorElement) => errorElement.textContent === errorMessage);
      contactsErrorElement && contactsErrorElement.remove();
    }
  }
}
