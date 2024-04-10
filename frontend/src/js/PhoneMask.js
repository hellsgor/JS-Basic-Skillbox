/**
 * Класс, представляющий маску для ввода телефонного номера.
 */

export class PhoneMask {
  control = null;

  /**
   * Создает экземпляр PhoneMask.
   * @param {Object} props - Объект с параметрами для инициализации.
   * @param {HTMLElement} props.control - Элемент управления, к которому применяется маска.
   */
  constructor(props) {
    this.control = props.control;
    this.setEventsHandlers();
    this.addEventListeners();
    return this;
  }

  /**
   * @description Добавляет обработчики событий контролу.
   */
  addEventListeners() {
    this.control.addEventListener('keydown', this.onPhoneKeyDownHandler);
    this.control.addEventListener('input', this.onPhoneInputHandler, false);
    this.control.addEventListener('paste', this.onPhonePasteHandler, false);
  }

  /**
   * @description Удаляет обработчики событий с контрола.
   */
  removeEventListeners() {
    this.control.removeEventListener('keydown', this.onPhoneKeyDownHandler);
    this.control.removeEventListener('input', this.onPhoneInputHandler, false);
    this.control.removeEventListener('paste', this.onPhonePasteHandler, false);
  }

  /**
   * @description Получает числовое значение введенных символов.
   * @returns {string} - Числовое значение введенных символов.
   */
  getInputNumbersValue() {
    return this.control.value.replace(/\D/g, '');
  }

  /**
   * @description Обработчик события вставки текста в поле ввода.
   * @param {Event} event - Объект события.
   */
  onPhonePaste(event) {
    const input = event.target;
    const inputNumbersValue = this.getInputNumbersValue();
    const pasted = event.clipboardData || window.clipboardData;
    if (pasted) {
      const pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
      }
    }
  }

  /**
   * @description Обработчик события ввода текста в поле ввода.
   * @param {Event} event - Объект события.
   */
  onPhoneInput(event) {
    const input = event.target;
    let inputNumbersValue = this.getInputNumbersValue();
    const { selectionStart } = input;
    let formattedInputValue = '';

    if (!inputNumbersValue) {
      input.value = '';
      return '';
    }

    if (input.value.length !== selectionStart) {
      if (event.data && /\D/g.test(event.data)) {
        input.value = inputNumbersValue;
      }
      return;
    }

    if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] === '9')
        inputNumbersValue = `7${inputNumbersValue}`;
      const firstSymbols = inputNumbersValue[0] === '8' ? '+7' : '+7';
      formattedInputValue = `${firstSymbols} `;
      input.value = `${firstSymbols} `;
      if (inputNumbersValue.length > 1) {
        formattedInputValue += `(${inputNumbersValue.substring(1, 4)}`;
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += `) ${inputNumbersValue.substring(4, 7)}`;
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += `-${inputNumbersValue.substring(7, 9)}`;
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += `-${inputNumbersValue.substring(9, 11)}`;
      }
    } else {
      formattedInputValue = `+${inputNumbersValue.substring(0, 16)}`;
    }
    input.value = formattedInputValue;
  }

  /**
   * @description Обработчик события нажатия клавиши в поле ввода.
   * @param {Event} event - Объект события.
   */
  onPhoneKeyDown(event) {
    const inputValue = event.target.value.replace(/\D/g, '');
    if (event.keyCode === 8 && inputValue.length === 1) {
      event.target.value = '';
    }
  }

  /**
   * @description Устанавливает обработчики событий для методов класса.
   */
  setEventsHandlers() {
    this.onPhoneKeyDownHandler = this.onPhoneKeyDown.bind(this);
    this.onPhoneInputHandler = this.onPhoneInput.bind(this);
    this.onPhonePasteHandler = this.onPhonePaste.bind(this);
  }
}
