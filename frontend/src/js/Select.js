import { createElement } from '@/helpers/create-element.js';
import { SELECTS } from '@/constants/selects.js';

/**
 * Представляет собой пользовательский компонент select.
 */
export class Select {
  /**
   * @param {HTMLElement} select - элемент select.
   * @param {HTMLButtonElement} button - кнопка селекта.
   * @param {HTMLSpanElement} buttonText - текст кнопки селекта.
   * @param {HTMLSpanElement} buttonArrow - стрелка кнопки селекта.
   * @param {HTMLUListElement} dropdown - выпадающий список.
   * @param {Object[] | null} optionsList - массив объектов для элементов списка.
   * @param {HTMLLIElement[] | null} options - массив элементов списка.
   * @param {Function | null} callback - функция обратного вызова при выборе опции.
   * @param {Function | null} documentClickHandler - обёртка для удаления слушателя события клика с document.
   * @param {string} selectClassName - CSS-класс селектора.
   * @param {Object} classNames - CSS-классы элементов селектора.
   * @param {Object} modifiers - модификаторы для CSS-классов элементов селектора.
   * @param {Object} actions - действия для переключения состояний компонента select.
   * @param {Object} errors - сообщения об ошибках.
   * @param {Object} attrs - атрибуты элементов компонента select.
   * */

  select = null;
  button = null;
  buttonText = null;
  buttonArrow = null;
  dropdown = null;
  optionsList = null;
  options = [];

  callback = null;

  documentClickHandler = null;

  classNames = {
    select: SELECTS.CLASS_NAMES.SELECT,
    button: SELECTS.CLASS_NAMES.BUTTON,
    buttonText: SELECTS.CLASS_NAMES.BUTTON_TEXT,
    buttonArrow: SELECTS.CLASS_NAMES.BUTTON_ARROW,
    dropdown: SELECTS.CLASS_NAMES.DROPDOWN,
    option: SELECTS.CLASS_NAMES.OPTION,
  };

  modifiers = {
    opened: SELECTS.MODIFIERS.OPENED,
    selected: SELECTS.MODIFIERS.SELECTED,
    visible: SELECTS.MODIFIERS.VISIBLE,
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
    dataSelectedValue: SELECTS.ATTRS.DATA_SELECTED_TYPE_VALUE,
  };

  /**
   * @description Создает экземпляр класса Select.
   * @constructor
   * @param {Object} props - Свойства для компонента Select.
   * @param {HTMLElement} props.select - Элемент select.
   * @param {Array<Object>} props.options - Список опций для выбора.
   * @param {string} props.options[].text - Текст опции.
   * @param {string} props.options[].value - Значение опции.
   * @param {Function} [props.callback] - Функция обратного вызова, которая будет вызвана при выборе опции.
   */
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

  /**
   * @description Получает необходимые элементы компонента select.
   */
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

  /**
   * @description Добавляет обработчики событий.
   */
  addEventsListeners() {
    this.button.addEventListener('click', () => this.toggleDropdown());
  }

  /**
   * @description Переключает состояние выпадающего списка опций.
   * @param {string|null} [action=null] - Действие: 'add' - добавить, 'remove' - удалить, null - переключить.
   */
  toggleDropdown(action = null) {
    this.select.classList[action || 'toggle'](
      `${this.classNames.select}_${this.modifiers.opened}`,
    );

    /**
     * добавление слушателя события click вне select для закрытия dropdown
     * */
    if (
      action === this.actions.add ||
      this.select.classList.contains(
        `${this.classNames.select}_${this.modifiers.opened}`,
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
        `${this.classNames.select}_${this.modifiers.opened}`,
      )
    ) {
      this.select.removeEventListener('click', this.documentClickHandler);
      document.removeEventListener('click', this.documentClickHandler);
    }
  }

  /**
   * @description Скрывает выпадающий список опций.
   * @param {MouseEvent} event - Событие клика вне компонента select.
   */
  hideDropdown(event) {
    if (!this.select.contains(event.target)) {
      this.select.classList.remove(
        `${this.classNames.select}_${this.modifiers.opened}`,
      );
      document.removeEventListener('click', this.documentClickHandler);
    }
  }

  /**
   * @description Выбирает опцию.
   * @param {Object} params - Объект события или объект.
   * @param {HTMLElement} params.target - Выбранный элемент списка или элемент переданный в свойстве объекта.
   */
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

  /**
   * @description Создает элементы списка для дропдауна.
   * @private
   */
  createOptions() {
    this.optionsList.forEach((option) => {
      const optionElement = createElement({
        tag: 'li',
        classes: 'select__option',
        text: option.text,
        attributes: [
          {
            name: `${this.attrs.dataSelectedValue}`,
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
}
