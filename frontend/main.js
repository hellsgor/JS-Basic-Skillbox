import '@styles/index.scss';
import getDataApi from '@api/get-data-api.js';

async function renderClients() {
  const clients = await getDataApi.getContacts();
  console.log(clients);
}

renderClients();
