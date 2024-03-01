import '@styles/index.scss';
import { ClientsTable } from '@/js/ClientsTable.js';
import { initModals } from '@/js/Modal.js';

const clientsTable = new ClientsTable(document.getElementById('table-body'));
const addClientButton = document.getElementById('add-client-button');

await clientsTable.renderClients();

const modals = initModals();

addClientButton.addEventListener('click', () => {
  modals['client'].showModal();
});
