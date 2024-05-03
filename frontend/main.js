import '@styles/index.scss';
import { initModals } from '@/js/Modal.js';
import { autoInitForms } from '@/js/Form.js';
import { clientsTable } from '@/js/ClientsTable.js';
import { MODALS } from '@/constants/modals.js';
import { callModalFromModal } from '@/helpers/call-modal-from-modal.js';
import { addBackdropClickListener } from '@/helpers/add-backdrop-click-listener.js';
import { openClientEditModalIfHashExists } from '@/helpers/open-client-edit-modal-if-hash-exists.js';

const modals = initModals();

hideLoader();

await clientsTable.initClients(modals).then(() => clientsTable.renderClients());

document.getElementById('add-client-button').addEventListener('click', () => {
  modals[MODALS.TEMPLATES.NEW_CLIENT].showModal();
});

addModalsSwitchListeners();
addBackdropClickListener(modals);
autoInitForms();
openClientEditModalIfHashExists(modals);

// --------------------------- конец основного кода ---------------------------

/**
 * Добавляет слушатели событий для переключения между модальными окнами.
 */
function addModalsSwitchListeners() {
  addModalSwitchListener(
    MODALS.TEMPLATES.EDIT_CLIENT,
    MODALS.TEMPLATES.DELETE_CLIENT,
    MODALS.CUSTOM_EVENTS.DELETE_MODAL_REQUEST,
  );

  addModalSwitchListener(
    MODALS.TEMPLATES.DELETE_CLIENT,
    MODALS.TEMPLATES.EDIT_CLIENT,
    MODALS.CUSTOM_EVENTS.EDIT_MODAL_REQUEST,
  );
}

/**
 * Добавляет слушатель события для переключения между модальными окнами.
 * @param {string} fromTemplate - Шаблон модального окна, с которого происходит переключение.
 * @param {string} toTemplate - Шаблон модального окна, на который происходит переключение.
 * @param {string} eventType - Тип события, по которому происходит переключение.
 */
function addModalSwitchListener(fromTemplate, toTemplate, eventType) {
  modals[fromTemplate].modal.addEventListener(eventType, (event) => {
    callModalFromModal({
      modals: modals,
      fromModalTemplate: fromTemplate,
      toModalTemplate: toTemplate,
      client: event.detail,
    });
  });
}

/**
 * @description Скрывает прелоадер для страницы и показывает header и main
 * */
function hideLoader() {
  document.querySelector('.loader').style = 'display: none;';
  document.querySelector('header.header').removeAttribute('style');
  document.querySelector('main').removeAttribute('style');
}
