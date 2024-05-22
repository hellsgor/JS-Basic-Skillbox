/**
 * @description Очищает строку номера телефона от всех символов, кроме цифр и знака "+".
 * @param {string} phoneNumber - Номер телефона, который требуется очистить.
 * @returns {string} Очищенный номер телефона.
 */

export function clearPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[^\d+]/g, '');
}
