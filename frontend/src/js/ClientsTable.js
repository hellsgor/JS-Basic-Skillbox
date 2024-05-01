import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';
import { sortContactsTypes } from '@/helpers/sort-contacts-types.js';
import { preloader } from '@/js/Preloader.js';

/**
 * @description Класс для управления таблицей клиентов.
 * @param {Array || null} clients Список клиентов.
 * @param {HTMLTableSectionElement || null} tBody Элемент tbody таблицы, в который будут добавляться клиенты.
 * @param {Object || null} modals Модальные окна, используемые для клиентов.
 * @param {Array || null} sortedContactsTypes Отсортированные типы контактов.
 * @param {Object} preloader Прелоадер для ClientsTable
 * @param {HTMLElement | null} preloader.element Элемент прелоадера
 * @param {string} preloader.className CSS-класс контейнера для прелоадера
 */
class ClientsTable {
  clients = null;
  tBody = null;
  modals = null;
  sortedContactsTypes = sortContactsTypes();

  preloader = {
    element: null,
    className: 'clients__preloader',
  };

  /**
   * @description Создает экземпляр таблицы клиентов.
   * @param {HTMLTableSectionElement} tBody - Элемент tbody таблицы, в который будут добавляться клиенты.
   */
  constructor(tBody) {
    this.tBody = tBody || null;
    this.getElements();
  }

  /**
   * @description Определяет элементы необходимые классу
   * */
  getElements() {
    this.preloader.element = document.querySelector(
      `.${this.preloader.className}`,
    );
  }

  /**
   * @description Инициализирует список клиентов.
   * @param {Object} [modals=null] - Модальные окна, используемые для клиентов.
   * @returns {Promise<void>} - Промис, который разрешается после загрузки клиентов.
   */
  async initClients(modals = null) {
    if (this.preloader.element) {
      this.tBody.style = 'display: none;';
      preloader.show(this.preloader);
    }

    if (modals && !this.modals) {
      this.modals = modals;
    }

    if (this.clients) {
      this.removeAllClients();
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

    if (this.preloader.element) {
      preloader.hide(this.preloader);
      this.tBody.style = 'display: table-row-group';
    }
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

  removeAllClients() {
    this.clients.forEach((client) => {
      client.destroy();
    });
    this.clients = null;
  }
}

export const clientsTable = new ClientsTable(
  document.getElementById('table-body'),
);
