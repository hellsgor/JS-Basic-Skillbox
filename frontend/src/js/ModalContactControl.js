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
    const currentType = Object.values(contacts.types).find(
      (type) =>
        type.value ===
        this.selectButton.getAttribute(this.attrs.selectedTypeValue),
    );
    this.contactControlInput.type = currentType.inputType;
    this.contactControlInput.value = '';
    currentType.inputType === 'tel'
      ? this.addPhoneMask()
      : this.removePhoneMask();
  }

  addPhoneMask() {
    this.phoneMask = new PhoneMask({
      control: this.contactControlInput,
    });
  }

  removePhoneMask() {
    if (this.phoneMask) {
      this.phoneMask.destroy();
      this.phoneMask = null;
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

  // TODO: написать документацию в ModalContactControl
  // TODO: добавить метод destroy в ModalContactControl
}
