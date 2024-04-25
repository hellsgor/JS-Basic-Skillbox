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

    try {
      const response = await clientsApi.getClients();
      this.clients = response.map((clientData) => {
        return new Client(clientData, this.modals, this.sortedContactsTypes);
      });
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error);
      this.clients = [];
    }
  }

  renderClients() {
    if (!this.tBody) {
      console.error('Элемент таблицы не найден');
      return;
    }

    this.clearTable();
    this.clients.forEach((client) => {
      this.renderClient(client);
    });
  }

  renderClient(client) {
    this.tBody.insertAdjacentElement('beforeend', client.getClientRow());
  }

  addClient(clientData) {
    this.clients.push(
      new Client(clientData, this.modals, this.sortedContactsTypes),
    );
  }

  removeClient(clientID) {
    const indexToRemove = this.clients.findIndex(
      (client) => client.clientData.id === clientID,
    );
    if (indexToRemove !== -1) {
      this.clients[indexToRemove].destroy();
      this.clients.splice(indexToRemove, 1);
    }
  }

  clearTable() {
    this.tBody.innerHTML = '';
  }

  // TODO: написать документацию в ClientsTable
}

export const clientsTable = new ClientsTable(
  document.getElementById('table-body'),
);
