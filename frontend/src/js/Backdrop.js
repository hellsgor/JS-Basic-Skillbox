import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';
import { MODALS } from '@/constants/modals.js';

/**
 * Класс для управления фоном модальных окон.
 */
class Backdrop {
  $backdrop = null;

  backdropClassName = 'backdrop';
  modifiers = {
    hidden: 'hidden',
    fadeIn: 'fade-in',
    fadeOut: 'fade-out',
  };

  /**
   * Создает экземпляр класса Backdrop.
   * @param {HTMLElement} backdrop - Элемент бекдропа.
   */
  constructor(backdrop) {
    this.$backdrop = backdrop;
  }

  /**
   * Показывает бекдроп с анимацией.
   */
  show() {
    this.$backdrop.style = 'pointer-events: none;';
    this.$backdrop.classList.remove(
      `${this.backdropClassName}_${this.modifiers.hidden}`,
    );
    this.$backdrop.classList.add(
      `${this.backdropClassName}_${this.modifiers.fadeIn}`,
    );

    setTimeout(() => {
      this.$backdrop.classList.remove(
        `${this.backdropClassName}_${this.modifiers.fadeIn}`,
      );
      this.$backdrop.style = 'pointer-events: auto;';
    }, this.getTimeout() + 1);
  }

  /**
   * Скрывает бекдроп с анимацией.
   */
  hide() {
    this.$backdrop.classList.add(
      `${this.backdropClassName}_${this.modifiers.fadeOut}`,
    );

    setTimeout(() => {
      this.$backdrop.classList.add(
        `${this.backdropClassName}_${this.modifiers.hidden}`,
      );
    }, this.getTimeout());

    setTimeout(() => {
      this.$backdrop.classList.remove(
        `${this.backdropClassName}_${this.modifiers.fadeOut}`,
      );
    }, this.getTimeout() + 5);
  }

  /**
   * Возвращает время анимации в миллисекундах.
   * @returns {number} - Время анимации в миллисекундах.
   */
  getTimeout() {
    return convertTimeStringToMilliseconds(
      window.getComputedStyle(this.$backdrop).animationDuration,
    );
  }

  /**
   * Добавляет обработчик клика по бекдропу для закрытия модальных окон.
   * @param {Object} modals - Объект с модальными окнами.
   */
  addBackdropClickListener(modals) {
    this.$backdrop.addEventListener('click', () => {
      Object.keys(modals).forEach((modalName) => {
        if (
          modals[modalName].modal.classList.contains(
            `${MODALS.CLASS_NAMES.MODAL_CLASS_NAME}${MODALS.MODIFIERS.HIDDEN}`,
          )
        ) {
          return;
        }
        modals[modalName].closeModal();
      });
    });
  }
}

export const backdrop = new Backdrop(document.getElementById('backdrop'));
