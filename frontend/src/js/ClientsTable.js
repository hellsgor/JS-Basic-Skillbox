import getDataApi from '@api/get-data-api.js';
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
      const clientInstance = new Client(client);
      this.tBody.appendChild(clientInstance.getClientRow());
    });
  }

  async initClients() {
    this.clients = await getDataApi.getContacts();
  }
}
