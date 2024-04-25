import { createElement } from '@/helpers/create-element.js';
import { Contact } from '@/js/Contact.js';
import { MODALS } from '@/constants/modals.js';
import clientsApi from '@api/Clients-api.js';

/**
 * Класс, представляющий клиента.
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
   */

  clientData = null;
  clientRow = null;
  sortedContactsTypes = null;
  clientButtons = [
    {
      text: 'Изменить',
      classes: ['action-button', 'action-button_change'],
      callback: this.editClient.bind(this),
      event: 'click',
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
   * @param sortedContactsTypes {Array} - Отсортированные типы контактов
   * */
  constructor(data, modals, sortedContactsTypes) {
    this.clientData = data;
    this.modals = modals || null;
    this.sortedContactsTypes = sortedContactsTypes || null;

    this.sortContacts();
    this.initClient();
  }

  /**
   * Возвращает строку, представляющую клиента в таблице.
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
   * Создает ячейку с датой.
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
      fragment.appendChild(
        new Contact({
          contact,
          contactIndex: idx,
          contactsLength: contacts.length,
          contactsCell,
        }).initContact(),
      );
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

    this.clientButtons.forEach(({ classes, text, event, callback }, idx) => {
      this.clientButtons[idx].domElement = createElement({
        tag: 'button',
        classes,
        text,
      });

      this.clientButtons[idx].domElement.addEventListener(event, callback);

      actionsCell.appendChild(this.clientButtons[idx].domElement);
    });
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
    clientsApi.getClient({ id: this.clientData.id }).then((response) => {
      this.modals[MODALS.TEMPLATES.EDIT_CLIENT].showModal(response);
    });
  }

  /**
   * @description Обрабатывает нажатие на кнопку "Удалить".
   */
  deleteClient() {
    this.modals[MODALS.TEMPLATES.DELETE_CLIENT].showModal(this.clientData);
  }

  /**
   * @description Сортирует контакты клиента
   * */
  sortContacts() {
    this.clientData.contacts = this.sortedContactsTypes.flatMap((type) => {
      return this.clientData.contacts.filter((contact) => {
        return contact.type === type.text;
      });
    });
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
    this.clientButtons.forEach((button) => {
      button.domElement.removeEventListener(button.event, button.callback);
      button = null;
    });
    this.clientButtons = null;
    this.modals = null;

    Object.setPrototypeOf(this, null);
  }
}
