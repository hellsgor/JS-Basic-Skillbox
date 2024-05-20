import clientsApi from '@api/clients-api.js';
import { Client } from '@/js/Client.js';
import { preloaderInstance } from './Preloader.js';

/**
 * @description Класс для управления таблицей клиентов.
 * @property {Array<Client> | null} clients Список клиентов.
 * @property {HTMLTableElement | null} table Элемент таблицы клиентов.
 * @property {HTMLTableCellElement[] | null} sortingCells Сортируемые ячейки.
 * @property {HTMLTableSectionElement | null} tBody Элемент tbody таблицы, в который будут добавляться клиенты.
 * @property {Object | null} modals Модальные окна, используемые для клиентов.
 * @property {Object} preloader Прелоадер для ClientsTable.
 * @property {HTMLElement | null} preloader.element Элемент прелоадера.
 * @property {string} preloader.className CSS-класс контейнера для прелоадера.
 * @property {Object} classNames CSS-классы элементов таблицы.
 * @property {string} classNames.headCell CSS-класс ячейки заголовка.
 * @property {string} classNames.sortableHeadCell CSS-класс сортируемой ячейки заголовка.
 * @property {string} classNames.activeSortableHeadCell CSS-класс активной сортируемой ячейки заголовка.
 * @property {string} classNames.reverseSort CSS-класс для обратной сортировки.
 * @property {string} defaultSortedCellId ID ячейки, по которой будут отсортированы клиенты при загрузке страницы.
 * @property {Object} attrs Атрибуты.
 * @property {string} attrs.dataSortName data-атрибут, определяющий способ сортировки клиентов.
 */
class ClientsTable {
  clients = null;
  table = null;
  sortingCells = null;
  tBody = null;
  modals = null;

  preloader = {
    element: null,
    className: 'clients__preloader',
  };

  classNames = {
    headCell: 'head-cell',
    sortableHeadCell: 'head-cell_sortable',
    activeSortableHeadCell: 'head-cell_active',
    reverseSort: 'head-cell_reverse',
  };

  defaultSortedCellId = 'head-col-id';

  attrs = {
    dataSortName: 'data-sort-name',
  };

  /**
   * @description Создает экземпляр таблицы клиентов.
   * @param {HTMLTableElement} table - Элемент таблицы.
   */
  constructor(table) {
    this.table = table || null;
    this.getElements();
    this.setDefaultSortedCell();
    this.createPreloader();
    this.addListeners();
  }

  /**
   * @description Определяет элементы, необходимые классу.
   */
  getElements() {
    this.tBody = this.table.querySelector('#table-body');
    this.sortingCells = Array.from(
      this.table
        .querySelector('thead')
        .querySelectorAll(`.${this.classNames.sortableHeadCell}`),
    );
    this.preloader.element = document.querySelector(
      `.${this.preloader.className}`,
    );
  }

  /**
   * @description Инициализирует список клиентов.
   * @param {Object} [modals=null] - Модальные окна, используемые для клиентов.
   * @param {Function} [getClientsCallback=null] - Функция для получения списка клиентов. Если не указана, используется clientsApi.getClients().
   * @param {...any} callbackArgs - Аргументы для функции getClientsCallback.
   * @returns {Promise<void>} - Промис, который разрешается после загрузки клиентов.
   */
  async initClients(modals = null, getClientsCallback = null, ...callbackArgs) {
    if (this.preloader.element) {
      this.hideTbody();
      this.showPreloader();
    }

    if (modals && !this.modals) {
      this.modals = modals;
    }

    if (this.clients && this.clients.length) {
      this.removeAllClients();
    }

    try {
      const response = getClientsCallback
        ? await getClientsCallback.call(clientsApi, ...callbackArgs)
        : await clientsApi.getClients();
      this.clients = response.map(
        (clientData) => new Client(clientData, this.modals),
      );
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
    this.sortClients(this.getSortingSigns());

    this.clients.forEach((client) => {
      this.renderClient(client);
    });

    if (this.preloader.element) {
      this.hidePreloader();
      this.showTbody();
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
   */
  removeAllClients() {
    this.clients.forEach((client) => client.destroy());
    this.clients = null;
  }

  /**
   * @description Создает прелоадер и добавляет его внутрь элемента прелоадера.
   */
  createPreloader() {
    this.preloader.element
      .querySelector(`.${this.preloader.className}-inner`)
      .appendChild(preloaderInstance.create());
  }

  /**
   * @description Получает информацию о текущем состоянии сортировки таблицы.
   * @returns {Object} Объект с информацией о сортировке.
   * @property {string} activeSortingCellAttribute - Атрибут сортировки активной ячейки.
   * @property {boolean} reverse - Флаг обратной сортировки.
   */
  getSortingSigns() {
    const activeHeadCell = this.sortingCells.find((cell) =>
      cell.classList.contains(this.classNames.activeSortableHeadCell),
    );

    return {
      activeSortingCellAttribute:
        activeHeadCell?.getAttribute(this.attrs.dataSortName) || null,
      reverse:
        activeHeadCell?.classList.contains(this.classNames.reverseSort) ||
        false,
    };
  }

  /**
   * @description Устанавливает класс активной сортировки на ячейку, по которой должна выполняться сортировка при загрузке страницы.
   */
  setDefaultSortedCell() {
    for (let i = 0; i < this.sortingCells.length; i++) {
      if (this.sortingCells[i].id === this.defaultSortedCellId) {
        this.sortingCells[i].classList.add(
          this.classNames.activeSortableHeadCell,
        );
        break;
      }
    }
  }

  /**
   * @description Устанавливает класс активной сортировки на ячейку таблицы при клике на неё.
   * Если ячейка уже была активной, изменяет направление сортировки.
   * @param {Event} event - Событие клика на ячейку таблицы.
   */
  setSortedCell(event) {
    const targetHeadCell = event.target.closest(`.${this.classNames.headCell}`);

    this.sortingCells.forEach((cell) => {
      if (targetHeadCell !== cell) {
        cell.classList.remove(
          this.classNames.activeSortableHeadCell,
          this.classNames.reverseSort,
        );
      }
    });

    if (
      targetHeadCell.classList.contains(this.classNames.activeSortableHeadCell)
    ) {
      targetHeadCell.classList.toggle(this.classNames.reverseSort);
    } else {
      targetHeadCell.classList.add(this.classNames.activeSortableHeadCell);
    }

    this.renderClients();
  }

  /**
   * @description Сортирует массив клиентов в соответствии с выбранным атрибутом сортировки и направлением сортировки.
   * @param {Object} options - Параметры сортировки.
   * @param {string} options.activeSortingCellAttribute - Атрибут сортировки активной ячейки.
   * @param {boolean} options.reverse - Флаг обратной сортировки.
   */
  sortClients({ activeSortingCellAttribute, reverse }) {
    if (!activeSortingCellAttribute) {
      this.setDefaultSortedCell();
    }

    /**
     * @description Извлекает соответствующее свойство из объекта clientData.
     * @param {Client} client - Объект клиента.
     * @param {string} property - Атрибут для извлечения из clientData.
     * @returns {string|number} - Значение свойства.
     */
    const getClientDataProperty = (client, property) => {
      switch (property) {
        case 'name':
          return `${client.clientData.surname} ${client.clientData.name} ${client.clientData.lastName}`;
        case 'create':
          return Date.parse(client.clientData.createdAt);
        case 'change':
          return Date.parse(client.clientData.updatedAt);
        default:
          return Number(client.clientData.id);
      }
    };

    this.clients.sort((a, b) => {
      const propA = getClientDataProperty(a, activeSortingCellAttribute);
      const propB = getClientDataProperty(b, activeSortingCellAttribute);

      if (propB === propA) {
        return 0;
      }
      return reverse ? (propB > propA ? 1 : -1) : propA > propB ? 1 : -1;
    });
  }

  /**
   * @description Добавляет слушатели событий клика на сортируемые ячейки таблицы.
   * При клике на ячейку вызывает метод setSortedCell для установки класса активной сортировки и изменения направления сортировки.
   */
  addListeners() {
    this.sortingCells.forEach((cell) => {
      cell.addEventListener('click', this.setSortedCell.bind(this));
    });
  }

  /**
   * @description Скрывает элемент tbody.
   */
  hideTbody() {
    this.tBody.style.display = 'none';
  }

  /**
   * @description Отображает прелоадер.
   */
  showPreloader() {
    preloaderInstance.show(this.preloader);
  }

  /**
   * @description Скрывает прелоадер.
   */
  hidePreloader() {
    preloaderInstance.hide(this.preloader);
  }

  /**
   * @description Отображает элемент tbody.
   */
  showTbody() {
    this.tBody.style.display = 'table-row-group';
  }
}

export const clientsTable = new ClientsTable(
  document.querySelector('.clients__table'),
);
