import { cloneTemplate } from '@/helpers/clone-template.js';
import { Select } from '@/js/Select.js';
import { contacts } from '@/constants/contacts.js';
import { PhoneMask } from '@/js/PhoneMask.js';

export class ModalContactControl {
  templateID = 'modal-contact-template';

  controlTemplate = null;
  contactControlInput = null;
  phoneMask = null;
  selectButton = null;
  deleteButton = null;
  controlID = null;

  classNames = {
    contactControlInput: contacts.classNames.input,
    contactTypeSelectButton: contacts.classNames.selectButton,
    deleteButton: contacts.classNames.deleteButton,
    parentClass: contacts.classNames.parentClass,
  };

  attrs = {
    selectedTypeValue: contacts.attrs.dataSelectedTypeValue,
    contactControlId: contacts.attrs.dataContactControlId,
  };

  constructor() {
    this.controlTemplate = cloneTemplate(this.templateID);
    this.getElements();
    this.setControlID();
    this.createContactSelect();
    this.addEvents();

    return this.controlTemplate;
  }

  createContactSelect() {
    new Select({
      select: this.controlTemplate.querySelector('.select'),
      callback: this.toggleContactType.bind(this),
    });
  }

  toggleContactType() {
    this.contactControlInput.type = Object.values(contacts.types).find(
      (type) =>
        type.value ===
        this.selectButton.getAttribute(this.attrs.selectedTypeValue),
    ).inputType;
    this.contactControlInput.value = '';
    this.contactControlInput.type === 'tel'
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
    this.contactControlInput = this.controlTemplate.querySelector(
      `.${this.classNames.contactControlInput}`,
    );
    this.selectButton = this.controlTemplate.querySelector(
      `.${this.classNames.contactTypeSelectButton}`,
    );
    this.deleteButton = this.controlTemplate.querySelector(
      `.${this.classNames.deleteButton}`,
    );
  }

  addEvents() {
    this.deleteButton.addEventListener('click', this.destroy.bind(this));
  }

  destroy() {
    this.deleteButton.removeEventListener('click', this.destroy.bind(this));
    document
      .querySelector(
        `.${this.classNames.parentClass}[${this.attrs.contactControlId}="${this.controlID}"]`,
      )
      .remove();
    this.controlTemplate = null;
    this.contactControlInput = null;
    this.phoneMask = null;
    this.selectButton = null;
    this.deleteButton = null;
    this.controlID = null;
  }

  setControlID() {
    this.controlID = Math.floor(1000 + Math.random() * 9000);
    this.controlTemplate
      .querySelector(`.${this.classNames.parentClass}`)
      .setAttribute(this.attrs.contactControlId, this.controlID);
  }

  // TODO: написать документацию в ModalContactControl
}
