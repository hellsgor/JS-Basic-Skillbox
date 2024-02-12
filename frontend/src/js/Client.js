import { createElement } from '@/helpers/create-element.js';
import { pudZero } from '@/helpers/pud-zero.js';

export class Client {
  data = null;

  clientRow = null;

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
    });

    this.clientRow.appendChild(
      createElement({
        tag: 'th',
        text: this.data.id.slice(-6),
        attributes: [['scope', 'row']],
      }),
    );

    this.clientRow.appendChild(
      createElement({
        tag: 'td',
        text: `${this.data.surname} ${this.data.name} ${this.data.lastName}`,
      }),
    );

    this.clientRow.appendChild(this.createDateCell(this.data.createdAt));
    this.clientRow.appendChild(this.createDateCell(this.data.updatedAt));
    this.clientRow.appendChild(this.createContacts(this.data.contacts));
  }

  createDateCell(str) {
    const newDate = new Date(str);

    const date = pudZero(newDate.getDate());
    const month =
      newDate.getMonth() + 1 > 12 ? '01' : pudZero(newDate.getMonth() + 1);
    const minutes = pudZero(newDate.getMinutes());

    return createElement({
      tag: 'td',
      html: `
      <span>${date}.${month}.${newDate.getFullYear()}</span>
      <span>${newDate.getHours()}:${minutes}</span>
    `,
    });
  }

  createContacts(contacts) {
    const contactCell = createElement({
      tag: 'td',
    });
    contacts.forEach((contact) => {
      let iconModifier = null;
      switch (contact.type) {
        case 'Телефон':
          iconModifier = 'phone';
          break;
        case 'Email':
          iconModifier = 'email';
          break;
        case 'Facebook':
          iconModifier = 'facebook';
          break;
        case 'VK':
          iconModifier = 'vk';
          break;
        default:
          iconModifier = 'default';
          break;
      }

      contactCell.appendChild(
        createElement({
          tag: 'div',
          classes: ['contact__icon', `contact__icon_${iconModifier}`],
        }),
      );
    });

    return contactCell;
  }
}
