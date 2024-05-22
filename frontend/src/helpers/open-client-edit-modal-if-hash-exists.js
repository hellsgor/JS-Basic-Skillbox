import clientsApi from '@api/Clients-api.js';
import { MODALS } from '@/constants/modals.js';

/**
 * Открывает модальное окно редактирования клиента, если в URL присутствует хэш с ID клиента.
 *
 * @param {Object} modals - Объект, содержащий модальные окна.
 * @param {Object} modals.EDIT_CLIENT - Объект, описывающий модальное окно для редактирования клиента.
 * @param {Function} modals.EDIT_CLIENT.showModal - Функция для показа модального окна.
 */
export function openClientEditModalIfHashExists(modals) {
  if (window.location.hash) {
    clientsApi
      .getClient({ id: window.location.hash.substring(1) })
      .then((response) => {
        modals[MODALS.TEMPLATES.EDIT_CLIENT].showModal(response);
      });
  }
}
