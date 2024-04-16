import '@styles/index.scss';
import { initModals } from '@/js/Modal.js';
import { autoInitForms } from '@/js/Form.js';
import { clientsTable } from '@/js/ClientsTable.js';

await clientsTable.renderClients();

const addClientButton = document.getElementById('add-client-button');
const backdrop = document.getElementById('backdrop');
const modals = initModals();

addClientButton.addEventListener('click', () => {
  modals['new-client'].showModal();
});

backdrop.addEventListener('click', () => {
  Object.keys(modals).forEach((modalName) => {
    if (modals[modalName].modal.classList.contains('modal_hidden')) {
      return;
    }
    modals[modalName].closeModal();
  });
});

autoInitForms();
