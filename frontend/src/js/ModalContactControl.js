import { cloneTemplate } from '@/helpers/clone-template.js';
import { Select } from '@/js/Select.js';
import { CONTACTS } from '@/constants/contacts.js';
import { PhoneMask } from '@/js/PhoneMask.js';
import { sort } from '@/js/Sort.js';

/**
 * @description - Класс для управления контактом в модальном окне.
 * @class
 * @param {string} templateID Идентификатор шаблона элемента контакта модального окна.
 * @param {HTMLElement || null} controlTemplate Шаблон контактного элемента модального окна.
 * @param {HTMLInputElement || null} contactControlInput Элемент ввода контактной информации.
 * @param {PhoneMask || null} phoneMask Экземпляр маски для номера телефона.
 * @param {HTMLButtonElement || null} selectButton Кнопка селекта типа контакта.
 * @param {HTMLButtonElement || null} deleteButton Кнопка удаления элемента контакта.
 * @param {number || null} controlID  Идентификатор элемента контакта.
 * @param {Object} classNames CSS-классы для элементов контрола.
 * @param {Object} attrs data-атрибуты для элементов контрола.
 * @param {string} selectedTypeValue - data-атрибут селекта для хранения выбранного из списка значения.
 * @param {string} contactControlId - data-атрибут контрола для хранения его id.
 */
export class ModalContactControl {
  templateID = 'modal-contact-template';

  controlTemplate = null;
  contactControlInput = null;
  phoneMask = null;
  selectButton = null;
  deleteButton = null;
  controlID = null;
  contactData = null;

  classNames = {
    contactControlInput: CONTACTS.CLASS_NAMES.input,
    contactTypeSelectButton: CONTACTS.CLASS_NAMES.selectButton,
    contactTypeSelectButtonText: CONTACTS.CLASS_NAMES.selectButtonText,
    deleteButton: CONTACTS.CLASS_NAMES.deleteButton,
    parentClass: CONTACTS.CLASS_NAMES.parentClass,
  };

  attrs = {
    selectedTypeValue: CONTACTS.ATTRS.dataSelectedTypeValue,
    contactControlId: CONTACTS.ATTRS.dataContactControlId,
  };

  /**
   * @description - Создает экземпляр ModalContactControl.
   * @constructor
   * @returns {DocumentFragment} - контент шаблона контрола контакта
   */
  constructor(contact = null) {
    this.contactData = contact;

    this.controlTemplate = cloneTemplate(this.templateID);
    this.getElements();
    this.setControlID();
    this.createContactSelect();
    this.addEvents();
    this.setContactData();

    return this.controlTemplate;
  }

  /**
   * @description Создает выпадающий список типов контакта.
   */
  createContactSelect() {
    new Select({
      select: this.controlTemplate.querySelector('.select'),
      options: sort.sortContactsTypes(),
      callback: this.toggleContactType.bind(this),
    });
  }

  /**
   * @description Переключает тип контакта в зависимости от выбранного значения в выпадающем списке.
   */
  toggleContactType() {
    this.contactControlInput.type = Object.values(CONTACTS.TYPES).find(
      (type) =>
        type.value ===
        this.selectButton.getAttribute(this.attrs.selectedTypeValue),
    ).inputType;
    this.contactControlInput.value = '';
    this.contactControlInput.type === 'tel'
      ? this.addPhoneMask()
      : this.removePhoneMask();
  }

  /**
   * @description Добавляет маску для ввода номера телефона.
   */
  addPhoneMask() {
    this.phoneMask = new PhoneMask({
      control: this.contactControlInput,
    });
  }

  /**
   * @description Удаляет маску для ввода номера телефона.
   */
  removePhoneMask() {
    if (this.phoneMask) {
      this.phoneMask.destroy();
      this.phoneMask = null;
    }
  }

  /**
   * @description Получает ссылки на элементы из шаблона.
   */
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

  /**
   * @description Добавляет обработчики событий.
   */
  addEvents() {
    this.deleteButton.addEventListener('click', () => {
      this.destroy();
    });
  }

  /**
   * @description Удаляет элемент контакта и его обработчики событий.
   */
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
    this.contactData = null;
  }

  /**
   * @description Генерирует уникальный идентификатор элемента контакта.
   */
  setControlID() {
    this.controlID = Math.floor(1000 + Math.random() * 9000);
    this.controlTemplate
      .querySelector(`.${this.classNames.parentClass}`)
      .setAttribute(this.attrs.contactControlId, this.controlID);
  }

  /**
   * @description  - Устанавливает данные контакта в контрол
   * */
  setContactData() {
    if (!this.contactData) {
      return;
    }
    const currentType = Object.values(CONTACTS.TYPES).find(
      (type) => type.text === this.contactData.type,
    );

    this.selectButton.querySelector(
      `.${this.classNames.contactTypeSelectButtonText}`,
    ).innerText = currentType.text;

    this.selectButton.setAttribute(
      this.attrs.selectedTypeValue,
      currentType.value,
    );

    this.contactControlInput.type = currentType.inputType;

    this.contactControlInput.type === 'tel'
      ? this.addPhoneMask()
      : this.removePhoneMask();

    this.contactControlInput.value = this.contactData.value;
    this.phoneMask &&
      this.phoneMask.onPhoneInput({
        target: this.contactControlInput,
        data: '',
      });
  }
}
