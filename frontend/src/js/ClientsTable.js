import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';
import { sortContactsTypes } from '@/helpers/sort-contacts-types.js';

/**
 * @description Класс для управления таблицей клиентов.
 * @param {Array || null} clients Список клиентов.
 * @param {HTMLTableSectionElement || null} tBody - Элемент tbody таблицы, в который будут добавляться клиенты.
 * @param {Object || null} modals Модальные окна, используемые для клиентов.
 * @param {Array || null} sortedContactsTypes Отсортированные типы контактов.
 */
class ClientsTable {
  clients = null;
  tBody = null;
  modals = null;
  sortedContactsTypes = sortContactsTypes();

  /**
   * @description Создает экземпляр таблицы клиентов.
   * @param {HTMLTableSectionElement} tBody - Элемент tbody таблицы, в который будут добавляться клиенты.
   */
  constructor(tBody) {
    this.tBody = tBody || null;
  }

  /**
   * @description Инициализирует список клиентов.
   * @param {Object} [modals=null] - Модальные окна, используемые для клиентов.
   * @returns {Promise<void>} - Промис, который разрешается после загрузки клиентов.
   */
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

  /**
   * @description Рендерит список клиентов в таблицу.
   */
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

  /**
   * @description Рендерит клиента в таблицу.
   * @param {Client} client - Клиент для рендеринга.
   */
  renderClient(client) {
    this.tBody.insertAdjacentElement('beforeend', client.getClientRow());
  }

  /**
   * @description Добавляет нового клиента в список.
   * @param {Object} clientData - Данные нового клиента.
   */
  addClient(clientData) {
    this.clients.push(
      new Client(clientData, this.modals, this.sortedContactsTypes),
    );
  }

  /**
   * @description Удаляет клиента из списка.
   * @param {string || null} clientID - Идентификатор клиента для удаления.
   */
  removeClient(clientID) {
    const indexToRemove = this.clients.findIndex(
      (client) => client.clientData.id === clientID,
    );
    if (indexToRemove !== -1) {
      this.clients[indexToRemove].destroy();
      this.clients.splice(indexToRemove, 1);
    }
  }

  /**
   * @description Очищает таблицу.
   */
  clearTable() {
    this.tBody.innerHTML = '';
  }
}

export const clientsTable = new ClientsTable(
  document.getElementById('table-body'),
);
