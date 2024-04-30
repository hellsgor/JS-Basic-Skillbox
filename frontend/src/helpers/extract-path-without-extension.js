import { regexps } from '@/constants/regexps.js';

/**
 * @description Извлекает путь из URL без расширения файла.
 * @param {string} url - URL, из которого нужно извлечь путь.
 * @param {boolean} [isAt=false] - Флаг, указывающий, добавлять ли символ '@' перед путем.
 * @returns {string|null} Извлеченный путь без расширения файла или null, если совпадение не найдено.
 */

export function extractPathWithoutExtension(url, isAt) {
  const match = url.match(regexps.EXTRACT_PATH_WITHOUT_EXTENSION);
  return match ? (isAt ? `@${match[1]}` : match[1]) : null;
}
