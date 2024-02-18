import { createElement } from '@/helpers/create-element.js';
import { pudZero } from '@/helpers/pud-zero.js';
import { Contact } from '@/js/Contact.js';

export class Client {
  data = null;

  clientRow = null;

  clientButtons = [
    {
      text: 'Изменить',
      classes: ['button', 'button_action', 'button_change'],
      callback: this.changeClient.bind(this),
      event: 'click',
    },
    {
      text: 'Удалить',
      classes: ['button', 'button_action', 'button_delete'],
      callback: this.deleteClient.bind(this),
      event: 'click',
    },
  ];

  constructor(data) {
    this.data = data;
  }

  getClientRow() {
    this.initClient();
    return this.clientRow;
  }

  initClient() {
    this.clientRow = createElement({
      tag: 'tr',
      classes: 'client',
    });

    this.clientRow.appendChild(
      createElement({
        tag: 'th',
        text: this.data.id.slice(-6),
        attributes: [{ name: 'scope', value: 'row' }],
        classes: 'client__id',
      }),
    );

    this.clientRow.appendChild(
      createElement({
        tag: 'td',
        text: `${this.data.surname} ${this.data.name} ${this.data.lastName}`,
        classes: 'client__full-name',
      }),
    );

    this.clientRow.appendChild(this.createDateCell(this.data.createdAt));
    this.clientRow.appendChild(this.createDateCell(this.data.updatedAt));
    this.clientRow.appendChild(this.createContacts(this.data.contacts));
    this.clientRow.appendChild(this.createActions());
  }

  createDateCell(str) {
    const newDate = new Date(str);

    const date = pudZero(newDate.getDate());
    const month =
      newDate.getMonth() + 1 > 12 ? '01' : pudZero(newDate.getMonth() + 1);
    const minutes = pudZero(newDate.getMinutes());

    return createElement({
      tag: 'td',
      classes: 'client__date-cell',
      html: `
      <span class="client__date">${date}.${month}.${newDate.getFullYear()}</span>
      <time class="client__time" datetime="${str}">${newDate.getHours()}:${minutes}</time>
    `,
    });
  }

  createContacts(contacts) {
    const contactsCell = createElement({
      tag: 'td',
      classes: 'client__contacts-cell',
    });

    contacts.forEach((contact, idx) => {
      const newContact = new Contact({
        contact,
        contactIndex: idx,
        contactsLength: contacts.length,
        contactsCell,
      });
      contactsCell.appendChild(newContact.initContact());
    });

    if (contacts.length > 5) {
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
      contactsCell.appendChild(moreContactIcon);
    }

    return contactsCell;
  }

  createActions() {
    const actionsCell = createElement({
      tag: 'td',
      classes: 'client__buttons-cell',
    });

    this.clientButtons.forEach((btnProps) => {
      actionsCell.appendChild(
        createElement({
          tag: 'button',
          classes: btnProps.classes,
          text: btnProps.text,
          attributes: [
            {
              name: 'data-client-id',
              value: this.data.id,
            },
          ],
          callback: btnProps.callback,
        }),
      );
    });
    return actionsCell;
  }

  showAllContacts(contactsCell, moreIcon) {
    contactsCell
      .querySelectorAll('.client__contact_hidden')
      .forEach((hiddenContact) =>
        hiddenContact.classList.remove('client__contact_hidden'),
      );
    contactsCell.classList.add('client__contacts-cell_full');
    moreIcon.classList.add('client__contact_hidden');
  }

  changeClient() {
    console.log('change', this.data.id);
  }

  deleteClient() {
    console.log('delete', this.data.id);
  }
}
