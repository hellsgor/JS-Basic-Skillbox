import '@styles/index.scss';
import { initModals } from '@/js/Modal.js';
import { autoInitForms } from '@/js/Form.js';
import { clientsTable } from '@/js/ClientsTable.js';
import { MODALS } from '@/constants/modals.js';
import { callModalFromModal } from '@/helpers/call-modal-from-modal.js';

const addClientButton = document.getElementById('add-client-button');
const backdrop = document.getElementById('backdrop');
const modals = initModals();

await clientsTable.initClients(modals).then(() => clientsTable.renderClients());

addClientButton.addEventListener('click', () => {
  modals[MODALS.TEMPLATES.NEW_CLIENT].showModal();
});

addModalsSwitchListeners();

backdrop.addEventListener('click', () => {
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

autoInitForms();

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
