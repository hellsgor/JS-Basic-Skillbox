import { MODALS } from '@/constants/modals.js';

/**
 * Добавляет обработчик клика на кнопку с ID 'add-client-button', который открывает модальное окно для добавления нового клиента.
 *
 * @param {Object} modals - Объект, содержащий модальные окна.
 * @param {Object} modals.NEW_CLIENT - Объект, описывающий модальное окно для добавления нового клиента.
 * @param {Function} modals.NEW_CLIENT.showModal - Функция для показа модального окна.
 */
export function handleAddClientButtonClick(modals) {
  document.getElementById('add-client-button').addEventListener('click', () => {
    modals[MODALS.TEMPLATES.NEW_CLIENT].showModal();
  });
}
