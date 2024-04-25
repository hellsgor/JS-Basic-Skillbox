import { formatPhoneNumber } from '@/helpers/formatPhoneNumber.js';
import { extractPathWithoutExtension } from '@/helpers/extract-path-without-extension.js';
import { createElement } from '@/helpers/create-element.js';
import { CONTACTS } from '@/constants/contacts.js';

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

    let contactModifier = 'client__contact_';
    this.modifier ? (contactModifier += 'white') : (contactModifier += 'firm');
    this.contactElement.classList.add(contactModifier);

    if (this.contactsLength > 5 && this.contactIndex > 3) {
      this.contactElement.classList.add('client__contact_hidden');
    }
  }

  createContactIcon() {
    const contactIcon = createElement({
      tag: 'div',
      classes: this.modifier
        ? ['contact-icon', `contact-icon_${this.modifier}`]
        : 'contact-icon',
    });

    this.contactElement.appendChild(contactIcon);
  }

  createTooltip() {
    const tooltip = createElement({
      tag: 'div',
      classes: ['tooltip', 'tooltip_hidden'],
    });

    const tooltipWrapper = createElement({
      tag: 'div',
      classes: 'tooltip__wrapper',
    });

    if (!this.modifier) {
      tooltipWrapper.appendChild(
        createElement({
          tag: 'span',
          classes: 'tooltip__text',
          text: this.contact.type,
        }),
      );
    }

    tooltipWrapper.appendChild(
      createElement({
        tag: 'a',
        classes: 'tooltip__link',
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
    tooltip.appendChild(tooltipWrapper);
    this.contactElement.appendChild(tooltip);
  }

  setAdditionalContactProperties() {
    switch (this.contact.type) {
      case CONTACTS.TYPES.PHONE_NUMBER.text:
        this.modifier = CONTACTS.TYPES.PHONE_NUMBER.modifier;
        this.hrefPrefix = 'tel:';
        this.processedValue = formatPhoneNumber(this.contact.value);
        break;
      case CONTACTS.TYPES.ADDITIONAL_PHONE_NUMBER.text:
        this.modifier = CONTACTS.TYPES.ADDITIONAL_PHONE_NUMBER.modifier;
        this.hrefPrefix = 'tel:';
        this.processedValue = formatPhoneNumber(this.contact.value);
        break;
      case CONTACTS.TYPES.EMAIL.text:
        this.modifier = CONTACTS.TYPES.EMAIL.modifier;
        this.hrefPrefix = 'mailto:';
        break;
      case CONTACTS.TYPES.FACEBOOK.text:
        this.modifier = CONTACTS.TYPES.FACEBOOK.modifier;
        this.processedValue = extractPathWithoutExtension(
          this.contact.value,
          true,
        );
        break;
      case CONTACTS.TYPES.VK.text:
        this.modifier = CONTACTS.TYPES.VK.modifier;
        this.processedValue = extractPathWithoutExtension(
          this.contact.value,
          true,
        );
        break;
      case CONTACTS.TYPES.TWITTER.text:
        this.processedValue = extractPathWithoutExtension(
          this.contact.value,
          true,
        );
        break;
      default:
        break;
    }
  }

  // TODO: добавить метод destroy в Contact
  // TODO: написать документацию в Contact
  // TODO: вынести строки в константу
}
