import { clearPhoneNumber } from '@/helpers/clearPhoneNumber.js';

/**
 * Преобразует значение контрола контакта.
 * @param {HTMLInputElement} control - Инпут контрола, значение которого следует преобразовать.
 * @return {string} - Преобразованное значение.
 */
export function convertControlValue(control) {
  switch (control.type) {
    case 'tel':
      return clearPhoneNumber(control.value);
    default:
      return control.value.trim();
  }
}
