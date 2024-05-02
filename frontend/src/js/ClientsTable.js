import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';
import { sortContactsTypes } from '@/helpers/sort-contacts-types.js';
import { preloaderInstance } from './Preloader.js';

/**
 * @description Класс для управления таблицей клиентов.
 * @param {Array || null} clients Список клиентов.
 * @param {HTMLTableElement | null} table Элемент таблицы клиентов.
 * @param {HTMLTableCellElement[] | null} sortingCells Сортируемые ячейки.
 * @param {HTMLTableSectionElement || null} tBody Элемент tbody таблицы, в который будут добавляться клиенты.
 * @param {Object || null} modals Модальные окна, используемые для клиентов.
 * @param {Array || null} sortedContactsTypes Отсортированные типы контактов.
 * @param {Object} preloader Прелоадер для ClientsTable
 * @param {HTMLElement | null} preloader.element Элемент прелоадера
 * @param {string} preloader.className CSS-класс контейнера для прелоадера
 */
class ClientsTable {
  clients = null;
  table = null;
  sortingCells = null;
  tBody = null;
  modals = null;
  sortedContactsTypes = sortContactsTypes();

  preloader = {
    element: null,
    className: 'clients__preloader',
  };

  /**
   * @description Создает экземпляр таблицы клиентов.
   * @param {HTMLTableSectionElement} table - Элемент таблицы.
   */
  constructor(table) {
    this.table = table || null;
    this.getElements();
    this.createPreloader();
  }

  /**
   * @description Определяет элементы необходимые классу
   * */
  getElements() {
    this.tBody = this.table.querySelector('#table-body');
    this.sortingCells = Array.from(
      this.table
        .querySelector('thead')
        .querySelectorAll(`.${this.classNames.sortableHeadCells}`),
    );
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
      preloaderInstance.show(this.preloader);
    }

    if (modals && !this.modals) {
      this.modals = modals;
    }

    if (this.clients && this.clients.length) {
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
      preloaderInstance.hide(this.preloader);
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
   * @description Очищает таблицу.
   */
  clearTable() {
    this.tBody.innerHTML = '';
  }

  /**
   * @description Удаляет всех клиентов.
   * */
  removeAllClients() {
    this.clients.forEach((client) => {
      client.destroy();
    });
    this.clients = null;
  }

  /**
   * @description Создает прелоадер и добавляет его внутрь элемента прелоадера.
   * */
  createPreloader() {
    this.preloader.element
      .querySelector(`.${this.preloader.className}-inner`)
      .appendChild(preloaderInstance.create());
  }
}

export const clientsTable = new ClientsTable(
  document.querySelector('.clients__table'),
);
