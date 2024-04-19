import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';

export class ClientsTable {
  clients = null;
  tBody = null;

  constructor(tBody) {
    this.tBody = tBody;
  }

  async renderClients() {
    await this.initClients();

    this.clients.forEach((client) => {
      this.addNewClient(client);
    });
  }

  renderNewClient(client) {
    this.addNewClient(client);
  }

  addNewClient(client) {
    const clientInstance = new Client(client);
    this.tBody.appendChild(clientInstance.getClientRow());
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
