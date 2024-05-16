import { debouncer } from '@/js/Debouncer.js';

class Search {
  searchComponent = null;
  control = null;

  classNames = {
    control: 'liner-control__input',
  };
  controlInputHandler = debouncer.debounce(this.getSearchResult, 300);

  constructor(searchComponent) {
    this.searchComponent = searchComponent || null;
  }

  init() {
    this.getElements();
    this.addListeners();
  }

  getElements() {
    this.control = this.searchComponent.querySelector(
      `.${this.classNames.control}`,
    );
  }

  addListeners() {
    this.control.addEventListener('input', this.controlInputHandler);
  }

  getSearchResult({ target }) {
    console.log(target.value);
  }
}

export const search = new Search(document.querySelector('.header__search'));
