import '@styles/index.scss';
import { ClientsTable } from '@/js/ClientsTable.js';
import { initModals } from '@/js/Modal.js';

const clientsTable = new ClientsTable(document.getElementById('table-body'));
const addClientButton = document.getElementById('add-client-button');
const backdrop = document.getElementById('backdrop');
const modals = initModals();

await clientsTable.renderClients();

addClientButton.addEventListener('click', () => {
  modals['client'].showModal();
});

backdrop.addEventListener('click', () => {
  Object.keys(modals).forEach((modalName) => {
    if (modals[modalName].modal.classList.contains('modal_hidden')) {
      return;
    }
    modals[modalName].closeModal();
  });
});
