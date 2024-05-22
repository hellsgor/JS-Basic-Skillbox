/**
 * Преобразует строку времени в миллисекунды.
 * @param {string} timeString - Строка времени в формате CSS, например, '0.5s' или '100ms'.
 * @returns {number|null} - Значение времени в миллисекундах или null, если строка не может быть преобразована.
 */
export function convertTimeStringToMilliseconds(timeString) {
  const multiplier = timeString.includes('s') ? 1000 : 1;
  const numericValue = parseFloat(timeString);
  return isNaN(numericValue) ? null : numericValue * multiplier;
}
