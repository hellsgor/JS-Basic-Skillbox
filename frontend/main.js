import '@styles/index.scss';
import { initModals } from '@/js/Modal.js';
import { autoInitForms } from '@/js/Form.js';
import { clientsTable } from '@/js/ClientsTable.js';
import { MODALS } from '@/constants/modals.js';

const addClientButton = document.getElementById('add-client-button');
const backdrop = document.getElementById('backdrop');
const modals = initModals();

await clientsTable.initClients(modals).then(() => clientsTable.renderClients());

addClientButton.addEventListener('click', () => {
  modals[MODALS.TEMPLATES.NEW_CLIENT].showModal();
});

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
