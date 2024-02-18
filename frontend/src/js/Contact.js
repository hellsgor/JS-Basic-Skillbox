import { formatPhoneNumber } from '@/helpers/formatPhoneNumber.js';
import { extractPathWithoutExtension } from '@/helpers/extract-path-without-extension.js';
import { createElement } from '@/helpers/create-element.js';

export class Contact {
  contact = null;
  contactsLength = null;
  contactIndex = null;
  contactsCell = null;

  modifier = null;
  hrefPrefix = null;
  processedValue = null;

  contactElement = null;

  constructor(props) {
    this.contact = props.contact || null;
    this.contactIndex = props.contactIndex || null;
    this.contactsLength = props.contactsLength || null;
    this.contactsCell = props.contactsCell || null;
  }

  initContact() {
    this.createContact();
    return this.contactElement;
  }

  createContact() {
    this.setAdditionalContactProperties();
    this.contactElement = createElement({
      tag: 'div',
      classes: ['client__contact'],
    });
    this.createContactIcon();
    this.createTooltip();

    if (this.contactsLength > 5 && this.contactIndex > 3) {
      this.contactElement.classList.add('client__contact_hidden');
    }

    let contactModifier = 'client__contact_';
    this.modifier ? (contactModifier += 'white') : (contactModifier += 'firm');
    this.contactElement.classList.add(contactModifier);
  }

  createContactIcon() {
    const contactIcon = createElement({
      tag: 'div',
      classes: this.modifier
        ? ['contact-icon', `contact-icon_${this.modifier}`]
        : 'contact-icon',
    });

    contactIcon.addEventListener('mouseenter', () => {
      this.hideAllTooltips();
      this.showContactTooltip();
    });

    this.contactElement.appendChild(contactIcon);

    // TODO: добавить события на иконки контактов для показа и скрытия тултипов
  }

  createTooltip() {
    const tooltip = createElement({
      tag: 'div',
      classes: ['contact-tooltip', 'contact-tooltip_hidden'],
    });

    if (!this.modifier) {
      tooltip.appendChild(
        createElement({
          tag: 'span',
          text: this.contact.type,
        }),
      );
    }

    tooltip.appendChild(
      createElement({
        tag: 'a',
        text: this.processedValue ? this.processedValue : this.contact.value,
        attributes: [
          {
            name: 'href',
            value: `${this.hrefPrefix ? this.hrefPrefix : ''}${this.contact.value}`,
          },
          {
            name: 'target',
            value: '_blank',
          },
        ],
      }),
    );

    this.contactElement.appendChild(tooltip);
  }

  setAdditionalContactProperties() {
    switch (this.contact.type) {
      case 'Телефон':
        this.modifier = 'phone';
        this.hrefPrefix = 'tel:';
        this.processedValue = formatPhoneNumber(this.contact.value);
        break;
      case 'Email':
        this.modifier = 'email';
        this.hrefPrefix = 'mailto:';
        break;
      case 'Facebook':
        this.modifier = 'facebook';
        this.processedValue = extractPathWithoutExtension(this.contact.value);
        break;
      case 'VK':
        this.modifier = 'vk';
        this.processedValue = extractPathWithoutExtension(this.contact.value);
        break;
      case 'Twitter':
        this.processedValue = extractPathWithoutExtension(
          this.contact.value,
          true,
        );
        break;
      default:
        break;
    }
  }

  showContactTooltip() {
    this.contactElement
      .querySelector('.contact-tooltip')
      .classList.remove('contact-tooltip_hidden');
  }

  hideAllTooltips() {
    this.contactsCell
      .querySelectorAll('.contact-tooltip')
      .forEach((tooltip) => {
        tooltip.classList.add('contact-tooltip_hidden');
      });
  }
}
