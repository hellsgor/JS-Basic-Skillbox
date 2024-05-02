import { createElement } from '@/helpers/create-element.js';

/**
 * Представляет собой объект для управления прелоадером.
 */
export class Preloader {
  modifiers = {
    hidden: 'hidden',
  };

  /**
   * @description Показывает прелоадер.
   * @param {Object} options - Параметры для управления прелоадером.
   * @param {HTMLElement} options.element - Элемент, в котором находится прелоадер.
   * @param {string} options.className - СSS-класс элемента в котором находится прелоадер.
   */
  show({ element, className }) {
    element.classList.remove(`${className}_${this.modifiers.hidden}`);
  }

  /**
   * @description Скрывает прелоадер.
   * @param {Object} options - Параметры для управления прелоадером.
   * @param {HTMLElement} options.element - Элемент, в котором находится прелоадер.
   * @param {string} options.className - СSS-класс элемента в котором находится прелоадер.
   * */
  hide({ element, className }) {
    element.classList.add(`${className}_${this.modifiers.hidden}`);
  }

  /**
   * @description Создает элемент прелоадера.
   * @param {boolean} isWhite - Должен ли быть прелоадер белым
   * @returns {HTMLElement} Элемент прелоадера.
   */
  create(isWhite = false) {
    return createElement({
      tag: 'div',
      classes: isWhite ? ['preloader', 'preloader_white'] : 'preloader',
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
          <g clip-path="url(#clip0_121_2401)">
            <path d="M14.0002 50.0005C14.0002 69.8825 30.1182 86.0005 50.0002 86.0005C69.8822 86.0005 86.0002 69.8825 86.0002 50.0005C86.0002 30.1185 69.8823 14.0005 50.0003 14.0005C45.3513 14.0005 40.9082 14.8815 36.8282 16.4865" stroke-width="8" stroke-miterlimit="10" stroke-linecap="round" />
          </g>
          <defs>
            <clipPath id="clip0_121_2401">
              <rect width="100" height="100" fill="none" />
            </clipPath>
          </defs>
        </svg>
      `,
    });
  }
}

export const preloader = new Preloader();
