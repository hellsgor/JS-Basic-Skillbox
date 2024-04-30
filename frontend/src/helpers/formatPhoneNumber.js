import { regexps } from '@/constants/regexps.js';

/**
 * @description Форматирует строку телефонного номера в стандартный формат.
 * @param {string} phoneNumber - Строка с телефонным номером для форматирования.
 * @returns {string} Отформатированный телефонный номер в формате "Код (XXX) YYY-ZZZZ-WWWW".
 */

export function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(
    regexps.CONVERTING_PHONE_NUMBER,
    '$1 ($2) $3-$4-$5',
  );
}
