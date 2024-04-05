import { cloneTemplate } from '@/helpers/clone-template.js';
import { Select } from '@/js/Select.js';
import { contacts } from '@/constants/contacts.js';
import { PhoneMask } from '@/js/PhoneMask.js';

export class ModalContactControl {
  templateID = 'modal-contact-template';

  control = null;
  contactControlInput = null;
  phoneMask = null;
  selectButton = null;

  classNames = {
    contactControlInput: contacts.classNames.input,
    contactTypeSelectButton: contacts.classNames.selectButton,
  };

  attrs = {
    selectedTypeValue: contacts.attrs.dataSelectedTypeValue,
  };

  constructor() {
    this.control = cloneTemplate(this.templateID);
    this.getElements();
    this.createContactSelect();

    return this.control;
  }

  createContactSelect() {
    new Select({
      select: this.control.querySelector('.select'),
      callback: this.toggleContactType.bind(this),
    });
  }

  toggleContactType() {
    this.contactControlInput.value = '';
    if (
      this.selectButton.getAttribute(this.attrs.selectedTypeValue) ===
        contacts.types.PHONE_NUMBER ||
      this.selectButton.getAttribute(this.attrs.selectedTypeValue) ===
        contacts.types.ADDITIONAL_PHONE_NUMBER
    ) {
      this.contactControlInput.type = 'tel';
      this.phoneMask = new PhoneMask({
        control: this.contactControlInput,
      });
    } else {
      if (this.phoneMask) {
        this.phoneMask.removeEventListeners();
        this.phoneMask = null;
      }

      if (
        this.selectButton.getAttribute(this.attrs.selectedTypeValue) ===
        contacts.types.EMAIL
      ) {
        this.contactControlInput.type = 'email';
      }

      if (
        this.selectButton.getAttribute(this.attrs.selectedTypeValue) ===
          contacts.types.VK ||
        this.selectButton.getAttribute(this.attrs.selectedTypeValue) ===
          contacts.types.FACEBOOK
      ) {
        this.contactControlInput.type = 'url';
      }
    }
  }

  getElements() {
    this.contactControlInput = this.control.querySelector(
      `.${this.classNames.contactControlInput}`,
    );
    this.selectButton = this.control.querySelector(
      `.${this.classNames.contactTypeSelectButton}`,
    );
  }
}
