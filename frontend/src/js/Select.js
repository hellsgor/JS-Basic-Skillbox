import { CONTACTS } from '@/constants/contacts.js';
import { createElement } from '@/helpers/create-element.js';

export class Select {
  select = null;
  button = null;
  buttonText = null;
  buttonArrow = null;
  dropdown = null;
  options = [];
  selected = null;

  callback = null;

  documentClickHandler = null;

  selectClassName = 'select';
  classNames = {
    button: `${this.selectClassName}__item`,
    buttonText: `${this.selectClassName}__item-text`,
    buttonArrow: `${this.selectClassName}__item-arrow`,
    dropdown: `${this.selectClassName}__dropdown`,
    option: `${this.selectClassName}__option`,
  };

  modifiers = {
    opened: 'opened',
    selected: 'selected',
    visible: 'visible',
  };

  actions = {
    remove: 'remove',
    add: 'add',
  };

  errors = {
    noSelectElement: 'Не передан элемент select',
    isCallbackFunction: 'Callback должен быть функцией',
  };

  attrs = {
    dataSelectedValue: CONTACTS.ATTRS.dataSelectedTypeValue,
  };

  constructor({ select, options, callback }) {
    if (!select) {
      throw new Error(this.errors.noSelectElement);
    }
    if (callback && typeof callback !== 'function') {
      throw new Error(this.errors.isCallbackFunction);
    }

    this.select = select || null;
    this.optionsList = options || [];
    this.callback = callback || null;

    this.documentClickHandler = this.hideDropdown.bind(this);

    this.getElements();
    this.createOptions();
    this.doSelected({ target: this.options[0] });
    this.addEventsListeners();
  }

  getElements() {
    if (!this.select) {
      return;
    }

    this.button = this.select.querySelector(`.${this.classNames.button}`);
    this.buttonText = this.select.querySelector(
      `.${this.classNames.buttonText}`,
    );
    this.buttonArrow = this.select.querySelector(
      `.${this.classNames.buttonArrow}`,
    );
    this.dropdown = this.select.querySelector(`.${this.classNames.dropdown}`);
  }

  addEventsListeners() {
    this.button.addEventListener('click', () => this.toggleDropdown());
  }

  toggleDropdown(action = null) {
    this.select.classList[action || 'toggle'](
      `${this.selectClassName}_${this.modifiers.opened}`,
    );

    /**
     * добавление слушателя события click вне select для закрытия dropdown
     * */
    if (
      action === this.actions.add ||
      this.select.classList.contains(
        `${this.selectClassName}_${this.modifiers.opened}`,
      )
    ) {
      document.addEventListener('click', this.documentClickHandler);
    }

    /**
     * удаление слушателя события click с документа при закрытии dropdown
     * */
    if (
      action === this.actions.remove ||
      !this.select.classList.contains(
        `${this.selectClassName}_${this.modifiers.opened}`,
      )
    ) {
      this.select.removeEventListener('click', this.documentClickHandler);
      document.removeEventListener('click', this.documentClickHandler);
    }
  }

  hideDropdown(event) {
    if (!this.select.contains(event.target)) {
      this.select.classList.remove(
        `${this.selectClassName}_${this.modifiers.opened}`,
      );
      document.removeEventListener('click', this.documentClickHandler);
    }
  }

  doSelected({ target }) {
    this.toggleDropdown(this.actions.remove);
    this.options.forEach((option) => {
      option.classList.remove(
        `${this.classNames.option}_${this.modifiers.selected}`,
      );
    });
    target.classList.add(
      `${this.classNames.option}_${this.modifiers.selected}`,
    );
    this.button.setAttribute(
      this.attrs.dataSelectedValue,
      target.getAttribute(this.attrs.dataSelectedValue),
    );
    this.buttonText.innerText = target.textContent;
    this.callback && this.callback(this.button);
  }

  createOptions() {
    this.optionsList.forEach((option) => {
      const optionElement = createElement({
        tag: 'li',
        classes: 'select__option',
        text: option.text,
        attributes: [
          {
            name: `${CONTACTS.ATTRS.dataSelectedTypeValue}`,
            value: option.value,
          },
        ],
        event: 'click',
        callback: (event) => this.doSelected(event),
      });

      this.options.push(optionElement);
      this.dropdown.appendChild(optionElement);
    });

    this.optionsList = null;
  }

  // TODO: написать документацию в Select
}
