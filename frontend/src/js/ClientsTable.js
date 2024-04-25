import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';
import { sortContactsTypes } from '@/helpers/sort-contacts-types.js';

class ClientsTable {
  clients = null;
  tBody = null;
  modals = null;
  sortedContactsTypes = null;

  constructor(tBody) {
    this.tBody = tBody || null;
    this.sortedContactsTypes = sortContactsTypes() || null;
  }

  async initClients(modals = null) {
    if (modals) {
      this.modals = modals;
    }

    this.clients = await clientsApi.getClients().then((response) =>
      response.map((clientData) => {
        return new Client(clientData, this.modals, this.sortedContactsTypes);
      }),
    );
  }

  renderClients() {
    this.clearTable();
    this.clients.forEach((client) => {
      this.renderClient(client);
    });
  }

  renderClient(client) {
    this.tBody.appendChild(client.getClientRow());
  }

  addClient(clientData) {
    this.clients.push(
      new Client(clientData, this.modals, this.sortedContactsTypes),
    );
  }

  removeClient(clientID) {
    this.clients = this.clients.filter((client) => {
      if (client.clientData.id === clientID) {
        client.destroy();
        client = null;
      } else {
        return client;
      }
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
