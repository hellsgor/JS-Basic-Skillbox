export class PhoneMask {
  control = null;

  constructor(props) {
    this.control = props.control;
    this.setEventsHandlers();
    this.addEventListeners();
    return this;
  }

  addEventListeners() {
    this.control.addEventListener('keydown', this.onPhoneKeyDownHandler);
    this.control.addEventListener('input', this.onPhoneInputHandler, false);
    this.control.addEventListener('paste', this.onPhonePasteHandler, false);
  }

  removeEventListeners() {
    this.control.removeEventListener('keydown', this.onPhoneKeyDownHandler);
    this.control.removeEventListener('input', this.onPhoneInputHandler, false);
    this.control.removeEventListener('paste', this.onPhonePasteHandler, false);
  }

  getInputNumbersValue() {
    return this.control.value.replace(/\D/g, '');
  }

  onPhonePaste(e) {
    const input = e.target;
    const inputNumbersValue = this.getInputNumbersValue();
    const pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      const pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
      }
    }
  }

  onPhoneInput(e) {
    const input = e.target;
    let inputNumbersValue = this.getInputNumbersValue();
    const { selectionStart } = input;
    let formattedInputValue = '';

    if (!inputNumbersValue) {
      input.value = '';
      return '';
    }

    if (input.value.length !== selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
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

  onPhoneKeyDown(e) {
    const inputValue = e.target.value.replace(/\D/g, '');
    if (e.keyCode === 8 && inputValue.length === 1) {
      e.target.value = '';
    }
  }

  setEventsHandlers() {
    this.onPhoneKeyDownHandler = this.onPhoneKeyDown.bind(this);
    this.onPhoneInputHandler = this.onPhoneInput.bind(this);
    this.onPhonePasteHandler = this.onPhonePaste.bind(this);
  }
}
