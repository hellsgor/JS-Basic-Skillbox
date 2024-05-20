import { MODALS } from '@/constants/modals.js';

/**
 * Добавляет обработчик клика на элемент backdrop, который закрывает все открытые модальные окна.
 *
 * @param {Object} modals - Объект, содержащий модальные окна.
 * @param {Object} modals.modalName - Объект, описывающий конкретное модальное окно.
 * @param {HTMLElement} modals.modalName.modal - HTML элемент модального окна.
 * @param {Function} modals.modalName.closeModal - Метод для закрытия модального окна.
 */
export function addBackdropClickListener(modals) {
  document.getElementById('backdrop').addEventListener('click', () => {
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
