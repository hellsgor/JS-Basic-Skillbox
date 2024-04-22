import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';

export class ClientsTable {
  clients = null;
  tBody = null;
  modals = null;

  constructor(tBody) {
    this.tBody = tBody || null;
  }

  async renderClients(modals) {
    this.modals = modals || null;
    await this.initClients();

    this.clients.forEach((client) => {
      this.addNewClient(client);
    });
  }

  renderNewClient(client) {
    this.addNewClient(client);
  }

  addNewClient(client) {
    this.tBody.appendChild(new Client(client, this.modals).getClientRow());
  }

  async initClients() {
    this.clients = await clientsApi.getClients();
  }

  // TODO: добавить destroy в ClientsTable
  // TODO: написать документацию в ClientsTable
}

export const clientsTable = new ClientsTable(
  document.getElementById('table-body'),
);
