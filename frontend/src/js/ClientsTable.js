import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';

class ClientsTable {
  clients = null;
  tBody = null;
  modals = null;

  constructor(tBody) {
    this.tBody = tBody || null;
  }

  async initClients() {
    this.clients = await clientsApi.getClients();
  }

  renderClients(modals = null) {
    if (modals) {
      this.modals = modals;
    }

    this.clearTable();
    this.clients.forEach((client) => {
      this.renderClient(client);
    });
  }

  renderClient(client) {
    this.tBody.appendChild(new Client(client, this.modals).getClientRow());
  }

  addClient(client) {
    this.clients.push(client);
  }

  removeClient(clientID) {
    this.clients = this.clients.filter((client) => {
      return client.id !== clientID;
    });
  }

  clearTable() {
    this.tBody.innerHTML = '';
  }

  // TODO: добавить destroy в ClientsTable
  // TODO: написать документацию в ClientsTable
}

export const clientsTable = new ClientsTable(
  document.getElementById('table-body'),
);
