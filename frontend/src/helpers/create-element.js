/**
 * @description Создает новый HTML элемент с указанными свойствами.
 * @param {Object} properties - Объект с параметрами для создания элемента.
 * @param {string} properties.tag - Тип создаваемого HTML элемента.
 * @param {(string|string[])} properties.classes - CSS-классы для применения к элементу.
 * @param {string} properties.text - Текстовое содержимое элемента.
 * @param {string} properties.html - HTML содержимое элемента.
 * @property {Object[]} properties.attributes - Массив атрибутов для добавления к элементу.
 * @param {string} attributes.name - Имя атрибута.
 * @param {string} attributes.value - Значение атрибута.
 * @param {function} properties.callback - Функция обратного вызова, которая будет вызвана при событии.
 * @param {string} properties.event - Тип события, на которое будет привязан обработчик (по умолчанию 'click').
 * @returns {HTMLElement} Новый HTML элемент с указанными свойствами.
 */

export function createElement({
  tag,
  classes,
  text,
  html,
  attributes,
  callback,
  event,
}) {
  const element = document.createElement(tag);

  if (Array.isArray(classes)) {
    classes.forEach((classesItem) => {
      element.classList.add(classesItem);
    });
  }

  if (typeof classes === 'string') {
    element.className = classes;
  }

  if (text) {
    element.innerText = text;
  }

  if (html) {
    element.innerHTML = html;
  }

  if (attributes && Array.isArray(attributes)) {
    attributes.forEach((attr) => {
      element.setAttribute(attr.name, attr.value);
    });
  }

  if (callback) {
    element.addEventListener(event ? event : 'click', callback);
  }

  return element;
}
