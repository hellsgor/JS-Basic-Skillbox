import { createElement } from '@/helpers/create-element.js';
import { Contact } from '@/js/Contact.js';
import { MODALS } from '@/constants/modals.js';
import clientsApi from '@api/Clients-api.js';
import { preloaderInstance } from '@/js/Preloader.js';
import { sort } from '@/js/Sort.js';

/**
 * @description Класс, представляющий клиента.
 * @class
 */
export class Client {
  /**
   * @param clientData - Данные клиента.
   * @param {string} clientData.id - Уникальный идентификатор клиента.
   * @param {Date} clientData.createdAt - Дата и время создания клиента.
   * @param {Date} clientData.updatedAt - Дата и время последнего обновления клиента.
   * @param {string} clientData.name - Имя клиента.
   * @param {string} clientData.surname - Фамилия клиента.
   * @param {string=} clientData.lastName - Отчество клиента (необязательное свойство).
   * @param {Object[]} clientData.contacts - Массив контактов клиента.
   *
   * @param {Object} contact - Контакт клиента.
   * @param {string} contact.type - Тип контакта.
   * @param {string} contact.value - Значение контакта.
   *
   * @param {HTMLTableRowElement} clientRow - Строка, представляющая клиента в таблице.
   *
   * @param {Object[]} clientButtons - Массив кнопок действий клиента.
   *
   * @param {Object} clientButton - Входные данные для кнопки действия клиента.
   * @param {string} clientButton.text - Текст кнопки
   * @param {string[]} clientButton.text - Классы кнопки
   * @param {Function} clientButton.callback - Коллбэк для кнопки.
   * @param {string} clientButton.event - Имя события для запуска коллбэка.
   *
   * @param {Object} editButtonPreloader - Объект прелоадера для кнопки "Изменить".
   * @param {HTMLElement} editButtonPreloader.element - Элемент-контейнер для прелоадера.
   * @param {HTMLElement} editButtonPreloader.className - класс элемента-контейнера для прелоадера.
   */

  clientData = null;
  clientRow = null;
  sortedContactsTypes = null;
  editButtonPreloader = {
    element: null,
    className: 'action-button__preloader',
  };
  clientButtons = [
    {
      classes: ['action-button', 'action-button_change'],
      callback: this.editClient.bind(this),
      event: 'click',
      html: '<span>Изменить</span><div class="action-button__preloader action-button__preloader_hidden"></div>',
    },
    {
      text: 'Удалить',
      classes: ['action-button', 'action-button_delete'],
      callback: this.deleteClient.bind(this),
      event: 'click',
    },
  ];

  /**
   * @description Создает экземпляр клиента.
   * @param {object} data - Данные клиента.
   * @param modals {Object} - Модальные окна.
   * */
  constructor(data, modals) {
    this.clientData = data;
    this.modals = modals || null;
    this.clientData.contacts = sort.sortContacts(this.clientData);
    this.initClient();
  }

  /**
   * @description Возвращает строку, представляющую клиента в таблице.
   * @returns {HTMLTableRowElement} Строка таблицы.
   */
  getClientRow() {
    return this.clientRow;
  }

  /**
   * @description Инициализирует клиента.
   */
  initClient() {
    this.clientRow = createElement({
      tag: 'tr',
      classes: 'client',
    });

    this.clientRow.appendChild(
      createElement({
        tag: 'th',
        text: this.clientData.id.slice(-6),
        attributes: [{ name: 'scope', value: 'row' }],
        classes: 'client__id',
      }),
    );

    this.clientRow.appendChild(
      createElement({
        tag: 'td',
        text: `${this.clientData.surname} ${this.clientData.name} ${this.clientData.lastName}`,
        classes: 'client__full-name',
      }),
    );

    this.clientRow.appendChild(this.createDateCell(this.clientData.createdAt));
    this.clientRow.appendChild(this.createDateCell(this.clientData.updatedAt));
    this.clientRow.appendChild(this.createContacts(this.clientData.contacts));
    this.clientRow.appendChild(this.createActions());
  }

  /**
   * @description Создает ячейку с датой.
   * @param {string} str - Строка с датой.
   * @returns {HTMLTableCellElement} Ячейка таблицы с датой.
   */
  createDateCell(str) {
    const newDate = new Date(str);

    return createElement({
      tag: 'td',
      classes: 'client__date-cell',
      html: `
        <span class="client__date">
          ${newDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
        <time class="client__time" datetime="${str}">
          ${newDate.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      `,
    });
  }

  /**
   * @description Создает ячейку с контактами клиента.
   * @param {Array<Object>} contacts - Массив контактов клиента.
   * @returns {HTMLTableCellElement} Ячейка таблицы с контактами.
   */
  createContacts(contacts) {
    const contactsCell = createElement({
      tag: 'td',
      classes: 'client__contacts-cell',
    });

    const fragment = document.createDocumentFragment();
    contacts.forEach((contact, idx) => {
      const newContact = new Contact({
        contact,
        contactIndex: idx,
        contactsLength: contacts.length,
        contactsCell,
      });

      fragment.appendChild(newContact.initContact());
      newContact.destroy();
    });
    contactsCell.appendChild(fragment);

    if (contacts.length > 5) {
      contactsCell.appendChild(
        this.createMoreContactsIcon(contactsCell, contacts),
      );
    }

    return contactsCell;
  }

  /**
   * @description Создает ячейку с кнопками действий.
   * @returns {HTMLTableCellElement} Ячейка таблицы с кнопками действий.
   */
  createActions() {
    const actionsCell = createElement({
      tag: 'td',
      classes: 'client__buttons-cell',
    });

    this.clientButtons.forEach(
      ({ classes, text = null, event, callback, html = null }, idx) => {
        this.clientButtons[idx].domElement = createElement({
          tag: 'button',
          classes,
          text,
          html,
          event,
          callback,
        });

        this.addEditButtonPreloader(this.clientButtons[idx].domElement);

        actionsCell.appendChild(this.clientButtons[idx].domElement);
      },
    );
    return actionsCell;
  }

  /**
   * @description Показывает все контакты клиента.
   * @param {HTMLTableCellElement} contactsCell - Ячейка с контактами клиента.
   * @param {HTMLElement} moreIcon - Иконка "Еще контакты".
   */
  showAllContacts(contactsCell, moreIcon) {
    contactsCell
      .querySelectorAll('.client__contact_hidden')
      .forEach((hiddenContact) =>
        hiddenContact.classList.remove('client__contact_hidden'),
      );
    contactsCell.classList.add('client__contacts-cell_full');
    moreIcon.classList.add('client__contact_hidden');
  }

  /**
   * @description Обрабатывает нажатие на кнопку "Изменить".
   */
  editClient() {
    preloaderInstance.show(this.editButtonPreloader);
    clientsApi.getClient({ id: this.clientData.id }).then((response) => {
      this.modals[MODALS.TEMPLATES.EDIT_CLIENT].showModal(response);
      preloaderInstance.hide(this.editButtonPreloader);
    });
  }

  /**
   * @description Обрабатывает нажатие на кнопку "Удалить".
   */
  deleteClient() {
    this.modals[MODALS.TEMPLATES.DELETE_CLIENT].showModal(this.clientData);
  }

  /**
   * @description Создает иконку для отображения дополнительных контактов и добавляет обработчик клика для их отображения.
   * @param {HTMLElement} contactsCell - Ячейка таблицы, в которой отображаются контакты.
   * @param {Array<Object>} contacts - Массив объектов контактов.
   * @returns {HTMLDivElement} Созданная иконка для дополнительных контактов.
   */
  createMoreContactsIcon(contactsCell, contacts) {
    const moreContactIcon = createElement({
      tag: 'div',
      classes: ['contact-icon', 'contact-icon_more'],
    });

    moreContactIcon.appendChild(
      createElement({
        tag: 'span',
        text: `${contacts.length - 4}`,
      }),
    );
    moreContactIcon.addEventListener('click', () => {
      this.showAllContacts(contactsCell, moreContactIcon);
    });
    return moreContactIcon;
  }

  /**
   * @description Уничтожает экземпляр клиента.
   */
  destroy() {
    this.clientData = null;
    this.clientRow = null;
    this.modals = null;
    this.sortedContactsTypes = null;

    this.clientButtons.forEach((button) => {
      button.domElement.removeEventListener(button.event, button.callback);
      button = null;
    });
    this.clientButtons = null;

    Object.setPrototypeOf(this, null);
  }

  /**
   * @description Добавляет прелоадер в кнопку действия клиента при прохождении проверки.
   * @param {HTMLElement} clientButtonElement Элемент кнопки действия клиента.
   * */
  addEditButtonPreloader(clientButtonElement) {
    if (!clientButtonElement.classList.contains('action-button_change')) {
      return;
    }

    this.editButtonPreloader.element = clientButtonElement.querySelector(
      '.action-button__preloader',
    );
    this.editButtonPreloader.element.appendChild(preloaderInstance.create());
  }
}