import { createElement } from '@/helpers/create-element.js';
import { pudZero } from '@/helpers/pud-zero.js';
import { extractPathWithoutExtension } from '@/helpers/extract-path-without-extension.js';
import { formatPhoneNumber } from '@/helpers/formatPhoneNumber.js';

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
        attributes: [['scope', 'row']],
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
    const contactCell = createElement({
      tag: 'td',
      classes: 'client__contacts',
    });

    contacts.forEach((contact) => {
      let modifier = null;
      let hrefPrefix = null;
      let processedValue = null;
      switch (contact.type) {
        case 'Телефон':
          modifier = 'phone';
          hrefPrefix = 'tel:';
          processedValue = formatPhoneNumber(contact.value);
          break;
        case 'Email':
          modifier = 'email';
          hrefPrefix = 'mailto:';
          break;
        case 'Facebook':
          modifier = 'facebook';
          processedValue = extractPathWithoutExtension(contact.value);
          break;
        case 'VK':
          modifier = 'vk';
          processedValue = extractPathWithoutExtension(contact.value);
          break;
        default:
          modifier = 'default';
          break;
      }

      const contactElement = createElement({
        tag: 'div',
        classes: ['client__contact', `client__contact_${modifier}`],
      });

      contactElement.appendChild(
        createElement({
          tag: 'div',
          classes: ['client__contact-icon', `client__contact-icon_${modifier}`],
        }),
      );

      const tooltip = createElement({
        tag: 'div',
        classes: ['client__contact-tooltip', 'contact-tooltip'],
      });

      tooltip.appendChild(
        createElement({
          tag: 'a',
          text: processedValue ? processedValue : contact.value,
          attributes: [
            {
              name: 'href',
              value: `${hrefPrefix ? hrefPrefix : ''}${contact.value}`,
            },
            {
              name: 'target',
              value: '_blank',
            },
          ],
        }),
      );

      contactElement.appendChild(tooltip);

      contactCell.appendChild(contactElement);
    });

    return contactCell;
  }

  createActions() {
    const actionsCell = createElement({
      tag: 'td',
      classes: 'contact__action-buttons',
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

  changeClient() {
    console.log('change', this.data.id);
  }

  deleteClient() {
    console.log('delete', this.data.id);
  }
}
