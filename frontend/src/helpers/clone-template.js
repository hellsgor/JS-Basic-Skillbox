/**
 * @description Клонирует содержимое элемента-шаблона по его идентификатору.
 * @param {string} templateID - Идентификатор элемента-шаблона, который требуется склонировать.
 * @returns {Node} Клонированное содержимое элемента-шаблона.
 */

export function cloneTemplate(templateID) {
  return document.getElementById(templateID).content.cloneNode(true);
}
