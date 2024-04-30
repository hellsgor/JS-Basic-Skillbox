export class Select {
  select = null;
  button = null;
  buttonText = null;
  buttonArrow = null;
  dropdown = null;
  options = null;
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

  constructor({ select, callback }) {
    if (!select) {
      throw new Error(this.errors.noSelectElement);
    }
    if (callback && typeof callback !== 'function') {
      throw new Error(this.errors.isCallbackFunction);
    }

    this.select = select || null;
    this.callback = callback || null;

    this.documentClickHandler = this.hideDropdown.bind(this);

    this.getElements();
    this.addEventsListeners();
    this.doSelected(this.options[0]);
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
    this.options = this.select.querySelectorAll(`.${this.classNames.option}`);
  }

  addEventsListeners() {
    this.button.addEventListener('click', () => this.toggleDropdown());

    this.options.forEach((option) => {
      option.addEventListener('click', (event) =>
        this.doSelected(event.target),
      );
    });
  }

  toggleDropdown(action) {
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

  doSelected(target) {
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
      target.dataset.optionValue,
    );
    this.buttonText.innerText = target.textContent;
    this.callback && this.callback(this.button);
  }

  // TODO: написать документацию в Select
}
